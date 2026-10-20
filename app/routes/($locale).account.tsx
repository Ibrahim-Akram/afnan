import {Form, Link, redirect, useLoaderData, useSearchParams} from 'react-router';
import type {Route} from './+types/($locale).account';
import {assertLocaleParam, useLocale, type MessageKey} from '~/lib/i18n';
import {titleFor} from '~/lib/meta';
import {DEMO_LOYALTY, estimatePoints} from '~/lib/loyalty';
import {LoyaltyWidget} from '~/components/LoyaltyWidget';
import {CUSTOMER_LOYALTY_QUERY} from '~/graphql/customer-account/CustomerLoyaltyQuery';

export const meta: Route.MetaFunction = ({matches}) => titleFor(matches, 'account.title');

type AccountOrder = {
  id: string;
  name: string;
  processedAt: string;
  status: string;
  fulfillment: string | null;
  total: {amount: string; currencyCode: string};
  items: string;
  url: string | null;
};

/**
 * With a store connected the customer signs in through the Customer
 * Account API and sees their own name and orders. Points come from the
 * loyalty.points metafield when the loyalty app syncs one, otherwise they
 * are worked out from the customer's orders. Without a store (mock mode),
 * a demo customer is shown.
 */
export async function loader({params, context}: Route.LoaderArgs) {
  assertLocaleParam(params.locale);
  const {commerce, customerAccount} = context;

  const demo = {
    demo: true,
    canSignIn: commerce.mode === 'shopify',
    name: DEMO_LOYALTY.name,
    lastName: null as string | null,
    email: null as string | null,
    phone: null as string | null,
    address: null as string[] | null,
    since: null as string | null,
    points: DEMO_LOYALTY.points,
    estimated: false,
    orders: null as AccountOrder[] | null,
  };
  if (commerce.mode === 'mock') return {...demo, canSignIn: false};

  // Signed-out visitors go straight to Shopify's customer login, the same
  // as the Online Store theme; Shopify sends them back here afterwards.
  const loggedIn = await customerAccount.isLoggedIn().catch(() => false);
  if (!loggedIn) {
    throw redirect(params.locale ? `/account/login?locale=${params.locale}` : '/account/login');
  }

  const {data} = await customerAccount.query(CUSTOMER_LOYALTY_QUERY);
  const customer = data?.customer;
  const orderNodes = customer?.orders.nodes ?? [];
  const synced = Number(customer?.points?.value);
  const hasSynced = customer?.points?.value != null && Number.isFinite(synced);

  return {
    demo: false,
    canSignIn: false,
    name: customer?.firstName || '',
    lastName: customer?.lastName ?? null,
    email: customer?.emailAddress?.emailAddress ?? null,
    phone: customer?.phoneNumber?.phoneNumber ?? null,
    address: customer?.defaultAddress?.formatted ?? null,
    since: customer?.creationDate ?? null,
    points: hasSynced ? synced : estimatePoints(orderNodes),
    estimated: !hasSynced,
    orders: orderNodes.slice(0, 10).map(
      (o): AccountOrder => ({
        id: o.id,
        name: o.name,
        processedAt: o.processedAt,
        status: o.cancelledAt ? 'CANCELLED' : (o.financialStatus ?? 'PENDING'),
        fulfillment: o.cancelledAt ? null : (o.fulfillmentStatus ?? null),
        total: o.totalPrice,
        items: o.lineItems.nodes.map((l) => `${l.title} × ${l.quantity}`).join(', '),
        url: o.statusPageUrl ?? null,
      }),
    ),
  };
}

const TABS = ['profile', 'orders', 'loyalty'] as const;
type Tab = (typeof TABS)[number];

export default function Account() {
  const {demo, canSignIn, name, lastName, email, phone, address, since, points, estimated, orders} =
    useLoaderData<typeof loader>();
  const {t, path, money, locale} = useLocale();
  const [params] = useSearchParams();
  const tab: Tab = TABS.find((x) => x === params.get('tab')) ?? 'profile';
  const date = (iso: string) =>
    new Date(iso).toLocaleDateString(locale.language === 'ar' ? 'ar-AE' : 'en-AE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  const statusLabel = (s: string) => {
    const key = `account.status.${s}` as MessageKey;
    const label = t(key);
    return label && label !== key ? label : s.replace(/_/g, ' ').toLowerCase();
  };
  const dash = '—';

  return (
    <div className="container page account">
      <h1>{t('account.greeting', {name: name || t('account.title')})}</h1>
      {demo && (
        <p className="notice">{canSignIn ? t('account.signInDemo') : t('account.demo')}</p>
      )}
      <nav className="tabs" aria-label={t('account.title')}>
        {TABS.map((id) => (
          <Link
            key={id}
            to={`?tab=${id}`}
            replace
            preventScrollReset
            className={`tab${tab === id ? ' tab--active' : ''}`}
            aria-current={tab === id ? 'page' : undefined}
          >
            {t(`account.tab.${id}`)}
          </Link>
        ))}
      </nav>

      {tab === 'profile' && (
        <section className="section account-panel" aria-label={t('account.tab.profile')}>
          <dl className="account-profile">
            <div>
              <dt>{t('account.field.name')}</dt>
              <dd>{[name, lastName].filter(Boolean).join(' ') || dash}</dd>
            </div>
            <div>
              <dt>{t('account.field.email')}</dt>
              <dd>{email || dash}</dd>
            </div>
            <div>
              <dt>{t('account.field.phone')}</dt>
              <dd>{phone || dash}</dd>
            </div>
            <div>
              <dt>{t('account.field.address')}</dt>
              <dd>{address?.length ? address.join(', ') : dash}</dd>
            </div>
            <div>
              <dt>{t('account.field.since')}</dt>
              <dd>{since ? date(since) : dash}</dd>
            </div>
          </dl>
          <div className="button-row">
            {canSignIn && (
              <Link className="button" to="/account/login" reloadDocument>
                {t('account.signIn')}
              </Link>
            )}
            {!demo && (
              <Form method="post" action="/account/logout">
                <button className="button button--outline">{t('account.logout')}</button>
              </Form>
            )}
          </div>
        </section>
      )}

      {tab === 'orders' && (
        <section className="section account-panel" aria-label={t('account.tab.orders')}>
          {!orders ? (
            <p className="muted">{t('account.ordersEmpty')}</p>
          ) : orders.length === 0 ? (
            <p className="muted">{t('account.ordersNone')}</p>
          ) : (
            <ul className="account-orders">
              {orders.map((o) => (
                <li key={o.id} className="account-orders__row">
                  <div>
                    <p className="account-orders__name">{o.name}</p>
                    <p className="muted small">{date(o.processedAt)}</p>
                  </div>
                  <p className="small account-orders__items">{o.items}</p>
                  <p className="small">
                    {statusLabel(o.status)}
                    {o.fulfillment && ` · ${statusLabel(o.fulfillment)}`}
                  </p>
                  <p className="account-orders__total">{money(o.total)}</p>
                  {o.url && (
                    <a className="small" href={o.url} target="_blank" rel="noreferrer">
                      {t('account.orderView')}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
          <div className="button-row">
            <Link className="button button--outline" to={path('/collections')}>
              {t('account.shop')}
            </Link>
          </div>
        </section>
      )}

      {tab === 'loyalty' && (
        <section className="section account-panel" aria-label={t('account.tab.loyalty')}>
          <LoyaltyWidget points={points} />
          {estimated && <p className="muted small">{t('account.pointsEstimated')}</p>}
          <div className="button-row">
            <Link className="button button--outline" to={path('/loyalty')}>
              {t('account.howToEarn')}
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
