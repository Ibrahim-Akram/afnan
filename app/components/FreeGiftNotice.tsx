import {useFetcher, useRouteLoaderData} from 'react-router';
import type {RootLoader} from '~/root';
import type {CartActionResult} from '~/routes/($locale).cart';
import type {GiftOption} from '~/lib/gifting';
import {useLocale} from '~/lib/i18n';
import {GiftIcon} from './Icons';
import {ProductMedia} from './ProductMedia';

/**
 * "You've unlocked a free gift" on the product page and in the cart, a
 * picker when the customer chooses their gift (`chooser`, cart only), or a
 * soft message if the gift is out of stock. `promo` shows the offer on
 * qualifying products before it is unlocked.
 */
export function FreeGiftNotice({
  promo = false,
  chooser = false,
}: {
  promo?: boolean;
  chooser?: boolean;
}) {
  const data = useRouteLoaderData<RootLoader>('root');
  const {t} = useLocale();
  const state = data?.freeGift;
  if (!state) return null;

  if (state.status === 'unlocked') {
    return (
      <div className="notice notice--success" role="status">
        <GiftIcon />
        <div>
          <strong>{t('gwp.unlocked')}</strong>
          <p>{t('gwp.unlockedDetail', {gift: state.giftTitle})}</p>
          {chooser && state.options.length > 1 && (
            <details className="gift-chooser__change">
              <summary>{t('gwp.change')}</summary>
              <GiftChooser options={state.options} />
            </details>
          )}
        </div>
      </div>
    );
  }
  if (state.status === 'choose') {
    return (
      <div className="notice notice--success gift-chooser" role="status">
        <GiftIcon />
        <div>
          <strong>{chooser ? t('gwp.chooseTitle') : t('gwp.unlocked')}</strong>
          <p>{t('gwp.chooseDetail')}</p>
          {chooser && <GiftChooser options={state.options} />}
        </div>
      </div>
    );
  }
  if (state.status === 'out_of_stock') {
    return (
      <div className="notice notice--warning" role="status">
        <GiftIcon />
        <p>{t('gwp.outOfStock')}</p>
      </div>
    );
  }
  if (promo) {
    return (
      <div className="notice">
        <GiftIcon />
        <p>{t('product.gwpPromo')}</p>
      </div>
    );
  }
  return null;
}

function GiftChooser({options}: {options: GiftOption[]}) {
  const {t, money} = useLocale();
  const fetcher = useFetcher<CartActionResult>({key: 'choose-gift'});
  const busy = fetcher.state !== 'idle';

  return (
    <>
      <ul className="gift-chooser__list">
        {options.map((o) => (
          <li key={o.variantId} className="gift-chooser__item">
            <ProductMedia image={o.image} art={o.art} title={o.title} sizes="56px" />
            <span className="gift-chooser__title">
              {o.title}
              <span className="small">
                <s className="muted">{money(o.price)}</s> {t('gwp.free')}
              </span>
            </span>
            <fetcher.Form method="post" action="/cart">
              <input type="hidden" name="intent" value="chooseGift" />
              <input type="hidden" name="merchandiseId" value={o.variantId} />
              <button className="button button--small button--outline" disabled={busy}>
                {t('gwp.choose')}
              </button>
            </fetcher.Form>
          </li>
        ))}
      </ul>
      {fetcher.data?.error && <p className="error small">{fetcher.data.error}</p>}
    </>
  );
}
