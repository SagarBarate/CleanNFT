"use client";

import { motion } from "framer-motion";
import { Recycle } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-6 h-6",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`relative ${sizeClasses[size]}`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="absolute inset-0 border-2 border-green-200 dark:border-green-800 rounded-full" />
        <div className="absolute inset-1 border-2 border-green-500 dark:border-green-400 rounded-full border-t-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Recycle className={`${iconSizes[size]} text-green-600 dark:text-green-400`} />
        </div>
      </motion.div>
    </div>
  );
}

