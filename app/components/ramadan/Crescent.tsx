import {motion} from 'framer-motion';

/** Large glowing crescent moon with a star, used in the banner and switch reveal. */
export function GlowingCrescent({className, delay = 0}: {className?: string; delay?: number}) {
  return (
    <motion.div
      className={`glowing-crescent ${className ?? ''}`}
      initial={{opacity: 0, y: 40, rotate: -25, scale: 0.8}}
      animate={{opacity: 1, y: 0, rotate: 0, scale: 1}}
      transition={{duration: 1.4, ease: [0.16, 1, 0.3, 1], delay}}
      aria-hidden="true"
    >
      <motion.div
        className="glowing-crescent__halo"
        animate={{scale: [1, 1.12, 1], opacity: [0.5, 0.85, 0.5]}}
        transition={{duration: 4, repeat: Infinity, ease: 'easeInOut'}}
      />
      <svg viewBox="0 0 120 120" width="100%" height="100%">
        <path d="M74 12a50 50 0 1 0 34 82A42 42 0 1 1 74 12Z" fill="#f3d27a" />
        <motion.path
          d="m92 30 2.6 6 6.4.6-4.8 4.3 1.4 6.4-5.6-3.3-5.6 3.3 1.4-6.4-4.8-4.3 6.4-.6Z"
          fill="#fff3c4"
          animate={{scale: [1, 1.35, 1], opacity: [0.8, 1, 0.8]}}
          transition={{duration: 2.2, repeat: Infinity, ease: 'easeInOut'}}
          style={{originX: '92px', originY: '38px'}}
        />
      </svg>
    </motion.div>
  );
}
