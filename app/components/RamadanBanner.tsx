import {Link} from 'react-router';
import {motion, type Variants} from 'framer-motion';
import {useLocale} from '~/lib/i18n';
import {Crescent} from './Icons';
import {RamadanScene} from './ramadan/RamadanScene';

const container: Variants = {
  hidden: {},
  show: {transition: {staggerChildren: 0.15, delayChildren: 0.35}},
};
const item: Variants = {
  hidden: {opacity: 0, y: 24},
  show: {opacity: 1, y: 0, transition: {duration: 0.7, ease: [0.16, 1, 0.3, 1]}},
};

/** Animated Ramadan night scene: moon, lanterns, stars and skyline. */
export function RamadanBanner() {
  const {t, path} = useLocale();
  return (
    <section className="ramadan-banner ramadan-banner--animated" aria-labelledby="ramadan-banner-title">
      <RamadanScene />
      <motion.div className="container ramadan-banner__inner" variants={container} initial="hidden" animate="show">
        <motion.p className="eyebrow" variants={item}>
          <Crescent /> {t('banner.eyebrow')}
        </motion.p>
        <motion.h2 id="ramadan-banner-title" variants={item} className="ramadan-banner__title">
          {t('banner.title')}
        </motion.h2>
        <motion.p variants={item}>{t('banner.text')}</motion.p>
        <motion.div className="button-row" variants={item}>
          <motion.span whileHover={{scale: 1.04}} whileTap={{scale: 0.97}}>
            <Link className="button button--gold button--shine" to={path('/pages/ramadan-gifts')}>
              {t('banner.cta')}
            </Link>
          </motion.span>
          <motion.span whileHover={{scale: 1.04}} whileTap={{scale: 0.97}}>
            <Link className="button button--ghost" to={path('/gift-box')}>
              {t('banner.secondary')}
            </Link>
          </motion.span>
        </motion.div>
      </motion.div>
    </section>
  );
}
