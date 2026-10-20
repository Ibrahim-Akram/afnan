import {useEffect, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {useLocale} from '~/lib/i18n';
import {GlowingCrescent} from './Crescent';
import {TwinklingStars} from './Stars';

/**
 * Plays a short full-screen moment when the Ramadan switch changes:
 * the night sky sweeps in with the moon and a greeting, then fades away
 * to reveal the re-themed store. Turning it off lets the moon set.
 */
export function RamadanReveal({enabled}: {enabled: boolean}) {
  const {t} = useLocale();
  const previous = useRef(enabled);
  const [mode, setMode] = useState<'on' | 'off' | null>(null);

  useEffect(() => {
    if (previous.current === enabled) return;
    previous.current = enabled;
    setMode(enabled ? 'on' : 'off');
    const id = setTimeout(() => setMode(null), enabled ? 2600 : 1400);
    return () => clearTimeout(id);
  }, [enabled]);

  return (
    <AnimatePresence>
      {mode === 'on' && (
        <motion.div
          key="on"
          className="ramadan-reveal"
          initial={{clipPath: 'circle(0% at 50% 100%)'}}
          animate={{clipPath: 'circle(150% at 50% 100%)'}}
          exit={{opacity: 0, transition: {duration: 0.7}}}
          transition={{duration: 0.9, ease: [0.65, 0, 0.35, 1]}}
          aria-hidden="true"
        >
          <TwinklingStars count={50} seed={3} />
          <GlowingCrescent className="ramadan-reveal__moon" delay={0.35} />
          <motion.p
            className="ramadan-reveal__text"
            initial={{opacity: 0, y: 20, letterSpacing: '0.4em'}}
            animate={{opacity: 1, y: 0, letterSpacing: '0.12em'}}
            transition={{delay: 0.8, duration: 0.9, ease: 'easeOut'}}
          >
            {t('banner.eyebrow')}
          </motion.p>
        </motion.div>
      )}
      {mode === 'off' && (
        <motion.div
          key="off"
          className="ramadan-reveal ramadan-reveal--off"
          initial={{opacity: 1}}
          animate={{opacity: 0}}
          transition={{duration: 1.2, ease: 'easeIn'}}
          aria-hidden="true"
        >
          <motion.div initial={{y: 0}} animate={{y: 160, opacity: 0}} transition={{duration: 1.1, ease: 'easeIn'}}>
            <GlowingCrescent className="ramadan-reveal__moon" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
