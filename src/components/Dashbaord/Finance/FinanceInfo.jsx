"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useLodgeData } from "../DashbaordProvider";

export default function FinanceInfo() {
  const { rooms, reservations, getLodgeData } = useLodgeData();

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };
  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={container}
    >
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        variants={item}
      >
        <div>
          <motion.h1
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-900"
          >
            تحلیل درآمد
          </motion.h1>
          <motion.p
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-gray-600 mt-1"
          >
            تحلیل درآمد اقامت گاه
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}
