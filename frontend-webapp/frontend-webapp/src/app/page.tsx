"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, TrendingUp } from "lucide-react";
import landingContent from "@/content/landing.json";
import { useState, useEffect } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-[#00A86B]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#00A86B] rounded-full animate-spin"></div>
          </div>
          <p className="text-[#171717] text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }
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

            {/* Right Column - Visual with 3D Rotating Cards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full h-[600px] perspective-1000">
                {/* Floating Cards with 3D Rotation */}
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    rotateY: [0, 15, 0],
                    rotateX: [0, 5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                  className="absolute top-20 left-0 bg-gradient-to-br from-[#00A86B] to-[#A3FFB0] rounded-2xl p-6 shadow-2xl shadow-[#00A86B]/30 w-64 transform-gpu preserve-3d"
                  style={{
                    boxShadow: "0 20px 60px rgba(0, 168, 107, 0.3), 0 0 40px rgba(0, 168, 107, 0.1)",
                  }}
                >
                  <div className="text-white transform-gpu">
                    <div className="text-4xl mb-2">♻️</div>
                    <h3 className="font-bold text-xl mb-2">Recycle NFT</h3>
                    <p className="text-sm opacity-90">Token #1001</p>
                  </div>
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, 20, 0],
                    rotateY: [0, -15, 0],
                    rotateX: [0, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: 0.5,
                  }}
                  className="absolute top-60 right-0 bg-white rounded-2xl p-6 border-2 border-[#00A86B]/20 w-64 transform-gpu preserve-3d"
                  style={{
                    boxShadow: "0 25px 70px rgba(0, 0, 0, 0.15), 0 10px 30px rgba(0, 168, 107, 0.1)",
                  }}
                >
                  <div className="text-gray-900 transform-gpu">
                    <div className="text-4xl mb-2">🌱</div>
                    <h3 className="font-bold text-xl mb-2">Eco Impact</h3>
                    <p className="text-sm text-gray-600">500g Recycled</p>
                  </div>
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, -15, 0],
                    rotateY: [0, 10, 0],
                    rotateX: [0, 8, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: 1,
                  }}
                  className="absolute bottom-20 left-10 bg-gradient-to-br from-[#0B0F0E] to-[#00A86B] rounded-2xl p-6 w-64 transform-gpu preserve-3d"
                  style={{
                    boxShadow: "0 20px 60px rgba(11, 15, 14, 0.4), 0 0 40px rgba(0, 168, 107, 0.2)",
                  }}
                >
                  <div className="text-white transform-gpu">
                    <div className="text-4xl mb-2">🏆</div>
                    <h3 className="font-bold text-xl mb-2">Reward Badge</h3>
                    <p className="text-sm opacity-90">Claim Your NFT</p>
                  </div>
                </motion.div>
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
