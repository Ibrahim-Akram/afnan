import {Link, useLoaderData, useRouteLoaderData} from 'react-router';
import type {Route} from './+types/($locale)._index';
import type {RootLoader} from '~/root';
import {assertLocaleParam, useLocale} from '~/lib/i18n';
import {ProductGrid} from '~/components/ProductCard';
import {RamadanBanner} from '~/components/RamadanBanner';
import {HomeHero} from '~/components/HomeHero';

export const meta: Route.MetaFunction = () => [
  {title: 'Afnan Perfumes | Eau de parfum from the UAE'},
  {name: 'description', content: 'Afnan perfumes, gift sets and oud. Prices in AED.'},
];

export async function loader({params, context}: Route.LoaderArgs) {
  assertLocaleParam(params.locale);
  const {commerce} = context;
  const [products, collections] = await Promise.all([
    commerce.getProducts(),
    commerce.getCollections(),
  ]);
  const bestsellers = products
    .filter((p) => p.tags.includes('bestseller'))
    .concat(products.filter((p) => !p.tags.includes('bestseller')))
    .slice(0, 8);
  return {bestsellers, collections};
}

export default function Home() {
  const {bestsellers, collections} = useLoaderData<typeof loader>();
  const root = useRouteLoaderData<RootLoader>('root');
  const {t, path} = useLocale();

  return (
    <>
      {root?.ramadan.enabled ? (
        <RamadanBanner />
      ) : (
        <HomeHero image={root?.ramadan.heroImage ?? null} />
      )}

      <section className="container section">
        <h2 className="section__title">{t('home.bestsellers')}</h2>
        <ProductGrid products={bestsellers} quickAdd />
      </section>

      <section className="container section">
        <h2 className="section__title">{t('home.collections')}</h2>
        <div className="collection-tiles">
          {collections.map((c) => (
            <Link key={c.id} to={path(`/collections/${c.handle}`)} className="collection-tile">
              <span className="collection-tile__title">{c.title}</span>
              <span className="muted small">{c.description}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="promo">
          <div>
            <h2>{t('home.loyaltyTitle')}</h2>
            <p>{t('home.loyaltyText')}</p>
          </div>
          <Link className="button button--gold" to={path('/loyalty')}>
            {t('home.loyaltyCta')}
          </Link>
        </div>
      </section>
    </>
  );
}
