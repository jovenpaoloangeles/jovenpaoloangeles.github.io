import type { Variants } from 'framer-motion';

// Short, precise scroll reveals — restrained motion only.
// Usage:
//   <motion.div variants={reveal} custom={i} initial="hidden"
//               whileInView="show" viewport={{ once: true, margin: '-12%' }} />
export const reveal: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] },
  }),
};

// Optional container that staggers its reveal-variant children.
export const revealContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
