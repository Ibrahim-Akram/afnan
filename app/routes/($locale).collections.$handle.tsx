import {useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).collections.$handle';
import {assertLocaleParam, useLocale} from '~/lib/i18n';
import {ProductGrid} from '~/components/ProductCard';
import {FreeGiftNotice} from '~/components/FreeGiftNotice';
import {STORE} from '~/lib/store-config';

export const meta: Route.MetaFunction = ({data}) => [
  {title: `${data?.collection.title ?? ''} | Afnan`},
];

export async function loader({params, context}: Route.LoaderArgs) {
  assertLocaleParam(params.locale);
  const collection = await context.commerce.getCollection(params.handle);
  if (!collection) throw new Response('Collection not found', {status: 404});
  return {collection};
}

export default function CollectionPage() {
  const {collection} = useLoaderData<typeof loader>();
  const {t} = useLocale();
  const products = collection.products.filter((p) => !p.tags.includes('hidden'));

  return (
    <div className="container page">
      <header className="page-header">
        <h1>{collection.title}</h1>
        {collection.description && <p className="lead">{collection.description}</p>}
        <p className="muted small">{t('collection.count', {count: products.length})}</p>
      </header>
      {collection.handle === STORE.collections.femme && <FreeGiftNotice promo />}
      {products.length ? (
        <ProductGrid products={products} quickAdd />
      ) : (
        <p>{t('collection.empty')}</p>
      )}
    </div>
  );
}
