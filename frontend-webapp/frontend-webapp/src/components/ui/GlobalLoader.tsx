"use client";

import { useEffect, useState } from "react";
import { LoadingPage } from "./LoadingPage";

export function GlobalLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial page load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Adjust timing as needed

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return <LoadingPage message="Welcome to CleanNFT..." fullScreen={true} />;
}

