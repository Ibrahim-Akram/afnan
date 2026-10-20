import type {Storefront} from '@shopify/hydrogen';
import {DEFAULT_GIFT_OFFER} from '~/lib/store-config';

export type GiftOffer = {
  /** A product from this collection unlocks the gift. */
  buyCollection: string;
  /** Added automatically when set. */
  getProduct: string | null;
  /** Otherwise the customer chooses a gift from this collection. */
  getCollection: string | null;
};

/**
 * Reads the free gift offer from the `afnan_settings` metaobject so
 * merchandisers can change it next to the Buy X Get Y discount in Shopify
 * admin, without a deploy. Empty fields fall back to DEFAULT_GIFT_OFFER.
 */
export async function getGiftOffer({
  storefront,
  useShopify,
}: {
  storefront: Storefront;
  useShopify: boolean;
}): Promise<GiftOffer> {
  const offer: GiftOffer = {...DEFAULT_GIFT_OFFER};
  if (!useShopify) return offer;

  try {
    const {metaobject} = await storefront.query(GIFT_OFFER_QUERY, {
      cache: storefront.CacheShort(),
    });
    const handle = (ref: {handle?: string} | null | undefined) =>
      ref?.handle ?? null;
    const buy = handle(metaobject?.buyCollection?.reference);
    const product = handle(metaobject?.getProduct?.reference);
    const collection = handle(metaobject?.getCollection?.reference);
    if (buy) offer.buyCollection = buy;
    if (product || collection) {
      offer.getProduct = product;
      offer.getCollection = product ? null : collection;
    }
  } catch (error) {
    console.error('Could not read the free gift offer', error);
  }
  return offer;
}

const GIFT_OFFER_QUERY = `#graphql
  query AfnanGiftOffer {
    metaobject(handle: {type: "afnan_settings", handle: "storefront"}) {
      buyCollection: field(key: "gift_buy_collection") {
        reference { ... on Collection { handle } }
      }
      getProduct: field(key: "gift_product") {
        reference { ... on Product { handle } }
      }
      getCollection: field(key: "gift_collection") {
        reference { ... on Collection { handle } }
      }
    }
  }
` as const;
