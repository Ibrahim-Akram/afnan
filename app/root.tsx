import {useNonce} from '@shopify/hydrogen';
import {
  Link,
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from 'react-router';
import type {Route} from './+types/root';
import favicon from '~/assets/favicon.svg';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import {PageLayout} from '~/components/PageLayout';
import {getRamadanSettings} from '~/lib/ramadan';
import {getFreeGiftState, getGiftOptions} from '~/lib/gifting';
import {getGiftOffer} from '~/lib/offer';
import {LOCALES, translate} from '~/lib/i18n';

export type RootLoader = typeof loader;

export function links() {
  return [
    {rel: 'preconnect', href: 'https://cdn.shopify.com'},
    {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
    {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous'},
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Inter:wght@400;500;600&family=Noto+Kufi+Arabic:wght@400;500;700&display=swap',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
}

export async function loader({request, context}: Route.LoaderArgs) {
  const {commerce, locale, session, env, storefront} = context;

  const useShopify = commerce.mode === 'shopify';
  const [cart, ramadan, offer] = await Promise.all([
    commerce.cart.get(),
    getRamadanSettings({request, session, env, storefront, useShopify}),
    getGiftOffer({storefront, useShopify}),
  ]);
  const [giftProduct, giftOptions] = await Promise.all([
    offer.getProduct
      ? commerce.getProduct(offer.getProduct).catch(() => null)
      : null,
    getGiftOptions(commerce, cart, offer).catch(() => []),
  ]);

  return {
    locale,
    ramadan,
    cart,
    giftOffer: offer,
    freeGift: getFreeGiftState(cart, offer, {
      giftAvailable: Boolean(giftProduct?.availableForSale),
      options: giftOptions,
    }),
    mode: commerce.mode,
    now: Date.now(),
  };
}

export function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();
  const data = useRouteLoaderData<RootLoader>('root');
  const locale = data?.locale ?? LOCALES.en;

  return (
    <html
      lang={locale.language}
      dir={locale.dir}
      data-ramadan={data?.ramadan.enabled ? 'on' : 'off'}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={resetStyles}></link>
        <link rel="stylesheet" href={appStyles}></link>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  const data = useRouteLoaderData<RootLoader>('root');
  if (!data) return <Outlet />;

  return (
    <PageLayout>
      <Outlet />
    </PageLayout>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const data = useRouteLoaderData<RootLoader>('root');
  const language = data?.locale.language ?? 'en';
  let status = 500;
  let message = translate(language, 'error.title');

  if (isRouteErrorResponse(error)) {
    status = error.status;
    if (status === 404) message = translate(language, 'error.notFound');
  } else if (error instanceof Error && process.env.NODE_ENV !== 'production') {
    message = error.message;
  }

  const content = (
    <div className="container route-error">
      <p className="eyebrow">{status}</p>
      <h1>{message}</h1>
      <Link className="button" to={data?.locale.pathPrefix || '/'}>
        {translate(language, 'error.home')}
      </Link>
    </div>
  );

  return data ? <PageLayout>{content}</PageLayout> : content;
}
