"use client";

import Link from "next/link";
import { ArrowLeft, Lightbulb, Rocket, Gift, ShoppingCart, Gamepad2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function InspirationPage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/docs"
          className="inline-flex items-center text-[#00A86B] hover:text-[#008a5a] transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Documentation
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-[#00A86B]/10 rounded-xl">
              <Lightbulb className="h-6 w-6 text-[#00A86B]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              The Inspiration Behind CleanNFT
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            A journey from deposit return systems to blockchain-based rewards
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none">
          {/* Inspiration Story Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-100 mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Sparkles className="h-6 w-6 text-[#00A86B] mr-3" />
              The Beginning
            </h2>
            
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg">
                It all started when I was working with <strong>SuperValue</strong>, a company that operates 
                <strong> DRS (Deposit Return System) machines</strong>. These machines are designed to accept 
                bottles and containers, collect a deposit from customers, and return that same amount when 
                items are recycled.
              </p>

              <p className="text-lg">
                While working with these DRS machines, I began to think deeply about the recycling ecosystem, 
                particularly in <strong>third-world countries</strong>. I realized that in many developing 
                nations, plastic generation and creation is extremely cheap, making traditional deposit-return 
                systems economically unfeasible.
              </p>

              <div className="bg-[#00A86B]/5 rounded-xl p-6 border-l-4 border-[#00A86B] my-8">
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  The Challenge
                </p>
                <p className="text-gray-700">
                  In third-world countries, the cost of collecting a deposit from customers and then returning 
                  that same amount creates a financial barrier. The system simply doesn't work when the economic 
                  value of plastic is minimal. We needed a different approach.
                </p>
              </div>

              <p className="text-lg">
                This led me to a revolutionary idea: <strong>Why not create a rewarding system instead?</strong> 
                Instead of taking deposits and returning the same amount, what if we could give users something 
                of value that they could actually benefit from?
              </p>

              <p className="text-lg">
                That's when the concept of <strong>CleanNFT</strong> was born. I realized that we could give 
                customers <strong>NFTs (Non-Fungible Tokens)</strong> as rewards for their recycling efforts. 
                These NFTs would be:
              </p>

              <ul className="list-disc list-inside space-y-3 text-lg text-gray-700 ml-4">
                <li><strong>Tradable:</strong> Users can trade their NFTs with others, creating real value</li>
                <li><strong>Badge System:</strong> Special badges that users can earn and proudly display</li>
                <li><strong>Social Sharing:</strong> Badges can be shared on social media, allowing users to 
                showcase their environmental achievements</li>
                <li><strong>Permanent Records:</strong> Each NFT represents a verifiable recycling action on the 
                blockchain</li>
              </ul>

              <p className="text-lg mt-8">
                The beauty of this system is that it works anywhere in the world, regardless of economic conditions. 
                Instead of requiring deposits that might not be feasible in developing countries, we're creating 
                genuine value through blockchain technology.
              </p>
            </div>
          </motion.section>

          {/* Future Scope Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-br from-[#00A86B] to-[#A3FFB0] rounded-2xl p-8 md:p-12 text-white mb-8"
          >
            <div className="flex items-center mb-6">
              <div className="p-3 bg-white/20 rounded-xl mr-4">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold">Future Scope & Vision</h2>
            </div>

            <div className="space-y-6 text-white/95 leading-relaxed">
              <p className="text-lg font-semibold">
                As CleanNFT grows, we envision a future where companies from all industries can contribute to 
                the recycling ecosystem. Here's what we're building toward:
              </p>

              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-4 flex items-center">
                  <Gift className="h-5 w-5 mr-2" />
                  Corporate Partnerships & Rewards
                </h3>
                
                <p className="text-lg mb-4">
                  When companies join the CleanNFT ecosystem, they can offer a wide variety of rewards to users 
                  who recycle. Instead of just NFTs, users could receive:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-lg p-4 flex items-start space-x-3">
                    <ShoppingCart className="h-5 w-5 text-white mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Shopping Rewards</h4>
                      <p className="text-sm text-white/90">
                        Amazon vouchers, gift cards, shopping cards, and retail discounts
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4 flex items-start space-x-3">
                    <Gamepad2 className="h-5 w-5 text-white mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Entertainment Rewards</h4>
                      <p className="text-sm text-white/90">
                        Gaming discounts, subscription services, and digital content
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4 flex items-start space-x-3">
                    <Gift className="h-5 w-5 text-white mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Flexible Rewards</h4>
                      <p className="text-sm text-white/90">
                        Users can choose from a variety of reward options based on their preferences
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4 flex items-start space-x-3">
                    <Sparkles className="h-5 w-5 text-white mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Custom Rewards</h4>
                      <p className="text-sm text-white/90">
                        Companies can offer unique rewards that align with their brand and values
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm mt-6">
                <h3 className="text-2xl font-bold mb-4">The Vision</h3>
                <p className="text-lg">
                  Our vision is to create a comprehensive rewards ecosystem where recycling becomes not just 
                  an environmental responsibility, but a rewarding experience. Whether users want NFTs, gift 
                  cards, discounts, or any other form of reward, CleanNFT will provide the platform for companies 
                  to contribute and users to benefit.
                </p>
                
                <p className="text-lg mt-4">
                  Instead of limiting rewards to NFTs, we're building a flexible system where <strong>users can 
                  choose what they want</strong> - whether it's digital assets, vouchers, discounts, or anything 
                  else our partner companies offer.
                </p>
              </div>

              <div className="bg-white/20 rounded-xl p-6 mt-6">
                <p className="text-lg font-semibold mb-2">
                  🎯 The Goal
                </p>
                <p className="text-lg">
                  To make recycling so rewarding that it becomes a natural part of everyone's daily routine, 
                  regardless of where they live or their economic situation. By partnering with companies 
                  worldwide, we can offer meaningful incentives that make environmental responsibility 
                  accessible and attractive to everyone.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gray-50 rounded-2xl p-8 text-center"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Join Us on This Journey
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              Whether you're a company looking to contribute to the ecosystem or an individual wanting 
              to make a difference, CleanNFT is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#00A86B] text-white rounded-lg font-semibold hover:bg-[#008a5a] transition-colors"
              >
                Get in Touch
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#00A86B] border-2 border-[#00A86B] rounded-lg font-semibold hover:bg-[#00A86B]/10 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

