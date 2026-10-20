import {CART_ATTR, LINE_ATTR, STORE} from '~/lib/store-config';
import type {
  Attribute,
  Cart,
  CartLine,
  Commerce,
  Product,
} from '~/lib/commerce/types';
import type {GiftOffer} from '~/lib/offer';

const hasAttr = (attrs: Attribute[], key: string) =>
  attrs.some((a) => a.key === key);

export const isFreeGiftLine = (line: CartLine) =>
  hasAttr(line.attributes, LINE_ATTR.freeGift);
export const isGiftWrapLine = (line: CartLine) =>
  hasAttr(line.attributes, LINE_ATTR.giftWrap);
export const isGiftBoxLine = (line: CartLine) =>
  hasAttr(line.attributes, LINE_ATTR.giftBox);
/** Lines the storefront manages; customers can only remove their trigger. */
export const isManagedLine = (line: CartLine) =>
  isFreeGiftLine(line) || isGiftWrapLine(line);

export const cartAttr = (cart: Cart | null, key: string) =>
  cart?.attributes.find((a) => a.key === key)?.value ?? '';

/** Lines from the offer's collection that unlock the gift (never the gift itself). */
const qualifyingLines = (cart: Cart | null, offer: GiftOffer) =>
  (cart?.lines ?? []).filter(
    (line) =>
      !isManagedLine(line) &&
      line.merchandise.product.collections.includes(offer.buyCollection),
  );

export function qualifiesForFreeGift(cart: Cart | null, offer: GiftOffer) {
  return qualifyingLines(cart, offer).length > 0;
}

/**
 * The most a chosen gift may cost. Shopify's Buy X Get Y discount always
 * makes the cheapest eligible item free, so a gift dearer than the perfume
 * bought would leave the gift charged and the purchase free instead.
 */
export function giftPriceLimit(cart: Cart | null, offer: GiftOffer) {
  const prices = qualifyingLines(cart, offer).map((l) =>
    Number(l.merchandise.price.amount),
  );
  return prices.length ? Math.min(...prices) : 0;
}

export type GiftOption = {
  variantId: string;
  handle: string;
  title: string;
  price: Product['price'];
  image: Product['image'];
  art?: Product['art'];
};

export type FreeGiftState =
  | {status: 'none'}
  | {status: 'unlocked'; giftTitle: string; options: GiftOption[]}
  | {status: 'choose'; options: GiftOption[]}
  | {status: 'out_of_stock'};

/** Products the customer may pick, cheapest first. */
export async function getGiftOptions(
  commerce: Commerce,
  cart: Cart | null,
  offer: GiftOffer,
): Promise<GiftOption[]> {
  if (offer.getProduct || !offer.getCollection) return [];
  if (!qualifiesForFreeGift(cart, offer)) return [];
  const collection = await commerce.getCollection(offer.getCollection);
  const limit = giftPriceLimit(cart, offer);
  return (collection?.products ?? [])
    .flatMap((p) => {
      const v = p.variants.find((x) => x.availableForSale);
      if (!v || Number(v.price.amount) > limit) return [];
      return [
        {
          variantId: v.id,
          handle: p.handle,
          title: p.title,
          price: v.price,
          image: p.image,
          art: p.art,
        },
      ];
    })
    .sort((a, b) => Number(a.price.amount) - Number(b.price.amount));
}

export function getFreeGiftState(
  cart: Cart | null,
  offer: GiftOffer,
  {giftAvailable, options}: {giftAvailable: boolean; options: GiftOption[]},
): FreeGiftState {
  const giftLine = cart?.lines.find(isFreeGiftLine);
  if (giftLine) {
    return {
      status: 'unlocked',
      giftTitle: giftLine.merchandise.product.title,
      options,
    };
  }
  if (!qualifiesForFreeGift(cart, offer)) return {status: 'none'};
  if (offer.getProduct) {
    return giftAvailable ? {status: 'none'} : {status: 'out_of_stock'};
  }
  return options.length ? {status: 'choose', options} : {status: 'out_of_stock'};
}

/**
 * Keeps storefront-managed lines in step with the rest of the cart. Runs
 * after every cart mutation:
 * - Free gift (Buy X Get Y): added once a qualifying product is in the
 *   cart. With a fixed gift product that product is added; with a gift
 *   collection the cheapest one is, and the customer can swap it (see
 *   chooseFreeGift). Either way it goes when the last
 *   qualifying product goes, and there is never more than one. If the gift
 *   is out of stock nothing is added, and the UI shows a message instead.
 * - Gift wrap: one wrap line while the "Gift wrap" cart attribute is "Yes".
 * The price of the gift line is set by the automatic discount in Shopify
 * admin; the storefront only manages its presence.
 */
