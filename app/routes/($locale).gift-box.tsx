import {useFetcher, useLoaderData, Link} from 'react-router';
import {useEffect, useState} from 'react';
import type {Route} from './+types/($locale).gift-box';
import type {CartActionResult} from './($locale).cart';
import {assertLocaleParam, useLocale} from '~/lib/i18n';
import {titleFor} from '~/lib/meta';
import {STORE} from '~/lib/store-config';
import {ProductMedia} from '~/components/ProductMedia';
import {Price} from '~/components/Price';

export const meta: Route.MetaFunction = ({matches}) => titleFor(matches, 'box.metaTitle');

export async function loader({params, context}: Route.LoaderArgs) {
  assertLocaleParam(params.locale);
  const [box, collection] = await Promise.all([
    context.commerce.getProduct(STORE.products.giftBox),
    context.commerce.getCollection(STORE.collections.giftBoxPerfumes),
  ]);
  return {box, perfumes: collection?.products ?? []};
}

export default function GiftBox() {
  const {box, perfumes} = useLoaderData<typeof loader>();
  const {t, money, path} = useLocale();
  const fetcher = useFetcher<CartActionResult>();
  const [picked, setPicked] = useState<string[]>([]);
  const size = STORE.giftBoxSize;

  // Start a fresh box once the last one is in the bag.
  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.ok) setPicked([]);
  }, [fetcher.state, fetcher.data]);

  const full = picked.length === size;

  if (!box) {
    return (
      <div className="container page">
        <h1>{t('box.title')}</h1>
        <p>{t('box.unavailable')}</p>
      </div>
    );
  }

  const chosen = picked
    .map((h) => perfumes.find((p) => p.handle === h))
    .filter((p) => p !== undefined);
  const separate = chosen.reduce((sum, p) => sum + Number(p.price.amount), 0);
  const boxPrice = Number(box.price.amount);
  const saving = separate - boxPrice;
  const currencyCode = box.price.currencyCode;
  const added = fetcher.state === 'idle' && fetcher.data?.ok;

  const toggle = (handle: string) =>
    setPicked((current) =>
      current.includes(handle)
        ? current.filter((h) => h !== handle)
        : current.length < size
          ? [...current, handle]
          : current,
    );

  return (
    <div className="container page gift-box">
      <header className="page-header">
        <p className="eyebrow">{t('box.eyebrow')}</p>
        <h1>{t('box.title')}</h1>
        <p className="lead">{t('box.text', {size, price: money(box.price)})}</p>
      </header>

      <div className="gift-box__layout">
        <ul className="pick-grid" aria-label={t('box.title')}>
          {perfumes.map((p) => {
            const isPicked = picked.includes(p.handle);
            const disabled = !p.availableForSale || (full && !isPicked);
            return (
              <li key={p.id}>
                <button
                  type="button"
                  className={`pick${isPicked ? ' pick--active' : ''}`}
                  aria-pressed={isPicked}
                  disabled={disabled}
                  onClick={() => toggle(p.handle)}
                >
                  <ProductMedia image={p.image} art={p.art} title={p.title} />
                  <span className="pick__title">{p.title}</span>
                  <Price price={p.price} />
                  <span className="pick__state">
                    {!p.availableForSale
                      ? t('product.soldOut')
                      : isPicked
                        ? t('box.chosen')
                        : t('box.choose')}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <aside className="box-summary" aria-live="polite">
          <p className="box-summary__count">
            {t('box.selected', {count: picked.length, size})}
          </p>
          <ol className="box-slots">
            {Array.from({length: size}, (_, i) => {
              const p = chosen[i];
              return (
                <li key={i} className={p ? 'box-slot box-slot--filled' : 'box-slot'}>
                  <span className="muted small">{t('box.slot', {n: i + 1})}</span>
                  {p ? (
                    <span className="box-slot__row">
                      <span>{p.title}</span>
                      <button type="button" className="link-button" onClick={() => toggle(p.handle)}>
                        {t('box.remove')}
                      </button>
                    </span>
                  ) : (
                    <span className="muted">—</span>
                  )}
                </li>
              );
            })}
          </ol>
          {full && <p className="muted small">{t('box.full')}</p>}
          <dl className="cart__totals">
            <div>
              <dt>{t('box.separately')}</dt>
              <dd>{money({amount: String(separate), currencyCode})}</dd>
            </div>
            <div className="cart__total">
              <dt>{t('box.boxPrice')}</dt>
              <dd>{money(box.price)}</dd>
            </div>
          </dl>
          {full && saving > 0 && (
            <p className="saving">
              {t('box.youSave', {amount: money({amount: String(saving), currencyCode})})}
            </p>
          )}
          <fetcher.Form method="post" action="/cart">
            <input type="hidden" name="intent" value="addBox" />
            {picked.map((h) => (
              <input key={h} type="hidden" name="perfume" value={h} />
            ))}
            <button
              className="button button--block"
              disabled={!full || fetcher.state !== 'idle' || !box.availableForSale}
            >
              {full ? t('box.add') : t('box.pickMore', {count: size - picked.length})}
            </button>
          </fetcher.Form>
          <p role="status" className="small">
            {added && (
              <>
                {t('product.added')} <Link to={path('/cart')}>{t('product.viewBag')}</Link>
              </>
            )}
            {fetcher.data?.error && <span className="error">{fetcher.data.error}</span>}
          </p>
        </aside>
      </div>
    </div>
  );
}
