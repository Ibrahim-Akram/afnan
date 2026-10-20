import {Link, useLoaderData, useRouteLoaderData, useSearchParams} from 'react-router';
import type {Route} from './+types/($locale).pages.ramadan-gifts';
import type {RootLoader} from '~/root';
import {assertLocaleParam, useLocale, type MessageKey} from '~/lib/i18n';
import {titleFor} from '~/lib/meta';
import {BUDGETS, STORE, type BudgetId} from '~/lib/store-config';
import {Countdown} from '~/components/Countdown';
import {ProductGrid} from '~/components/ProductCard';
import {Crescent} from '~/components/Icons';
import {RamadanScene} from '~/components/ramadan/RamadanScene';

export const meta: Route.MetaFunction = ({matches}) => titleFor(matches, 'gifting.metaTitle');

export async function loader({params, context}: Route.LoaderArgs) {
  assertLocaleParam(params.locale);
  const collection = await context.commerce.getCollection(STORE.collections.giftSets);
  return {giftSets: collection?.products.filter((p) => !p.tags.includes('hidden')) ?? []};
}

const FAQ = [1, 2, 3, 4, 5] as const;

export default function RamadanGifts() {
  const {giftSets} = useLoaderData<typeof loader>();
  const root = useRouteLoaderData<RootLoader>('root');
  const {t, path} = useLocale();
  const [params] = useSearchParams();
  const active = (BUDGETS.find((b) => b.id === params.get('budget'))?.id ??
    BUDGETS[0].id) as BudgetId;
  const budget = BUDGETS.find((b) => b.id === active)!;
  const inBudget = giftSets.filter((p) => {
    const price = Number(p.price.amount);
    return price >= budget.min && price < budget.max;
  });

  return (
    <div className="gifting">
      <section className="gifting-hero gifting-hero--animated" aria-labelledby="gifting-title">
        <RamadanScene seed={17} />
        <div className="container gifting-hero__inner">
          <p className="eyebrow">
            <Crescent /> {t('gifting.eyebrow')}
          </p>
          <h1 id="gifting-title">{t('gifting.title')}</h1>
          <p className="lead">{t('gifting.text')}</p>
          <p className="countdown__title">{t('gifting.countdownTitle')}</p>
          {root && <Countdown target={root.ramadan.eidDate} serverNow={root.now} />}
          <a className="button button--gold" href="#budget">
            {t('gifting.shopNow')}
          </a>
        </div>
      </section>

      <section id="budget" className="container section" aria-labelledby="budget-title">
        <h2 id="budget-title" className="section__title">{t('gifting.budgetTitle')}</h2>
        <nav className="tabs" aria-label={t('gifting.budgetTitle')}>
          {BUDGETS.map((b) => (
            <Link
              key={b.id}
              to={`?budget=${b.id}#budget`}
              replace
              preventScrollReset
              className={b.id === active ? 'tab tab--active' : 'tab'}
              aria-current={b.id === active ? 'true' : undefined}
            >
              {t(`gifting.budget.${b.id}` as MessageKey)}
            </Link>
          ))}
        </nav>
        {inBudget.length ? (
          <ProductGrid products={inBudget} quickAdd />
        ) : (
          <p className="muted">{t('gifting.budgetEmpty')}</p>
        )}
      </section>

      <section className="container section">
        <div className="promo">
          <div>
            <h2>{t('gifting.boxTitle')}</h2>
            <p>{t('gifting.boxText')}</p>
          </div>
          <Link className="button button--gold" to={path('/gift-box')}>
            {t('gifting.boxCta')}
          </Link>
        </div>
      </section>

      <section className="container section faq" aria-labelledby="faq-title">
        <h2 id="faq-title" className="section__title">{t('gifting.faqTitle')}</h2>
        {FAQ.map((n) => (
          <details key={n} className="faq__item">
            <summary>{t(`gifting.faq.${n}.q`)}</summary>
            <p>{t(`gifting.faq.${n}.a`)}</p>
          </details>
        ))}
      </section>
    </div>
  );
}
