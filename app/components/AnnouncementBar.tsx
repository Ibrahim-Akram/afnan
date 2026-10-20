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
      <motion.span
        key={ramadan ? 'ramadan' : 'default'}
        initial={ramadan ? {opacity: 0, y: -8} : false}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.6, ease: 'easeOut'}}
      >
        {t(ramadan ? 'announcement.ramadan' : 'announcement.default')}
      </motion.span>
    </div>
  );
}
