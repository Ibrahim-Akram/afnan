import {Form, Link, useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).account';
import {assertLocaleParam, useLocale} from '~/lib/i18n';
import {titleFor} from '~/lib/meta';
import {DEMO_LOYALTY} from '~/lib/loyalty';
import {LoyaltyWidget} from '~/components/LoyaltyWidget';
import {CUSTOMER_LOYALTY_QUERY} from '~/graphql/customer-account/CustomerLoyaltyQuery';

export const meta: Route.MetaFunction = ({matches}) => titleFor(matches, 'account.title');

/**
 * With a store connected the customer signs in through the Customer
 * Account API, and the loyalty app's values are read from customer
 * metafields (loyalty.points). Without one, a demo customer is shown.
 */
export async function loader({params, context}: Route.LoaderArgs) {
  assertLocaleParam(params.locale);
  const {commerce, customerAccount} = context;

  if (commerce.mode === 'mock') {
    return {demo: true, name: DEMO_LOYALTY.name, points: DEMO_LOYALTY.points};
  }

  await customerAccount.handleAuthStatus();
  const {data} = await customerAccount.query(CUSTOMER_LOYALTY_QUERY);
  const points = Number(data?.customer?.points?.value);
  return {
    demo: false,
    name: data?.customer?.firstName || '',
    // Dummy balance until the loyalty app syncs real points.
    points: Number.isFinite(points) && points > 0 ? points : DEMO_LOYALTY.points,
  };
}

export default function Account() {
  const {demo, name, points} = useLoaderData<typeof loader>();
  const {t, path} = useLocale();

  return (
    <div className="container page account">
      <h1>{t('account.greeting', {name: name || t('account.title')})}</h1>
      {demo && <p className="notice">{t('account.demo')}</p>}
      <LoyaltyWidget points={points} />
      <section className="section">
        <h2>{t('account.orders')}</h2>
        <p className="muted">{t('account.ordersEmpty')}</p>
      </section>
      <div className="button-row">
        <Link className="button button--outline" to={path('/loyalty')}>
          {t('account.howToEarn')}
        </Link>
        {!demo && (
          <Form method="post" action="/account/logout">
            <button className="button button--outline">{t('account.logout')}</button>
          </Form>
        )}
      </div>
    </div>
  );
}
