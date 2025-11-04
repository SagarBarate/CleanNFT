import { Leaf, Shield, Users, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            About <span className="text-[#00A86B]">CleanNFT</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're building the rails to make crypto usable in everyday life. No token. No hype. Fully bootstrapped. Fully sustainable.
          </p>
        </div>

        {/* Mission */}
        <section className="mb-20">
          <div className="bg-gradient-to-br from-[#00A86B] to-[#A3FFB0] rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg leading-relaxed max-w-3xl">
              CleanNFT bridges sustainability and blockchain — rewarding every act of recycling with verifiable, tradable NFTs. 
              We believe that environmental impact should be measurable, transparent, and valuable. By combining recycling 
              with blockchain technology, we create a new paradigm where waste becomes digital value.
            </p>
          </div>
        </section>

        {/* Why Blockchain */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Why Blockchain for Recycling?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <Shield className="h-12 w-12 text-[#00A86B] mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Transparency</h3>
              <p className="text-gray-600 leading-relaxed">
                Every recycling action is recorded on-chain, creating an immutable record of environmental impact. 
                No claims, no doubts — just verifiable proof of your contribution to sustainability.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <Target className="h-12 w-12 text-[#00A86B] mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Gamification</h3>
              <p className="text-gray-600 leading-relaxed">
                Turn recycling into a rewarding experience. Collect NFTs, earn badges, and compete with others 
                while making a real difference for the planet.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <Users className="h-12 w-12 text-[#00A86B] mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Community</h3>
              <p className="text-gray-600 leading-relaxed">
                Build a global network of recyclers. Share achievements, trade NFTs, and inspire others 
                to join the clean revolution.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <Leaf className="h-12 w-12 text-[#00A86B] mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Impact</h3>
              <p className="text-gray-600 leading-relaxed">
                Every NFT represents real environmental impact. Track your contribution, measure your footprint, 
                and see the collective difference we're making together.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="bg-[#0B0F0E] rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Join the Clean Revolution</h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Start recycling today and turn your waste into digital value. Every action counts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/nfts">
                <Button size="lg" className="bg-gradient-to-r from-[#00A86B] to-[#A3FFB0] text-white">
                  Explore NFTs
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#0B0F0E]">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

