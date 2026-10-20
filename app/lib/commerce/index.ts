export * from './types';
export {createMockCommerce} from './mock';
export {createShopifyCommerce, CART_QUERY_FRAGMENT} from './shopify';

/** Real Storefront API data once both store values are configured. */
export function isShopifyConfigured(env: Env) {
  return Boolean(env.PUBLIC_STORE_DOMAIN && env.PUBLIC_STOREFRONT_API_TOKEN);
}
