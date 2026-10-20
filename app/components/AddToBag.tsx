import {Link, useFetcher} from 'react-router';
import {useLocale} from '~/lib/i18n';
import type {CartActionResult} from '~/routes/($locale).cart';

export function AddToBag({
  variantId,
  available,
  compact = false,
}: {
  variantId: string;
  available: boolean;
  compact?: boolean;
}) {
  const fetcher = useFetcher<CartActionResult>({key: `add-${variantId}`});
  const {t, path} = useLocale();
  const busy = fetcher.state !== 'idle';
  const done = fetcher.state === 'idle' && fetcher.data?.ok;

  return (
    <fetcher.Form method="post" action="/cart" className="add-to-bag">
      <input type="hidden" name="intent" value="add" />
      <input type="hidden" name="merchandiseId" value={variantId} />
      <button
        type="submit"
        className={compact ? 'button button--small button--outline' : 'button button--block'}
        disabled={!available || busy}
      >
        {!available ? t('product.soldOut') : busy ? t('product.adding') : t('product.addToBag')}
      </button>
      <p className="add-to-bag__status" role="status" aria-live="polite">
        {done && (
          <>
            {t('product.added')} <Link to={path('/cart')}>{t('product.viewBag')}</Link>
          </>
        )}
        {fetcher.data?.error && <span className="error">{fetcher.data.error}</span>}
      </p>
    </fetcher.Form>
  );
}
