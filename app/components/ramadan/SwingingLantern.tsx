import {useId} from 'react';
import {motion} from 'framer-motion';

/** A Fanous lantern on a chain that sways and flickers. */
export function SwingingLantern({
  className,
  delay = 0,
  size = 1,
}: {
  className?: string;
  delay?: number;
  size?: number;
}) {
  const glow = `lantern-glow-${useId().replace(/:/g, '')}`;
  return (
    <motion.div
      className={`swinging-lantern ${className ?? ''}`}
      style={{originY: 0, originX: 0.5, width: 56 * size, height: 150 * size}}
      initial={{y: -160, rotate: 0}}
      animate={{y: 0, rotate: [-7, 7, -7]}}
      transition={{
        y: {type: 'spring', stiffness: 60, damping: 12, delay},
        rotate: {duration: 3.6 + delay, repeat: Infinity, ease: 'easeInOut', delay},
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 56 150" width="100%" height="100%">
        <defs>
          <radialGradient id={glow} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffe9a8" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#f2b84b" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f2b84b" stopOpacity="0" />
          </radialGradient>
        </defs>
        <line x1="28" y1="0" x2="28" y2="52" stroke="#d4af37" strokeWidth="1.5" />
        <motion.circle
          cx="28"
          cy="100"
          r="34"
          fill={`url(#${glow})`}
          animate={{opacity: [0.55, 1, 0.7, 0.95, 0.55]}}
          transition={{duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay}}
        />
        <path d="M20 52h16l-3 8H23Z" fill="#d4af37" />
        <circle cx="28" cy="50" r="3" fill="none" stroke="#d4af37" strokeWidth="1.5" />
        <path
          d="M17 60h22l7 22-7 34H17l-7-34Z"
          fill="rgb(212 175 55 / 0.18)"
          stroke="#d4af37"
          strokeWidth="1.6"
        />
        <path d="M28 60v56M10 82h36M14 100h28" stroke="#d4af37" strokeWidth="0.9" opacity="0.7" />
        <path d="M20 116h16l-3 8H23Z" fill="#d4af37" />
        <circle cx="28" cy="128" r="2.5" fill="#d4af37" />
        <motion.ellipse
          cx="28"
          cy="92"
          rx="4"
          ry="6"
          fill="#fff3c4"
          animate={{scaleY: [1, 1.25, 0.9, 1.15, 1], opacity: [0.8, 1, 0.75, 1, 0.8]}}
          transition={{duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay}}
          style={{originX: '28px', originY: '98px'}}
        />
      </svg>
    </motion.div>
  );
}
