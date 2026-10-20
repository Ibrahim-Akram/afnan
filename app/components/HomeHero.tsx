import {Link} from 'react-router';
import {motion, type Variants} from 'framer-motion';
import {useLocale} from '~/lib/i18n';
import {RisingSparkles} from './ramadan/Sparkles';

const container: Variants = {
  hidden: {},
  show: {transition: {staggerChildren: 0.14, delayChildren: 0.2}},
};
const item: Variants = {
  hidden: {opacity: 0, y: 22},
  show: {opacity: 1, y: 0, transition: {duration: 0.7, ease: [0.16, 1, 0.3, 1]}},
};

/**
 * Home banner for the everyday (non-Ramadan) look. If a Hero image is set
 * in Afnan settings it fills the banner; otherwise an illustrated still life
 * of three Afnan bottles on a marble plinth is drawn.
 */
export function HomeHero({image}: {image: {url: string; altText: string | null} | null}) {
  const {t, path} = useLocale();
  return (
    <section className={`home-hero${image ? ' home-hero--photo' : ''}`} aria-labelledby="home-hero-title">
      {image ? (
        <img
          className="home-hero__photo"
          src={`${image.url}${image.url.includes('?') ? '&' : '?'}width=2000`}
          alt={image.altText ?? ''}
          fetchPriority="high"
        />
      ) : (
        <PerfumeStillLife />
      )}
      <div className="home-hero__shade" aria-hidden="true" />
      <motion.div className="container home-hero__inner" variants={container} initial="hidden" animate="show">
        <motion.p className="eyebrow" variants={item}>
          {t('home.heroEyebrow')}
        </motion.p>
        <motion.h1 id="home-hero-title" className="home-hero__title" variants={item}>
          {t('home.heroTitle')}
        </motion.h1>
        <motion.p className="home-hero__text" variants={item}>
          {t('home.heroText')}
        </motion.p>
        <motion.div className="button-row" variants={item}>
          <motion.span whileHover={{scale: 1.04}} whileTap={{scale: 0.97}}>
            <Link className="button button--gold button--shine" to={path('/collections/femme-collection')}>
              {t('home.heroCta')}
            </Link>
          </motion.span>
          <motion.span whileHover={{scale: 1.04}} whileTap={{scale: 0.97}}>
            <Link className="button button--ghost" to={path('/collections/homme')}>
              {t('home.heroCta2')}
            </Link>
          </motion.span>
        </motion.div>
      </motion.div>
    </section>
  );
}

type BottleProps = {x: number; delay: number; liquid: [string, string]; shape: 'tall' | 'round' | 'octagon'; id: string};

