import {Link, useLocation, useRouteLoaderData} from 'react-router';
import type {RootLoader} from '~/root';
import {TwinklingStars} from './ramadan/Stars';
import {MosqueSkyline} from './ramadan/Skyline';
import {useLocale} from '~/lib/i18n';

export function Footer() {
  const data = useRouteLoaderData<RootLoader>('root');
  const {t, path} = useLocale();
  const {pathname} = useLocation();
  const on = Boolean(data?.ramadan.enabled);

  return (
    <footer className="footer">
      {on && (
        <>
          <MosqueSkyline className="footer__skyline" />
          <TwinklingStars count={30} seed={53} />
        </>
      )}
      <div className="container footer__inner">
        <div>
          <p className="footer__logo">AFNAN</p>
          <p className="muted">{t('footer.about')}</p>
        </div>
        <nav aria-label={t('footer.help')} className="footer__links">
          <Link to={path('/pages/ramadan-gifts')}>{t('nav.ramadan')}</Link>
          <Link to={path('/gift-box')}>{t('nav.buildBox')}</Link>
          <Link to={path('/loyalty')}>{t('nav.loyalty')}</Link>
          <Link to={path('/collections')}>{t('collections.title')}</Link>
        </nav>
        {/* The merchandiser switch is the afnan_settings metaobject in Shopify admin; this toggles it for the current visitor. */}
        <div className="ramadan-switch" role="group" aria-label={t('footer.ramadanSwitch')}>
          <span>{t('footer.ramadanSwitch')}</span>
          <Link
            to={`${pathname}?ramadan=on`}
            aria-pressed={on}
            className={on ? 'chip chip--active' : 'chip'}
            preventScrollReset
          >
            {t('footer.on')}
          </Link>
          <Link
            to={`${pathname}?ramadan=off`}
            aria-pressed={!on}
            className={!on ? 'chip chip--active' : 'chip'}
            preventScrollReset
          >
            {t('footer.off')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
