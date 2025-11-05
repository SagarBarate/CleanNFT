"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, TrendingUp } from "lucide-react";
import { useState } from "react";
import landingContent from "@/content/landing.json";

export default function Home() {
  const [points, setPoints] = useState(0);
  const [bottles, setBottles] = useState([1, 2, 3, 4, 5]); // 5 bottles in the bag
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [recycledCount, setRecycledCount] = useState(0);

  const recycleBottle = () => {
    if (bottles.length > 0) {
      // Remove a bottle
      setBottles(prev => prev.slice(1));
      // Add points (10 points per bottle)
      setPoints(prev => prev + 10);
      setRecycledCount(prev => prev + 1);
      // Trigger celebration
      setIsCelebrating(true);
      setTimeout(() => setIsCelebrating(false), 2000);
    }
  };

  const resetRecycling = () => {
    setBottles([1, 2, 3, 4, 5]);
    setPoints(0);
    setRecycledCount(0);
  };
  // Fallback content if landing.json fails to load
  const heroContent = {
    title: landingContent?.hero?.title || "Turning waste into digital impact.",
    subtitle: landingContent?.hero?.subtitle || "CleanNFT bridges sustainability and blockchain — rewarding every act of recycling.",
    description: landingContent?.hero?.description || "Recycle. Reward. Reimagine Ownership. Turn waste into digital value — powered by CleanNFT.",
    cta: {
      primary: landingContent?.hero?.cta?.primary || "Explore Minted NFTs",
      secondary: landingContent?.hero?.cta?.secondary || "Learn More",
    },
    features: landingContent?.features || [],
    reviews: landingContent?.reviews || { title: "Read Our Reviews", badges: [] },
    marketTrend: landingContent?.marketTrend || { title: "Market Trend", description: "Explore the latest minted NFTs from our recycling community." },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-green-50/30 to-white pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                  {heroContent.title}
                </h1>
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
                  <span className="text-[#00A86B] font-semibold">
                    {heroContent.subtitle}
                  </span>
                </p>
                <p className="text-lg text-gray-600 max-w-2xl">
                  {heroContent.description}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4">
                {heroContent.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00A86B]/10 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-[#00A86B]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/nfts">
                  <Button size="lg" className="w-full sm:w-auto">
                    {heroContent.cta.primary}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    {heroContent.cta.secondary}
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right Column - Interactive Recycling Bin */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full h-[600px] flex flex-col items-center justify-center">
                {/* Points Counter */}
                <div className="absolute top-4 left-0 right-0 text-center mb-4">
                  <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-lg border-2 border-[#00A86B]/20">
                    <span className="text-2xl">💚</span>
                    <span className="text-2xl font-bold text-[#00A86B]">{points}</span>
                    <span className="text-sm text-gray-600">points</span>
                  </div>
                </div>

                {/* Bottle Container (Plastic Bag) */}
                <div className="absolute top-20 right-8">
                  <div className="relative">
                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-4 shadow-lg border-2 border-blue-300">
                      <div className="text-xs text-blue-600 font-semibold mb-2 text-center">Plastic Bag</div>
                      <div className="flex gap-2 flex-wrap w-32">
                        {bottles.length > 0 ? (
                          bottles.map((bottle, index) => (
                            <motion.div
                              key={bottle}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-8 h-12 bg-gradient-to-b from-green-400 to-green-600 rounded-t-lg rounded-b-sm shadow-md cursor-pointer hover:scale-110 transition-transform"
                              onClick={recycleBottle}
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <div className="w-full h-2 bg-green-700 rounded-t-lg"></div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-xs text-gray-500 text-center w-full py-4">
                            No bottles left!
                            <button
                              onClick={resetRecycling}
                              className="mt-2 text-[#00A86B] font-semibold hover:underline"
                            >
                              Reset
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recycling Bin (VIN) */}
                <div className="relative mt-32">
                  <motion.div
                    animate={bottles.length === 0 ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 0.5 }}
                    className="relative"
                  >
                    {/* Bin Body */}
                    <div className="w-48 h-64 bg-gradient-to-b from-gray-300 to-gray-500 rounded-lg shadow-2xl border-4 border-gray-600 relative overflow-hidden">
                      {/* Bin Top Opening */}
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-56 h-20 bg-gradient-to-b from-gray-400 to-gray-600 rounded-t-lg border-4 border-gray-600"></div>
                      
                      {/* Recycling Symbol */}
                      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-6xl">♻️</div>
                      
                      {/* Bin Label */}
                      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-lg">
                        <span className="text-sm font-bold text-[#00A86B]">RECYCLE</span>
                      </div>

                      {/* Drop Zone Indicator */}
                      {bottles.length > 0 && (
                        <motion.div
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute top-0 left-0 right-0 h-24 bg-green-200/30 rounded-t-lg pointer-events-none"
                        />
                      )}
                    </div>

                    {/* Celebration Animation */}
                    <AnimatePresence>
                      {isCelebrating && (
                        <>
                          {/* Confetti Effect */}
                          {[...Array(20)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ 
                                opacity: 1,
                                x: 0,
                                y: 0,
                                rotate: 0,
                              }}
                              animate={{
                                opacity: [1, 1, 0],
                                x: Math.random() * 400 - 200,
                                y: Math.random() * 400 - 200,
                                rotate: Math.random() * 360,
                              }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 1, delay: i * 0.05 }}
                              className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full"
                              style={{
                                backgroundColor: ['#00A86B', '#A3FFB0', '#FFD700', '#FF6B6B'][Math.floor(Math.random() * 4)],
                              }}
                            />
                          ))}
                          
                          {/* Success Message */}
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#00A86B] to-[#A3FFB0] text-white px-6 py-3 rounded-full shadow-xl"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">🎉</span>
                              <span className="font-bold">+10 Points!</span>
                              <span className="text-2xl">🎉</span>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* Instruction Text */}
                <div className="absolute bottom-8 left-0 right-0 text-center">
                  <p className="text-sm text-gray-600">
                    {bottles.length > 0 
                      ? `Click bottles to recycle! ${bottles.length} bottle${bottles.length > 1 ? 's' : ''} remaining`
                      : `🎊 Great job! You recycled ${recycledCount} bottles and earned ${points} points!`
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            {heroContent.reviews.title}
          </h2>
          
          {/* Review Badges */}
          {heroContent.reviews.badges && heroContent.reviews.badges.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
              {heroContent.reviews.badges.map((badge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  style={{
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-gray-900">{badge.name}</h3>
                    <span className="text-2xl">{badge.icon}</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-yellow-400 ${
                            i < Math.floor(badge.rating) ? "" : "opacity-30"
                          }`}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                    <span className="font-bold text-gray-900">{badge.rating}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Based on {badge.reviews.toLocaleString()} reviews
                  </p>
                  {badge.description && (
                    <p className="text-xs text-gray-500 mt-2">{badge.description}</p>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* Testimonials */}
          {heroContent.reviews.testimonials && heroContent.reviews.testimonials.length > 0 && (
            <div className="max-w-6xl mx-auto">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
                What Our Users Say
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {heroContent.reviews.testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    style={{
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-yellow-400 ${
                              i < Math.floor(testimonial.rating) ? "" : "opacity-30"
                            }`}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                      <span className="font-bold text-gray-900">{testimonial.rating}</span>
                    </div>
                    <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                    <div className="border-t pt-4">
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      {testimonial.location && (
                        <p className="text-xs text-gray-500 mt-1">{testimonial.location}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Market Trend Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                Market <span className="text-[#00A86B]">Trend</span>
              </h2>
              <p className="text-gray-600">{heroContent.marketTrend.description}</p>
            </div>
            <Link href="/nfts">
              <Button variant="outline">
                View All
                <TrendingUp className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {/* Stats Grid */}
          {heroContent.marketTrend.stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-[#00A86B] to-[#A3FFB0] rounded-2xl p-6 text-white transform-gpu hover:scale-105 transition-transform duration-300"
                style={{
                  boxShadow: "0 15px 40px rgba(0, 168, 107, 0.3), 0 5px 15px rgba(163, 255, 176, 0.2)",
                }}
              >
                <div className="text-3xl font-bold mb-2">{heroContent.marketTrend.stats.totalNFTs}</div>
                <div className="text-sm opacity-90">Total NFTs Minted</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gradient-to-br from-[#0B0F0E] to-[#00A86B] rounded-2xl p-6 text-white transform-gpu hover:scale-105 transition-transform duration-300"
                style={{
                  boxShadow: "0 15px 40px rgba(11, 15, 14, 0.4), 0 5px 15px rgba(0, 168, 107, 0.3)",
                }}
              >
                <div className="text-3xl font-bold mb-2">{heroContent.marketTrend.stats.totalRecycled}</div>
                <div className="text-sm opacity-90">Waste Recycled</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gradient-to-br from-[#00A86B] to-[#A3FFB0] rounded-2xl p-6 text-white transform-gpu hover:scale-105 transition-transform duration-300"
                style={{
                  boxShadow: "0 15px 40px rgba(0, 168, 107, 0.3), 0 5px 15px rgba(163, 255, 176, 0.2)",
                }}
              >
                <div className="text-3xl font-bold mb-2">{heroContent.marketTrend.stats.activeUsers}</div>
                <div className="text-sm opacity-90">Active Users</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-gradient-to-br from-[#0B0F0E] to-[#00A86B] rounded-2xl p-6 text-white transform-gpu hover:scale-105 transition-transform duration-300"
                style={{
                  boxShadow: "0 15px 40px rgba(11, 15, 14, 0.4), 0 5px 15px rgba(0, 168, 107, 0.3)",
                }}
              >
                <div className="text-3xl font-bold mb-2">{heroContent.marketTrend.stats.environmentalImpact}</div>
                <div className="text-sm opacity-90">CO₂ Saved</div>
              </motion.div>
            </div>
          )}
          
          <div className="bg-gradient-to-r from-[#00A86B] to-[#A3FFB0] rounded-2xl p-8 text-center">
            <p className="text-white text-lg font-medium mb-4">
              Explore the latest NFTs minted from recycling activities
            </p>
            <Link href="/nfts">
              <Button variant="dark" size="lg">
                Explore NFT Gallery
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0B0F0E] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              We Are Here to Help
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Support is just a few taps away. You can also get your question answered by using{" "}
              <Link href="/docs#faq" className="text-[#A3FFB0] underline hover:text-[#00A86B]">
                FAQ section
              </Link>
            </p>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="bg-white text-[#0B0F0E] hover:bg-gray-100">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
