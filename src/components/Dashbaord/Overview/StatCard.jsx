"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { convertToPersianDigits } from "@/lib/jalali";
import { motion } from "framer-motion";
export default function StatCard({
  title,
  icon,
  value,
  description,
  cardIndex,
}) {
  const cardVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      custom={cardIndex}
      variants={cardVariants}
    >
      <Card className="shadow-xl gap-2">
        <CardHeader className="flex flex-row items-center justify-start gap-2 pb-2">
          {icon}
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.h3
            className="text-2xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + cardIndex * 0.1 }} // Extra delay for content
          >
            {convertToPersianDigits(value)}
          </motion.h3>
          <motion.p
            className="text-xs text-muted-foreground mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 + cardIndex * 0.1 }}
          >
            {convertToPersianDigits(description)}
          </motion.p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
