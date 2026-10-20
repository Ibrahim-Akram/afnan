import {motion} from 'framer-motion';

/** Mosque silhouette along the bottom of a Ramadan section. */
export function MosqueSkyline({className}: {className?: string}) {
  return (
    <motion.svg
      className={`mosque-skyline ${className ?? ''}`}
      viewBox="0 0 1200 140"
      preserveAspectRatio="none"
      initial={{opacity: 0, y: 30}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 1.2, delay: 0.3, ease: 'easeOut'}}
      aria-hidden="true"
    >
      <path
        fill="rgb(8 15 36 / 0.85)"
        d="M0 140V112h60v-8h10v8h40V96c0-14 12-26 26-30 14 4 26 16 26 30v16h30V70l4-12 4 12v42h40V90c0-24 20-44 44-52 24 8 44 28 44 52v22h36V60l5-14 5 14v52h50v-14c0-10 8-18 18-22 10 4 18 12 18 22v14h60V84c0-30 26-56 56-66 30 10 56 36 56 66v28h40V64l5-14 5 14v48h44V98c0-12 10-22 22-26 12 4 22 14 22 26v14h46V76l4-12 4 12v36h52V92c0-20 16-38 36-44 20 6 36 24 36 44v20h70v-10h10v10H1200V140Z"
      />
    </motion.svg>
  );
}
