import {useRouteLoaderData} from 'react-router';
import type {RootLoader} from '~/root';
import {useLocale} from '~/lib/i18n';
import {Crescent} from './Icons';

export function AnnouncementBar() {
  const data = useRouteLoaderData<RootLoader>('root');
  const {t} = useLocale();
  const ramadan = data?.ramadan.enabled;

  return (
    <div className="announcement" role="region" aria-label="Announcement">
      {ramadan && <Crescent className="announcement__icon" />}
      <span>{t(ramadan ? 'announcement.ramadan' : 'announcement.default')}</span>
    </div>
  );
}
