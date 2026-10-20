import {Link, useRouteLoaderData} from 'react-router';
import type {Route} from './+types/($locale).loyalty';
import type {RootLoader} from '~/root';
import {assertLocaleParam, useLocale, type MessageKey} from '~/lib/i18n';
import {titleFor} from '~/lib/meta';
import {TIERS} from '~/lib/loyalty';
import {RamadanScene} from '~/components/ramadan/RamadanScene';

export const meta: Route.MetaFunction = ({matches}) => titleFor(matches, 'loyalty.metaTitle');

export async function loader({params}: Route.LoaderArgs) {
  assertLocaleParam(params.locale);
  return {};
}

const STEPS = [1, 2, 3] as const;
const EARN = ['purchase', 'review', 'birthday', 'referral'] as const;

export default function Loyalty() {
  const root = useRouteLoaderData<RootLoader>('root');
  const {t, path} = useLocale();
  const ramadan = Boolean(root?.ramadan.enabled);
  // Mock mode has no sign-up, so the button goes straight to the demo account.
  const joinTo = root?.mode === 'shopify' ? '/account/login' : path('/account');

  const yesNo = (value: boolean) => (
    <span className={value ? 'tick' : 'cross'} aria-label={t(value ? 'loyalty.yes' : 'loyalty.no')}>
      {value ? '✓' : '—'}
    </span>
  );

  return (
    <div className="loyalty">
      <section className="loyalty-hero">
        {ramadan && <RamadanScene seed={29} lanterns={2} skyline={false} />}
        <div className="container loyalty-hero__inner">
          <p className="eyebrow">{t('loyalty.eyebrow')}</p>
          <h1>{t('loyalty.title')}</h1>
          <p className="lead">{t('loyalty.text')}</p>
          <div className="button-row">
            <Link className="button button--gold" to={joinTo}>
              {t('loyalty.join')}
            </Link>
            <Link className="button button--ghost" to={path('/account')}>
              {t('loyalty.viewAccount')}
            </Link>
          </div>
        </div>
      </section>

      <section className="container section" aria-labelledby="how-title">
        <h2 id="how-title" className="section__title">{t('loyalty.howTitle')}</h2>
        <ol className="steps">
          {STEPS.map((n) => (
            <li key={n} className="step">
              <span className="step__number">{n}</span>
              <h3>{t(`loyalty.step${n}.title`)}</h3>
              <p>{t(`loyalty.step${n}.text`)}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container section" aria-labelledby="tiers-title">
        <h2 id="tiers-title" className="section__title">{t('loyalty.tiersTitle')}</h2>
        <div className="table-scroll">
          <table className="table tier-table">
            <thead>
              <tr>
                <th scope="col">{t('loyalty.benefit')}</th>
                {TIERS.map((tier) => (
                  <th scope="col" key={tier.id} className={`tier-head tier-head--${tier.id}`}>
                    {t(`loyalty.tier.${tier.id}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">{t('loyalty.row.threshold')}</th>
                {TIERS.map((tier) => (
                  <td key={tier.id}>{tier.min.toLocaleString('en')}+</td>
                ))}
              </tr>
              <tr>
                <th scope="row">{t('loyalty.row.earn')}</th>
                {TIERS.map((tier) => (
                  <td key={tier.id}>{tier.multiplier}</td>
                ))}
              </tr>
              {(['birthday', 'shipping', 'samples', 'early'] as const).map((row) => (
                <tr key={row}>
                  <th scope="row">{t(`loyalty.row.${row}` as MessageKey)}</th>
                  {TIERS.map((tier) => (
                    <td key={tier.id}>{yesNo(tier[row])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="container section" aria-labelledby="earn-title">
        <h2 id="earn-title" className="section__title">{t('loyalty.earnTitle')}</h2>
        <ul className="earn-grid">
          {EARN.map((way) => (
            <li key={way} className="earn-card">
              <h3>{t(`loyalty.earn.${way}` as MessageKey)}</h3>
              <p className="earn-card__value">{t(`loyalty.earn.${way}Value` as MessageKey)}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container section" aria-labelledby="flow-title">
        <h2 id="flow-title" className="section__title">{t('loyalty.flowTitle')}</h2>
        <img
          className="flow-diagram"
          src="/loyalty-flow.svg"
          alt={t('loyalty.flowAlt')}
          width="1200"
          height="800"
          loading="lazy"
        />
        <div className="button-row button-row--center">
          <Link className="button" to={joinTo}>
            {t('loyalty.join')}
          </Link>
        </div>
      </section>
    </div>
  );
}
