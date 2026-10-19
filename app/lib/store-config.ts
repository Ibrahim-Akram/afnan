/**
 * Handles and keys shared by the storefront and the Shopify admin setup.
 * Keep these in sync with docs/SHOPIFY_SETUP.md.
 */
export const STORE = {
  currency: 'AED',
  collections: {
    femme: 'femme-collection',
    giftSets: 'gift-sets',
    giftBoxPerfumes: 'gift-box-perfumes',
  },
  products: {
    giftBox: 'build-your-own-gift-box',
    giftWrap: 'gift-wrap',
    freeGift: 'femme-free-gift',
  },
  giftBoxSize: 3,
  giftMessageMaxLength: 150,
  /** Display price; the charge comes from the gift-wrap product. */
  giftWrapPrice: '15',
} as const;

/** Line attributes. A leading underscore hides them at checkout. */
export const LINE_ATTR = {
  freeGift: '_free_gift',
  giftWrap: '_gift_wrap',
  giftBox: '_gift_box',
} as const;

/** Cart attributes. These show on the order under "Additional details". */
export const CART_ATTR = {
  isGift: 'Gift',
  giftMessage: 'Gift message',
  giftWrap: 'Gift wrap',
} as const;

/**
 * The free gift offer used until the `afnan_settings` metaobject says
 * otherwise (see app/lib/offer.ts). Buy anything from `buyCollection`, then
 * either `getProduct` is added for free, or, when it is null, the customer
 * picks one product from `getCollection`.
 */
export const DEFAULT_GIFT_OFFER = {
  buyCollection: STORE.collections.femme,
  getProduct: null,
  getCollection: STORE.collections.femme,
} as const;

export const BUDGETS = [
  {id: 'under-200', min: 0, max: 200},
  {id: '200-400', min: 200, max: 400},
  {id: '400-plus', min: 400, max: Infinity},
] as const;

export type BudgetId = (typeof BUDGETS)[number]['id'];
