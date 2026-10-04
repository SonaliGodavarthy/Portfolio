"use client";

import { motion } from "motion/react";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, transform: "translateY(16px)" }}
      animate={{ opacity: 1, transform: "translateY(0px)" }}
      transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}
