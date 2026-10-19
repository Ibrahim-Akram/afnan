import {useLocale} from '~/lib/i18n';
import {POINT_VALUE_AED, progressFor} from '~/lib/loyalty';
import {STORE} from '~/lib/store-config';

export function LoyaltyWidget({points}: {points: number}) {
  const {t, money} = useLocale();
  const {tier, next, percent, remaining} = progressFor(points);
  const tierName = t(`loyalty.tier.${tier.id}`);

  return (
    <section className={`loyalty-widget loyalty-widget--${tier.id}`} aria-labelledby="loyalty-widget-title">
      <h2 id="loyalty-widget-title" className="visually-hidden">
        {t('loyalty.metaTitle')}
      </h2>
      <div className="loyalty-widget__stats">
        <div>
          <p className="muted small">{t('account.points')}</p>
          <p className="loyalty-widget__points">{points.toLocaleString('en')}</p>
          <p className="small">
            {t('account.worth', {
              amount: money({
                amount: String(Math.floor(points * POINT_VALUE_AED)),
                currencyCode: STORE.currency,
              }),
            })}
          </p>
        </div>
        <div>
          <p className="muted small">{t('account.tier')}</p>
          <p className="loyalty-widget__tier">{tierName}</p>
        </div>
      </div>
      <div
        className="progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label={next ? t('account.progress', {count: remaining, tier: t(`loyalty.tier.${next.id}`)}) : t('account.topTier')}
      >
        <span className="progress__bar" style={{width: `${percent}%`}} />
      </div>
      <p className="small">
        {next
          ? t('account.progress', {
              count: remaining.toLocaleString('en'),
              tier: t(`loyalty.tier.${next.id}`),
            })
          : t('account.topTier')}
      </p>
    </section>
  );
}
