"use client";

import * as React from "react";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface ChatButtonProps {
  onClick: () => void;
}

export function ChatButton({ onClick }: ChatButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full",
        "bg-gradient-to-r from-[#00A86B] to-[#A3FFB0]",
        "text-white shadow-lg shadow-[#00A86B]/30",
        "flex items-center justify-center",
        "hover:shadow-xl hover:shadow-[#00A86B]/50",
        "transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-[#00A86B] focus:ring-offset-2"
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      aria-label="Open chat"
    >
      <MessageCircle className="h-6 w-6" />
    </motion.button>
  );
}

