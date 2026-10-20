import {motion} from 'framer-motion';
import {starField} from './Stars';

const POINTS = 12;

/**
 * A festive string of small swaying lanterns and stars under the header,
 * used on pages without their own Ramadan hero.
 */
export function RamadanGarland() {
  const stars = starField(18, 41);
  return (
    <div className="ramadan-garland" aria-hidden="true">
      <svg className="ramadan-garland__string" viewBox="0 0 1200 40" preserveAspectRatio="none">
        <path
          d={Array.from({length: POINTS}, (_, i) => {
            const x = (1200 / POINTS) * i;
            const w = 1200 / POINTS;
            return `${i === 0 ? 'M0 2' : ''} Q${x + w / 2} 26 ${x + w} 2`;
          }).join(' ')}
          fill="none"
          stroke="#d4af37"
          strokeWidth="1.4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {Array.from({length: POINTS}, (_, i) => {
        const left = ((i + 0.5) / POINTS) * 100;
        const kind = i % 3;
        return (
          <motion.span
            key={i}
            className={`ramadan-garland__charm ramadan-garland__charm--${kind === 0 ? 'lantern' : kind === 1 ? 'star' : 'moon'}`}
            style={{left: `${left}%`, originY: 0}}
            initial={{y: -30, opacity: 0}}
            animate={{y: 0, opacity: 1, rotate: [-8, 8, -8]}}
            transition={{
              y: {type: 'spring', stiffness: 80, damping: 10, delay: i * 0.06},
              opacity: {duration: 0.4, delay: i * 0.06},
              rotate: {duration: 3 + (i % 4) * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2},
            }}
          >
            <span className="ramadan-garland__thread" />
            {kind === 0 ? <MiniLantern /> : kind === 1 ? <MiniStar /> : <MiniMoon />}
          </motion.span>
        );
      })}
      {stars.map((s) => (
        <motion.i
          key={s.id}
          className="ramadan-garland__twinkle"
          style={{left: `${s.x}%`, top: `${20 + s.y * 0.6}%`}}
          animate={{opacity: [0, 1, 0], scale: [0.6, 1.2, 0.6]}}
          transition={{duration: s.duration, delay: s.delay, repeat: Infinity}}
        />
      ))}
    </div>
  );
}

function MiniLantern() {
  return (
    <svg viewBox="0 0 20 34" width="16" height="28">
      <path d="M7 2h6l-1 3H8Z" fill="#d4af37" />
      <path d="M6 5h8l3 9-3 13H6L3 14Z" fill="rgb(212 175 55 / 0.25)" stroke="#d4af37" strokeWidth="1.2" />
      <ellipse cx="10" cy="15" rx="2" ry="3" fill="#f2b84b" />
      <path d="M7 27h6l-1 3H8Z" fill="#d4af37" />
    </svg>
  );
}

function MiniStar() {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14">
      <path d="m10 1 2.6 6 6.4.6-4.8 4.3 1.4 6.4L10 15l-5.6 3.3 1.4-6.4L1 7.6 7.4 7Z" fill="#d4af37" />
    </svg>
  );
}

function MiniMoon() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15">
      <path d="M12 1a9 9 0 1 0 7 14A7.5 7.5 0 1 1 12 1Z" fill="#d4af37" />
    </svg>
  );
}
