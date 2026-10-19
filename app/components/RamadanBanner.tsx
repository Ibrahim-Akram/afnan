import {Link} from 'react-router';
import {useLocale} from '~/lib/i18n';
import {Crescent, Lantern} from './Icons';

export function RamadanBanner() {
  const {t, path} = useLocale();
  return (
    <section className="ramadan-banner" aria-labelledby="ramadan-banner-title">
      <Lantern className="ramadan-banner__lantern ramadan-banner__lantern--a" />
      <Lantern className="ramadan-banner__lantern ramadan-banner__lantern--b" />
      <div className="container ramadan-banner__inner">
        <p className="eyebrow">
          <Crescent /> {t('banner.eyebrow')}
        </p>
        <h2 id="ramadan-banner-title">{t('banner.title')}</h2>
        <p>{t('banner.text')}</p>
        <div className="button-row">
          <Link className="button button--gold" to={path('/pages/ramadan-gifts')}>
            {t('banner.cta')}
          </Link>
          <Link className="button button--ghost" to={path('/gift-box')}>
            {t('banner.secondary')}
          </Link>
        </div>
      </div>
    </section>
  );
}
