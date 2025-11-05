"use client";

import { motion } from "framer-motion";
import { Recycle, Sparkles } from "lucide-react";

interface LoadingPageProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingPage({ 
  message = "Loading...", 
  fullScreen = true 
}: LoadingPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`${
        fullScreen ? "fixed inset-0 z-50" : "relative w-full h-full"
      } flex items-center justify-center bg-gradient-to-br from-white via-green-50/30 to-green-100/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900`}
    >
      <div className="flex flex-col items-center justify-center space-y-8">
        {/* Animated Logo Container */}
        <div className="relative">
          {/* Outer Rotating Circle */}
          <motion.div
            className="absolute inset-0 w-24 h-24 border-4 border-green-200 dark:border-green-800 rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          
          {/* Inner Rotating Circle (Reverse) */}
          <motion.div
            className="absolute inset-2 w-20 h-20 border-4 border-green-300 dark:border-green-700 rounded-full"
            animate={{ rotate: -360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          
          {/* Center Icon */}
          <motion.div
            className="relative w-24 h-24 flex items-center justify-center"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Recycle className="w-12 h-12 text-green-600 dark:text-green-400" />
            
            {/* Sparkle Effects */}
            {[...Array(6)].map((_, i) => {
              const angle = (i * 60) * (Math.PI / 180);
              const radius = 48;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              
              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.25,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles className="w-3 h-3 text-green-400" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center space-y-2"
        >
          <motion.h2
            className="text-2xl font-bold text-gray-800 dark:text-gray-200"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {message}
          </motion.h2>
          
          {/* Progress Bar */}
          <div className="w-64 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>

        {/* Animated Dots */}
        <motion.div
          className="flex space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-green-500 rounded-full"
              animate={{
                y: [0, -8, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

