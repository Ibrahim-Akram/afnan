import {useRouteLoaderData} from 'react-router';
import type {RootLoader} from '~/root';
import {useLocale} from '~/lib/i18n';
import {GiftIcon} from './Icons';

/**
 * "You've unlocked a free gift" on the product page and in the cart, or a
 * soft message if the gift is out of stock. `promo` shows the offer on
 * qualifying products before it is unlocked.
 */
export function FreeGiftNotice({promo = false}: {promo?: boolean}) {
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
