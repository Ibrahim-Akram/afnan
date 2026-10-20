import {Form, Link, useLoaderData} from 'react-router';
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
 * are worked out from the customer's orders. Without a store, a demo
 * customer is shown.
 */
export async function loader({params, context}: Route.LoaderArgs) {
  assertLocaleParam(params.locale);
  const {commerce, customerAccount} = context;

  const demo = {
    demo: true,
    canSignIn: commerce.mode === 'shopify',
    name: DEMO_LOYALTY.name,
    email: null as string | null,
    since: null as string | null,
    points: DEMO_LOYALTY.points,
    estimated: false,
    orders: null as AccountOrder[] | null,
  };
  if (commerce.mode === 'mock') return {...demo, canSignIn: false};

  // Signed-out visitors (or a store without customer accounts set up) see
  // the demo widget with a sign-in button instead of a forced redirect.
  const loggedIn = await customerAccount.isLoggedIn().catch(() => false);
  if (!loggedIn) return demo;

  const {data} = await customerAccount.query(CUSTOMER_LOYALTY_QUERY);
  const customer = data?.customer;
  const orderNodes = customer?.orders.nodes ?? [];
  const synced = Number(customer?.points?.value);
  const hasSynced = customer?.points?.value != null && Number.isFinite(synced);

  return {
    demo: false,
    canSignIn: false,
    name: customer?.firstName || '',
    email: customer?.emailAddress?.emailAddress ?? null,
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

export default function Account() {
  const {demo, canSignIn, name, email, since, points, estimated, orders} =
    useLoaderData<typeof loader>();
  const {t, path, money, locale} = useLocale();
  const date = (iso: string) =>
    new Date(iso).toLocaleDateString(locale.language === 'ar' ? 'ar-AE' : 'en-AE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  const statusLabel = (s: string) => {
    const key = `account.status.${s}` as MessageKey;
    const label = t(key);
    return label && label !== key ? label : s.replace(/_/g, " ").toLowerCase();
  };

  return (
    <div className="container page account">
      <h1>{t('account.greeting', {name: name || t('account.title')})}</h1>
      {!demo && (email || since) && (
        <p className="muted small">
          {[email, since && t('account.memberSince', {date: date(since)})].filter(Boolean).join(' · ')}
        </p>
      )}
      {demo && (
        <p className="notice">{canSignIn ? t('account.signInDemo') : t('account.demo')}</p>
      )}
      <LoyaltyWidget points={points} />
      {estimated && <p className="muted small">{t('account.pointsEstimated')}</p>}
      <section className="section">
        <h2>{t('account.orders')}</h2>
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
      </section>
      <div className="button-row">
        <Link className="button button--outline" to={path('/loyalty')}>
          {t('account.howToEarn')}
        </Link>
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
    </div>
  );
}
