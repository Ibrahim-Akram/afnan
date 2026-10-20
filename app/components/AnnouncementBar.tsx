import {useRouteLoaderData} from 'react-router';
import {motion} from 'framer-motion';
import type {RootLoader} from '~/root';
import {useLocale} from '~/lib/i18n';
import {Crescent} from './Icons';

export function AnnouncementBar() {
  const data = useRouteLoaderData<RootLoader>('root');
  const {t} = useLocale();
  const ramadan = data?.ramadan.enabled;

  return (
    <div className="announcement" role="region" aria-label="Announcement">
      {ramadan && (
        <motion.span
          className="announcement__icon-wrap"
          animate={{rotate: [-12, 12, -12]}}
          transition={{duration: 3, repeat: Infinity, ease: 'easeInOut'}}
        >
          <Crescent className="announcement__icon" />
        </motion.span>
      )}
      <span className={ramadan ? 'announcement__shimmer' : undefined}>
        {t(ramadan ? 'announcement.ramadan' : 'announcement.default')}
      </span>
    </div>
  );
}
