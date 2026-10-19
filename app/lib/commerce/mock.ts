import type {AppSession} from '~/lib/session';
import {STORE, LINE_ATTR} from '~/lib/store-config';
import type {Locale} from '~/lib/i18n';
import {MOCK_COLLECTIONS, MOCK_PRODUCTS, type MockProduct} from './mock-data';
import type {
  Attribute,
  Cart,
  CartApi,
  CartLine,
  Collection,
  Commerce,
  Money,
  Product,
} from './types';

const SESSION_KEY = 'mockCart';

type StoredLine = {
  id: string;
  merchandiseId: string;
  quantity: number;
  attributes: Attribute[];
};
type StoredCart = {id: string; lines: StoredLine[]; attributes: Attribute[]};

const money = (amount: number): Money => ({
  amount: amount.toFixed(2),
  currencyCode: STORE.currency,
});

const variantId = (handle: string) => `gid://afnan-mock/ProductVariant/${handle}`;

export function createMockCommerce({
  session,
  locale,
  env,
}: {
  session: AppSession;
  locale: Locale;
  env: Env;
}): Commerce {
  const soldOut = new Set(
    (env.MOCK_SOLD_OUT ?? '')
      .split(',')
      .map((h) => h.trim())
      .filter(Boolean),
  );

  const toProduct = (p: MockProduct): Product => {
    const available = !p.soldOut && !soldOut.has(p.handle);
    const price = money(p.price);
    const compareAtPrice = p.compareAtPrice ? money(p.compareAtPrice) : null;
    return {
      id: `gid://afnan-mock/Product/${p.handle}`,
      handle: p.handle,
      title: locale.language === 'ar' ? p.titleAr : p.title,
      description: locale.language === 'ar' ? p.descriptionAr : p.description,
      vendor: 'Afnan',
      productType: p.productType,
      tags: p.tags,
      collections: p.collections,
      image: null,
      art: p.art,
      price,
      compareAtPrice,
      availableForSale: available,
      variants: [
        {
          id: variantId(p.handle),
          title: 'Default Title',
          availableForSale: available,
          price,
          compareAtPrice,
        },
      ],
    };
  };

  const products = MOCK_PRODUCTS.map(toProduct);
  const byVariant = new Map(products.map((p) => [p.variants[0].id, p]));

  const readCart = (): StoredCart | null =>
    (session.get(SESSION_KEY) as StoredCart | undefined) ?? null;

  const writeCart = (cart: StoredCart) => session.set(SESSION_KEY, cart);

  const ensureCart = (): StoredCart =>
    readCart() ?? {id: `mock-cart-${crypto.randomUUID()}`, lines: [], attributes: []};

  const hydrate = (stored: StoredCart | null): Cart | null => {
    if (!stored) return null;
    const lines: CartLine[] = stored.lines.flatMap((line) => {
      const product = byVariant.get(line.merchandiseId);
      if (!product) return [];
      const unit = Number(product.price.amount);
      const isFree = line.attributes.some((a) => a.key === LINE_ATTR.freeGift);
      // Mirrors the Buy X Get Y automatic discount: the gift line costs 0.
      const total = isFree ? 0 : unit * line.quantity;
      return [
        {
          id: line.id,
          quantity: line.quantity,
          attributes: line.attributes,
          merchandise: {
            id: line.merchandiseId,
            title: product.variants[0].title,
            availableForSale: product.availableForSale,
            price: product.price,
            image: product.image,
            art: product.art,
            product: {
              handle: product.handle,
              title: product.title,
              collections: product.collections,
            },
          },
          cost: {
            total: money(total),
            compareAtTotal: isFree ? money(unit * line.quantity) : null,
          },
        },
      ];
    });
    const subtotal = lines.reduce((sum, l) => sum + Number(l.cost.total.amount), 0);
    return {
      id: stored.id,
      checkoutUrl: '/checkout-preview',
      totalQuantity: lines.reduce((sum, l) => sum + l.quantity, 0),
      lines,
      attributes: stored.attributes,
      note: '',
      cost: {subtotal: money(subtotal), total: money(subtotal)},
    };
  };

  const sameAttributes = (a: Attribute[], b: Attribute[]) =>
    JSON.stringify(a) === JSON.stringify(b);

  const cart: CartApi = {
    async get() {
      return hydrate(readCart());
    },
    async addLines(inputs) {
      const stored = ensureCart();
      for (const input of inputs) {
        if (!byVariant.has(input.merchandiseId)) continue;
        const attributes = input.attributes ?? [];
        // Like Shopify, identical merchandise + attributes merge into one line.
        const existing = stored.lines.find(
          (l) =>
            l.merchandiseId === input.merchandiseId &&
            sameAttributes(l.attributes, attributes),
        );
        if (existing) existing.quantity += input.quantity;
        else
          stored.lines.push({
            id: `gid://afnan-mock/CartLine/${crypto.randomUUID()}`,
            merchandiseId: input.merchandiseId,
            quantity: input.quantity,
            attributes,
          });
      }
      writeCart(stored);
      return hydrate(stored);
    },
    async updateLines(updates) {
      const stored = ensureCart();
      for (const update of updates) {
        const line = stored.lines.find((l) => l.id === update.id);
        if (!line) continue;
        line.quantity = update.quantity;
        if (update.attributes) line.attributes = update.attributes;
      }
      stored.lines = stored.lines.filter((l) => l.quantity > 0);
      writeCart(stored);
      return hydrate(stored);
    },
    async removeLines(ids) {
      const stored = ensureCart();
      stored.lines = stored.lines.filter((l) => !ids.includes(l.id));
      writeCart(stored);
      return hydrate(stored);
    },
    async updateAttributes(attributes) {
      const stored = ensureCart();
      const merged = new Map(stored.attributes.map((a) => [a.key, a.value]));
      for (const a of attributes) merged.set(a.key, a.value);
      stored.attributes = [...merged].map(([key, value]) => ({key, value}));
      writeCart(stored);
      return hydrate(stored);
    },
    headers() {
      // The session cookie is committed by server.ts.
      return new Headers();
    },
  };

  const collectionProducts = (handle: string) =>
    products.filter((p) => p.collections.includes(handle));

  return {
    mode: 'mock',
    async getProduct(handle) {
      return products.find((p) => p.handle === handle) ?? null;
    },
    async getProducts() {
      return products.filter((p) => !p.tags.includes('hidden'));
    },
    async getCollections() {
      return MOCK_COLLECTIONS.filter((c) => c.handle !== STORE.collections.giftBoxPerfumes).map(
        (c) => ({
          id: `gid://afnan-mock/Collection/${c.handle}`,
          handle: c.handle,
          title: locale.language === 'ar' ? c.titleAr : c.title,
          description: locale.language === 'ar' ? c.descriptionAr : c.description,
        }),
      );
    },
    async getCollection(handle): Promise<Collection | null> {
      const c = MOCK_COLLECTIONS.find((c) => c.handle === handle);
      if (!c) return null;
      return {
        id: `gid://afnan-mock/Collection/${c.handle}`,
        handle: c.handle,
        title: locale.language === 'ar' ? c.titleAr : c.title,
        description: locale.language === 'ar' ? c.descriptionAr : c.description,
        products: collectionProducts(handle),
      };
    },
    cart,
  };
}
