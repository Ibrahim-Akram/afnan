import {motion} from 'framer-motion';

/** Deterministic pseudo-random so server and client render the same sky. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function starField(count: number, seed = 7) {
  const rand = seeded(seed);
  return Array.from({length: count}, (_, i) => ({
    id: i,
    x: rand() * 100,
    y: rand() * 100,
    r: 0.6 + rand() * 1.6,
    delay: rand() * 4,
    duration: 2 + rand() * 3,
  }));
}

/** Twinkling stars that fill their positioned parent. */
export function TwinklingStars({count = 30, seed, className}: {count?: number; seed?: number; className?: string}) {
  const stars = starField(count, seed);
  return (
    <div className={`twinkling-stars ${className ?? ''}`} aria-hidden="true">
      {stars.map((s) => (
        <motion.span
          key={s.id}
          style={{left: `${s.x}%`, top: `${s.y}%`, width: s.r * 2, height: s.r * 2}}
          initial={{opacity: 0.15}}
          animate={{opacity: [0.15, 1, 0.15], scale: [0.8, 1.2, 0.8]}}
          transition={{duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut'}}
        />
      ))}
    </div>
  );
}
