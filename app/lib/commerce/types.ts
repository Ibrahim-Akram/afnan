/**
 * Storefront-agnostic shapes used by the routes and components. Both the
 * Shopify adapter (Storefront API) and the mock adapter (local catalogue)
 * map their data into these, so the UI never cares where data came from.
 */

export type Money = {amount: string; currencyCode: string};

export type Attribute = {key: string; value: string};

export type Image = {url: string; altText?: string | null};

/** Colours for the generated bottle illustration used by the mock catalogue. */
export type BottleArt = {
  liquid: string;
  cap: string;
  shape: 'tall' | 'round' | 'square' | 'oud';
};

export type Variant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  compareAtPrice?: Money | null;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  vendor: string;
  productType: string;
  tags: string[];
  collections: string[];
  image: Image | null;
  art?: BottleArt;
  variants: Variant[];
  /** Lowest variant price; used for budget filters and cards. */
  price: Money;
  compareAtPrice?: Money | null;
  availableForSale: boolean;
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  products: Product[];
};

export type CartLine = {
  id: string;
  /**
   * Every Shopify line this row stands for. Shopify splits one product into
   * several lines when a Buy X Get Y discount uses part of the quantity, and
   * the cart shows them as one row.
   */
  lineIds?: string[];
  quantity: number;
  attributes: Attribute[];
  merchandise: {
    id: string;
    title: string;
    availableForSale: boolean;
    price: Money;
    image: Image | null;
    art?: BottleArt;
    product: {handle: string; title: string; collections: string[]};
  };
  cost: {total: Money; compareAtTotal?: Money | null};
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: CartLine[];
  attributes: Attribute[];
  note: string;
  cost: {subtotal: Money; total: Money};
};

export type CartLineInput = {
  merchandiseId: string;
  quantity: number;
  attributes?: Attribute[];
};

export type CartLineUpdate = {
  id: string;
  quantity: number;
  attributes?: Attribute[];
};

export type CartApi = {
  get(): Promise<Cart | null>;
  addLines(lines: CartLineInput[]): Promise<Cart | null>;
  updateLines(lines: CartLineUpdate[]): Promise<Cart | null>;
  removeLines(lineIds: string[]): Promise<Cart | null>;
  updateAttributes(attributes: Attribute[]): Promise<Cart | null>;
  /** Headers (Set-Cookie for the cart id) that the action must return. */
  headers(): Headers;
};

export type Commerce = {
  mode: 'shopify' | 'mock';
  getProduct(handle: string): Promise<Product | null>;
  getCollection(handle: string): Promise<Collection | null>;
  getCollections(): Promise<Omit<Collection, 'products'>[]>;
  getProducts(): Promise<Product[]>;
  cart: CartApi;
};