function Bottle({x, delay, liquid, shape, id}: BottleProps) {
  const body =
    shape === 'tall'
      ? 'M-46 0 Q-50 0 -50 -6 V-200 Q-50 -226 -22 -230 H22 Q50 -226 50 -200 V-6 Q50 0 46 0 Z'
      : shape === 'round'
        ? 'M0 0 C-62 0 -92 -40 -92 -92 C-92 -146 -52 -178 0 -178 C52 -178 92 -146 92 -92 C92 -40 62 0 0 0 Z'
        : 'M-38 0 L-66 -28 V-128 L-38 -156 H38 L66 -128 V-28 L38 0 Z';
  const top = shape === 'tall' ? -230 : shape === 'round' ? -178 : -156;
  const cap =
    shape === 'round' ? (
      <path d={`M-26 ${top - 22} L-34 ${top - 70} L0 ${top - 96} L34 ${top - 70} L26 ${top - 22} Z`} fill="url(#hh-gold)" />
    ) : shape === 'octagon' ? (
      <>
        <rect x={-24} y={top - 104} width={48} height={84} rx={4} fill="#1f1712" />
        <rect x={-24} y={top - 40} width={48} height={8} fill="url(#hh-gold)" />
      </>
    ) : (
      <rect x={-28} y={top - 84} width={56} height={64} rx={6} fill="url(#hh-gold)" />
    );

  const glass = (
    <>
      <rect x={-12} y={top - 22} width={24} height={24} fill="url(#hh-gold)" />
      {cap}
      <path d={body} fill={`url(#${id})`} stroke="rgb(255 240 210 / 0.5)" strokeWidth={1.5} />
      <path d={body} fill="url(#hh-glass)" />
      <rect x={shape === 'round' ? -58 : -36} y={top + 24} width={9} height={shape === 'round' ? 90 : top * -0.6} rx={4.5} fill="rgb(255 255 255 / 0.35)" />
      <rect x={-26} y={top * 0.62 - 14} width={52} height={28} rx={2} fill="rgb(250 240 220 / 0.85)" />
      <rect x={-18} y={top * 0.62 - 3} width={36} height={2} fill="#8a6a3b" />
    </>
  );

  return (
    <g transform={`translate(${x} 520)`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={liquid[0]} />
          <stop offset="1" stopColor={liquid[1]} />
        </linearGradient>
      </defs>
      <motion.g
        animate={{y: [0, -8, 0]}}
        transition={{duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay}}
      >
        {glass}
      </motion.g>
      <g transform="scale(1 -0.55)" opacity={0.22} mask="url(#hh-fade)">
        {glass}
      </g>
    </g>
  );
}

/** Warm amber still life: light falling through an arch onto three bottles. */
function PerfumeStillLife() {
  return (
    <div className="home-hero__art" aria-hidden="true">
      <svg viewBox="0 0 1200 640" preserveAspectRatio="xMaxYMid slice">
        <defs>
          <radialGradient id="hh-bg" cx="0.72" cy="0.4" r="0.75">
            <stop offset="0" stopColor="#6b4420" />
            <stop offset="0.45" stopColor="#3a2414" />
            <stop offset="1" stopColor="#140d08" />
          </radialGradient>
          <linearGradient id="hh-beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f6d58f" stopOpacity="0.55" />
            <stop offset="1" stopColor="#f6d58f" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hh-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f3dc9b" />
            <stop offset="0.5" stopColor="#c9a24a" />
            <stop offset="1" stopColor="#8a6a2b" />
          </linearGradient>
          <linearGradient id="hh-glass" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0.18" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="hh-marble" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#efe2c9" />
            <stop offset="1" stopColor="#b89a6c" />
          </linearGradient>
          <linearGradient id="hh-fade-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#fff" />
          </linearGradient>
          <mask id="hh-fade" maskContentUnits="userSpaceOnUse">
            <rect x="-200" y="-400" width="400" height="400" fill="url(#hh-fade-g)" />
          </mask>
          <linearGradient id="hh-plinth-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#1a110a" />
            <stop offset="1" stopColor="#1a110a" stopOpacity="0" />
          </linearGradient>
          <filter id="hh-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="24" />
          </filter>
        </defs>

        <rect width="1200" height="640" fill="url(#hh-bg)" />

        {/* Arched window and the light falling through it */}
        <path
          d="M760 640 V250 Q760 120 880 90 Q1000 120 1000 250 V640"
          fill="none"
          stroke="#d4af37"
          strokeOpacity="0.28"
          strokeWidth="2"
        />
        <path
          d="M730 640 V240 Q730 90 880 56 Q1030 90 1030 240 V640"
          fill="none"
          stroke="#d4af37"
          strokeOpacity="0.14"
          strokeWidth="1.5"
        />
        <motion.polygon
          points="820,0 960,0 1120,520 640,520"
          fill="url(#hh-beam)"
          animate={{opacity: [0.55, 0.9, 0.55]}}
          transition={{duration: 7, repeat: Infinity, ease: 'easeInOut'}}
        />

        {/* Drifting mist */}
        <motion.ellipse
          cx="760"
          cy="470"
          rx="200"
          ry="40"
          fill="#f6e2b5"
          opacity="0.12"
          filter="url(#hh-blur)"
          animate={{cx: [740, 820, 740]}}
          transition={{duration: 14, repeat: Infinity, ease: 'easeInOut'}}
        />

        {/* Plinth */}
        <ellipse cx="880" cy="600" rx="330" ry="26" fill="#000" opacity="0.35" filter="url(#hh-blur)" />
        <rect x="580" y="520" width="620" height="120" fill="url(#hh-marble)" />
        <rect x="700" y="520" width="500" height="5" fill="#fff6e3" opacity="0.7" />
        <rect x="579" y="518" width="160" height="124" fill="url(#hh-plinth-fade)" />
        <path d="M650 545 q60 18 130 6 t150 14 t170 -8" stroke="#9c7e52" strokeOpacity="0.35" fill="none" />

        <Bottle id="hh-l1" x={735} delay={0.6} shape="octagon" liquid={['#3a2a4f', '#1c1424']} />
        <Bottle id="hh-l3" x={1035} delay={1.2} shape="round" liquid={['#e3a24a', '#8f4e15']} />
        <Bottle id="hh-l2" x={885} delay={0} shape="tall" liquid={['#c8566f', '#6e1f33']} />

        {/* Rose petals on the plinth */}
        <path d="M660 522 q14 -14 28 0 q-14 8 -28 0z" fill="#b23a5b" opacity="0.85" />
        <path d="M1110 523 q12 -12 24 0 q-12 7 -24 0z" fill="#b23a5b" opacity="0.75" />
        <path d="M968 524 q10 -10 20 0 q-10 6 -20 0z" fill="#c8566f" opacity="0.7" />
      </svg>
      <RisingSparkles count={12} seed={7} />
    </div>
  );
}
