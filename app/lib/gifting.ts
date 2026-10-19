import {CART_ATTR, LINE_ATTR, STORE} from '~/lib/store-config';
import type {Attribute, Cart, CartLine, Commerce} from '~/lib/commerce/types';

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

/** Any non-gift line from the Femme Collection unlocks the free gift. */
export function qualifiesForFreeGift(cart: Cart | null) {
  return Boolean(
    cart?.lines.some(
      (line) =>
        !isManagedLine(line) &&
        line.merchandise.product.collections.includes(STORE.collections.femme),
    ),
  );
}

export type FreeGiftState =
  | {status: 'none'}
  | {status: 'unlocked'; giftTitle: string}
  | {status: 'out_of_stock'};

export function getFreeGiftState(
  cart: Cart | null,
  giftAvailable: boolean,
): FreeGiftState {
  const giftLine = cart?.lines.find(isFreeGiftLine);
  if (giftLine) {
    return {status: 'unlocked', giftTitle: giftLine.merchandise.product.title};
  }
  if (qualifiesForFreeGift(cart) && !giftAvailable) {
    return {status: 'out_of_stock'};
  }
  return {status: 'none'};
}

/**
 * Keeps storefront-managed lines in step with the rest of the cart. Runs
 * after every cart mutation:
 * - Free gift (Buy X Get Y): added once a Femme product is in the cart,
 *   removed when the last one goes, and never more than one. If the gift
 *   is out of stock nothing is added, and the UI shows a message instead.
 * - Gift wrap: one wrap line while the "Gift wrap" cart attribute is "Yes".
 * The price of the gift line is set by the automatic discount in Shopify
 * admin; the storefront only manages its presence.
 */
export async function syncManagedLines(commerce: Commerce) {
  let cart = await commerce.cart.get();
  if (!cart) return null;

  cart = await syncLine(commerce, cart, {
    want: qualifiesForFreeGift(cart),
    isLine: isFreeGiftLine,
    handle: STORE.products.freeGift,
    attribute: LINE_ATTR.freeGift,
  });

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
