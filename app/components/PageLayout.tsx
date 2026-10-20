import {useLocation, useRouteLoaderData} from 'react-router';
import {motion, MotionConfig} from 'framer-motion';
import type {RootLoader} from '~/root';
import {AnnouncementBar} from './AnnouncementBar';
import {Header} from './Header';
import {Footer} from './Footer';
import {RamadanReveal} from './ramadan/RamadanReveal';

export function PageLayout({children}: {children?: React.ReactNode}) {
  const data = useRouteLoaderData<RootLoader>('root');
  const ramadan = Boolean(data?.ramadan.enabled);
  const {pathname} = useLocation();

  return (
    // Visitors who ask for reduced motion get the Ramadan look without movement.
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <AnnouncementBar />
      <Header />
      {ramadan ? (
        <motion.main
          id="main"
          key={pathname}
          initial={{opacity: 0, y: 12}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.5, ease: 'easeOut'}}
        >
          {children}
        </motion.main>
      ) : (
        <main id="main">{children}</main>
      )}
      <Footer />
      <RamadanReveal enabled={ramadan} />
    </MotionConfig>
  );
}
