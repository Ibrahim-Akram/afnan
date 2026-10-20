import {motion} from 'framer-motion';
import {starField} from './Stars';

/** Golden specks drifting upwards, like dust in lantern light. */
export function RisingSparkles({count = 14, seed = 21}: {count?: number; seed?: number}) {
  const specks = starField(count, seed);
  return (
    <div className="rising-sparkles" aria-hidden="true">
      {specks.map((s) => (
        <motion.span
          key={s.id}
          style={{left: `${s.x}%`, width: s.r * 3, height: s.r * 3}}
          initial={{y: 0, opacity: 0}}
          animate={{y: [-10, -220], opacity: [0, 1, 0], x: [0, s.r * 8, 0]}}
          transition={{duration: 5 + s.duration, delay: s.delay * 1.5, repeat: Infinity, ease: 'easeOut'}}
        />
      ))}
    </div>
  );
}
