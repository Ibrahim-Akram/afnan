import {Link, redirect, useRouteLoaderData} from 'react-router';
import type {Route} from './+types/($locale).checkout-preview';
import type {RootLoader} from '~/root';
import {assertLocaleParam, useLocale} from '~/lib/i18n';
import {titleFor} from '~/lib/meta';
import {Price} from '~/components/Price';

export const meta: Route.MetaFunction = ({matches}) => titleFor(matches, 'checkout.title');

/**
 * Mock mode only: shows the order the warehouse would receive, including
 * gift attributes and line properties. Real stores go to Shopify checkout.
 */
export async function loader({params, context}: Route.LoaderArgs) {
  assertLocaleParam(params.locale);
  if (context.commerce.mode !== 'mock') throw redirect('/cart');
  return {};
}

export default function CheckoutPreview() {
  const root = useRouteLoaderData<RootLoader>('root');
  const {t, path} = useLocale();
  const cart = root?.cart;
  const attributes = cart?.attributes.filter((a) => a.value) ?? [];

  return (
    <div className="container page checkout-preview">
      <h1>{t('checkout.title')}</h1>
      <p className="lead">{t('checkout.text')}</p>

      <h2>{t('checkout.attributes')}</h2>
      {attributes.length ? (
        <dl className="kv">
          {attributes.map((a) => (
            <div key={a.key}>
              <dt>{a.key}</dt>
              <dd>{a.value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="muted">{t('checkout.none')}</p>
      )}

      <table className="table">
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col">{t('cart.quantity')}</th>
            <th scope="col">{t('checkout.lineProps')}</th>
            <th scope="col">{t('cart.total')}</th>
          </tr>
        </thead>
        <tbody>
          {cart?.lines.map((line) => (
            <tr key={line.id}>
              <td>{line.merchandise.product.title}</td>
              <td>{line.quantity}</td>
              <td>
                {line.attributes.length
                  ? line.attributes.map((a) => (
                      <div key={a.key} className="small">
                        <code>{a.key}</code>: {a.value}
                      </div>
                    ))
                  : '—'}
              </td>
              <td>
                <Price price={line.cost.total} compareAtPrice={line.cost.compareAtTotal} />
              </td>
            </tr>
          ))}
        </tbody>
        {cart && (
          <tfoot>
            <tr>
              <th scope="row" colSpan={3}>{t('cart.total')}</th>
              <td>
                <Price price={cart.cost.total} />
              </td>
            </tr>
          </tfoot>
        )}
      </table>
      <Link className="button button--outline" to={path('/cart')}>
        {t('cart.title')}
      </Link>
    </div>
  );
}
