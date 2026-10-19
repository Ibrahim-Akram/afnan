import type {HydrogenCart, Storefront} from '@shopify/hydrogen';
import {STORE} from '~/lib/store-config';
import {artFor} from './art';
import type {
  Cart,
  CartApi,
  Collection,
  Commerce,
  Product,
} from './types';
import type {
  AfnanProductFragment,
  CartApiQueryFragment,
} from 'storefrontapi.generated';

/**
 * Storefront API adapter: used as soon as PUBLIC_STORE_DOMAIN and
 * PUBLIC_STOREFRONT_API_TOKEN are set. Prices come back in AED because the
 * storefront client runs with country AE (see context.ts).
 */
export function createShopifyCommerce({
  storefront,
  cart: hydrogenCart,
}: {
  storefront: Storefront;
  cart: HydrogenCart;
}): Commerce {
  // Track the cart id across several mutations in one request, so that a
  // cart created by the first mutation is the one the next ones update.
  let cartId = hydrogenCart.getCartId();
  let headers = new Headers();

  const settle = async (
    result: {cart?: {id?: string | null} | null} | null | undefined,
  ) => {
    const id = result?.cart?.id;
    if (id && id !== cartId) {
      cartId = id;
      headers = hydrogenCart.setCartId(id);
    }
    return cart.get();
  };

  const cart: CartApi = {
    async get() {
      if (!cartId) return null;
      const result = await hydrogenCart.get({cartId});
      return result ? toCart(result as unknown as CartApiQueryFragment) : null;
    },
    async addLines(lines) {
      return settle(await hydrogenCart.addLines(lines, {cartId}));
    },
    async updateLines(lines) {
      return settle(await hydrogenCart.updateLines(lines, {cartId}));
    },
    async removeLines(ids) {
      return settle(await hydrogenCart.removeLines(ids, {cartId}));
    },
    async updateAttributes(attributes) {
      // cartAttributesUpdate replaces the whole set, so merge first.
      const current = await cart.get();
      const merged = new Map(
        (current?.attributes ?? []).map((a) => [a.key, a.value]),
      );
      for (const a of attributes) merged.set(a.key, a.value);
      return settle(
        await hydrogenCart.updateAttributes(
          [...merged].map(([key, value]) => ({key, value})),
          {cartId},
        ),
      );
    },
    headers: () => headers,
  };

  return {
    mode: 'shopify',
    async getProduct(handle) {
      const {product} = await storefront.query(PRODUCT_QUERY, {
        variables: {handle},
        cache: storefront.CacheShort(),
      });
      return product ? toProduct(product) : null;
    },
    async getProducts() {
      const {products} = await storefront.query(PRODUCTS_QUERY, {
        cache: storefront.CacheShort(),
      });
      return products.nodes.map(toProduct).filter((p) => !p.tags.includes('hidden'));
    },
    async getCollections() {
      const {collections} = await storefront.query(COLLECTIONS_QUERY, {
        cache: storefront.CacheLong(),
      });
      return collections.nodes
        // `frontpage` is Shopify's default "Home page" collection.
        .filter(
          (c) =>
            c.handle !== STORE.collections.giftBoxPerfumes &&
            c.handle !== 'frontpage',
        )
        .map((c) => ({...c, description: c.description ?? ''}));
    },
    async getCollection(handle): Promise<Collection | null> {
      const {collection} = await storefront.query(COLLECTION_QUERY, {
        variables: {handle},
        cache: storefront.CacheShort(),
      });
      if (!collection) return null;
      return {
        id: collection.id,
        handle: collection.handle,
        title: collection.title,
        description: collection.description,
        products: collection.products.nodes.map(toProduct),
      };
    },
    cart,
  };
}

function toProduct(p: AfnanProductFragment): Product {
  const variants = p.variants.nodes.map((v) => ({
    id: v.id,
    title: v.title,
    availableForSale: v.availableForSale,
    price: v.price,
    compareAtPrice: v.compareAtPrice ?? null,
  }));
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    description: p.description,
    vendor: p.vendor,
    productType: p.productType,
    tags: p.tags,
    collections: p.collections.nodes.map((c) => c.handle),
    image: p.featuredImage ?? null,
    art: artFor(p.handle),
    variants,
    price: p.priceRange.minVariantPrice,
    compareAtPrice:
      Number(p.compareAtPriceRange.minVariantPrice.amount) > 0
        ? p.compareAtPriceRange.minVariantPrice
        : null,
    availableForSale: p.availableForSale,
  };
}

function toCart(c: CartApiQueryFragment): Cart {
  return {
    id: c.id,
    checkoutUrl: c.checkoutUrl,
    totalQuantity: c.totalQuantity,
    attributes: c.attributes.map((a) => ({key: a.key, value: a.value ?? ''})),
    note: c.note ?? '',
    cost: {subtotal: c.cost.subtotalAmount, total: c.cost.totalAmount},
    lines: c.lines.nodes.flatMap((line) => {
      const m = line.merchandise;
      if (m.__typename !== 'ProductVariant') return [];
      const discounted =
        Number(line.cost.totalAmount.amount) <
        Number(line.cost.subtotalAmount.amount);
      return [
        {
          id: line.id,
          quantity: line.quantity,
          attributes: line.attributes.map((a) => ({
            key: a.key,
            value: a.value ?? '',
          })),
          merchandise: {
            id: m.id,
            title: m.title,
            availableForSale: m.availableForSale,
            price: m.price,
            image: m.image ?? null,
            art: artFor(m.product.handle),
            product: {
              handle: m.product.handle,
              title: m.product.title,
              collections: m.product.collections.nodes.map((n) => n.handle),
            },
          },
          cost: {
            total: line.cost.totalAmount,
            compareAtTotal: discounted ? line.cost.subtotalAmount : null,
          },
        },
      ];
    }),
  };
}

const PRODUCT_FRAGMENT = `#graphql
  fragment AfnanProduct on Product {
    id
    handle
    title
    description
    vendor
    productType
    tags
    availableForSale
    featuredImage { url altText }
    collections(first: 20) { nodes { handle } }
    priceRange { minVariantPrice { amount currencyCode } }
    compareAtPriceRange { minVariantPrice { amount currencyCode } }
    variants(first: 10) {
      nodes {
        id
        title
        availableForSale
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
      }
    }
  }
` as const;

const PRODUCT_QUERY = `#graphql
  query AfnanProductByHandle($handle: String!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    product(handle: $handle) { ...AfnanProduct }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const PRODUCTS_QUERY = `#graphql
  query AfnanProducts($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: 100, sortKey: BEST_SELLING) { nodes { ...AfnanProduct } }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const COLLECTION_QUERY = `#graphql
  query AfnanCollection($handle: String!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(first: 100) { nodes { ...AfnanProduct } }
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const COLLECTIONS_QUERY = `#graphql
  query AfnanCollections($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collections(first: 20) { nodes { id handle title description } }
  }
` as const;

export const CART_QUERY_FRAGMENT = `#graphql
  fragment CartApiQuery on Cart {
    id
    checkoutUrl
    totalQuantity
    note
    attributes { key value }
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: $numCartLines) {
      nodes {
        id
        quantity
        attributes { key value }
        cost {
          totalAmount { amount currencyCode }
          subtotalAmount { amount currencyCode }
        }
        merchandise {
          __typename
          ... on ProductVariant {
            id
            title
            availableForSale
            price { amount currencyCode }
            image { url altText }
            product {
              handle
              title
              collections(first: 20) { nodes { handle } }
            }
          }
        }
      }
    }
  }
` as const;
