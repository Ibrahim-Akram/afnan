import {createHydrogenContext} from '@shopify/hydrogen';
import {AppSession} from '~/lib/session';
import {getLocaleFromRequest} from '~/lib/i18n';
import {
  CART_QUERY_FRAGMENT,
  createMockCommerce,
  createShopifyCommerce,
  isShopifyConfigured,
} from '~/lib/commerce';

/**
 * Creates Hydrogen context for React Router, plus `commerce` (Storefront
 * API or the mock catalogue) and the request `locale`.
 */
export async function createHydrogenRouterContext(
  request: Request,
  env: Env,
  executionContext: ExecutionContext,
) {
  if (!env?.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }

  const waitUntil = executionContext.waitUntil.bind(executionContext);
  const [cache, session] = await Promise.all([
    caches.open('hydrogen'),
    AppSession.init(request, [env.SESSION_SECRET]),
  ]);

  const locale = getLocaleFromRequest(request);

  const hydrogenContext = createHydrogenContext(
    {
      env,
      request,
      cache,
      waitUntil,
      session,
      // Country AE so Shopify returns AED prices from the UAE market.
      i18n: locale.storefront,
      cart: {
        queryFragment: CART_QUERY_FRAGMENT,
      },
    },
    {locale},
  );

  const commerce = isShopifyConfigured(env)
    ? createShopifyCommerce({
        storefront: hydrogenContext.storefront,
        cart: hydrogenContext.cart,
      })
    : createMockCommerce({session, locale, env});

  hydrogenContext.commerce = commerce;
  return hydrogenContext;
}

declare global {
  interface HydrogenAdditionalContext {
    locale: import('~/lib/i18n').Locale;
    commerce: import('~/lib/commerce').Commerce;
  }
}