export async function syncManagedLines(commerce: Commerce, offer: GiftOffer) {
  let cart = await commerce.cart.get();
  if (!cart) return null;

  const qualifies = qualifiesForFreeGift(cart, offer);
  if (offer.getProduct) {
    cart = await syncLine(commerce, cart, {
      want: qualifies,
      isLine: isFreeGiftLine,
      handle: offer.getProduct,
      attribute: LINE_ATTR.freeGift,
    });
  } else {
    // A chosen gift stays only while it is still allowed.
    const limit = giftPriceLimit(cart, offer);
    const stale = cart.lines.filter(
      (l, i, all) =>
        isFreeGiftLine(l) &&
        (!qualifies ||
          !l.merchandise.product.collections.includes(offer.getCollection ?? '') ||
          Number(l.merchandise.price.amount) > limit ||
          all.findIndex(isFreeGiftLine) !== i),
    );
    if (stale.length) {
      cart = (await commerce.cart.removeLines(stale.map((l) => l.id))) ?? cart;
    }
    const kept = cart.lines.find(isFreeGiftLine);
    if (kept && kept.quantity !== 1) {
      cart = (await commerce.cart.updateLines([{id: kept.id, quantity: 1}])) ?? cart;
    }
    // Start with the cheapest gift; the customer can swap it in the cart.
    if (qualifies && !kept) {
      const [cheapest] = await getGiftOptions(commerce, cart, offer);
      if (cheapest) {
        cart =
          (await commerce.cart.addLines([
            {
              merchandiseId: cheapest.variantId,
              quantity: 1,
              attributes: [{key: LINE_ATTR.freeGift, value: 'true'}],
            },
          ])) ?? cart;
      }
    }
  }

  cart = await syncLine(commerce, cart, {
    want: cartAttr(cart, CART_ATTR.giftWrap) === 'Yes' && cart.lines.some(
      (l) => !isManagedLine(l),
    ),
    isLine: isGiftWrapLine,
    handle: STORE.products.giftWrap,
    attribute: LINE_ATTR.giftWrap,
  });

  return cart;
}

/** Swaps in the customer's chosen gift. Returns an error key or null. */
export async function chooseFreeGift(
  commerce: Commerce,
  offer: GiftOffer,
  variantId: string,
) {
  const cart = await commerce.cart.get();
  const options = await getGiftOptions(commerce, cart, offer);
  if (!options.some((o) => o.variantId === variantId)) return 'gwp.unavailable' as const;

  const current = cart?.lines.filter(isFreeGiftLine) ?? [];
  if (current.length) await commerce.cart.removeLines(current.map((l) => l.id));
  await commerce.cart.addLines([
    {
      merchandiseId: variantId,
      quantity: 1,
      attributes: [{key: LINE_ATTR.freeGift, value: 'true'}],
    },
  ]);
  return null;
}

async function syncLine(
  commerce: Commerce,
  cart: Cart,
  opts: {
    want: boolean;
    isLine: (line: CartLine) => boolean;
    handle: string;
    attribute: string;
  },
): Promise<Cart> {
  const lines = cart.lines.filter(opts.isLine);

  if (!opts.want) {
    if (!lines.length) return cart;
    return (await commerce.cart.removeLines(lines.map((l) => l.id))) ?? cart;
  }

  if (lines.length) {
    const [keep, ...extra] = lines;
    if (extra.length) {
      cart = (await commerce.cart.removeLines(extra.map((l) => l.id))) ?? cart;
    }
    if (keep.quantity !== 1) {
      cart =
        (await commerce.cart.updateLines([{id: keep.id, quantity: 1}])) ?? cart;
    }
    return cart;
  }

  const product = await commerce.getProduct(opts.handle);
  const variant = product?.variants.find((v) => v.availableForSale);
  if (!variant) return cart; // Out of stock: the UI explains, the cart stays valid.

  return (
    (await commerce.cart.addLines([
      {
        merchandiseId: variant.id,
        quantity: 1,
        attributes: [{key: opts.attribute, value: 'true'}],
      },
    ])) ?? cart
  );
}
