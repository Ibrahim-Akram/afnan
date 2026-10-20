import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).collections._index';
import {assertLocaleParam, useLocale} from '~/lib/i18n';
import {titleFor} from '~/lib/meta';

export const meta: Route.MetaFunction = ({matches}) => titleFor(matches, 'collections.title');

export async function loader({params, context}: Route.LoaderArgs) {
  assertLocaleParam(params.locale);
  return {collections: await context.commerce.getCollections()};
}

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();
  const {t, path} = useLocale();
  return (
    <div className="container page">
      <h1>{t('collections.title')}</h1>
      <div className="collection-tiles">
        {collections.map((c) => (
          <Link key={c.id} to={path(`/collections/${c.handle}`)} className="collection-tile">
            <span className="collection-tile__title">{c.title}</span>
            <span className="muted small">{c.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
