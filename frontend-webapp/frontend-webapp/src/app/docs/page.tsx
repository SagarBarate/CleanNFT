import { BookOpen, Zap, Shield, Code, HelpCircle, Lightbulb } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  const sections = [
    {
      icon: Lightbulb,
      title: "Inspiration",
      description: "Discover the story behind CleanNFT - from DRS machines to blockchain rewards.",
      href: "/docs/inspiration",
    },
    {
      icon: BookOpen,
      title: "Basics",
      description: "Get started with CleanNFT. Learn how to recycle, mint NFTs, and claim rewards.",
      href: "/docs/basics",
    },
    {
      icon: Zap,
      title: "Advanced",
      description: "Deep dive into smart contracts, blockchain integration, and advanced features.",
      href: "/docs/advanced",
    },
    {
      icon: Shield,
      title: "Security",
      description: "Understand our security measures, smart contract audits, and best practices.",
      href: "/docs/security",
    },
    {
      icon: Code,
      title: "API Reference",
      description: "Developer documentation for integrating with CleanNFT APIs and webhooks.",
      href: "/docs/api",
    },
    {
      icon: HelpCircle,
      title: "FAQ",
      description: "Common questions and answers about CleanNFT, recycling, and NFTs.",
      href: "/docs#faq",
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Documentation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about CleanNFT, from basics to advanced integration.
          </p>
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {sections.map((section, index) => (
            <Link
              key={index}
              href={section.href}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:border-[#00A86B]/30 group"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-[#00A86B]/10 rounded-xl group-hover:bg-[#00A86B]/20 transition-colors">
                  <section.icon className="h-6 w-6 text-[#00A86B]" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">{section.description}</p>
            </Link>
          ))}
        </div>

        {/* Project Overview */}
        <section className="bg-gray-50 rounded-2xl p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Project Overview</h2>
          <div className="prose max-w-none text-gray-600">
            <p className="text-lg leading-relaxed mb-4">
              CleanNFT is a comprehensive blockchain-based NFT project that incentivizes recycling through gamification, 
              badges, and NFT rewards on the Polygon blockchain. The system consists of multiple layers:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-6">
              <li><strong>Frontend Layer:</strong> Users Portal, Admin Portal, and Mobile App</li>
              <li><strong>Backend Layer:</strong> Node.js API, IoT Simulation, and AWS Lambda</li>
              <li><strong>Blockchain Layer:</strong> Smart Contracts (RecyclingNFT, RecyclingBadge), IPFS Storage, and Polygon Network</li>
            </ul>
            <p className="text-lg leading-relaxed">
              Each recycling action creates a verifiable NFT on-chain, representing real environmental impact. 
              Users can claim, trade, and display these NFTs while contributing to a sustainable future.
            </p>
          </div>
        </section>

        {/* Ecosystem */}
        <section className="bg-gradient-to-br from-[#00A86B] to-[#A3FFB0] rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-6">Ecosystem</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-3">Recycling Flow</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>User scans QR code at recycling bin</li>
                <li>IoT sensors send data to backend</li>
                <li>Backend processes recycling activity</li>
                <li>Smart contract mints NFT reward</li>
                <li>User claims NFT via PWA</li>
                <li>NFT appears in user's wallet</li>
              </ol>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Features</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Multi-Coin Support (BTC, ETH, USDT, USDC, TRX)</li>
                <li>Secure Cold Storage (100% offline)</li>
                <li>Blockchain Transparency</li>
                <li>Gamified Rewards System</li>
                <li>Real-World Environmental Impact</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="mt-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                What is CleanNFT?
              </h3>
              <p className="text-gray-600">
                CleanNFT is a blockchain-powered recycling rewards platform that turns waste into digital value. 
                Every recycling action creates a verifiable NFT on the blockchain.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                How do I get started?
              </h3>
              <p className="text-gray-600">
                Simply start recycling at any participating recycling station. Scan the QR code, and your NFT 
                will be minted automatically. Claim it through the PWA or mobile app.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Which blockchain does CleanNFT use?
              </h3>
              <p className="text-gray-600">
                CleanNFT runs on the Polygon network, providing fast transactions and low gas fees. 
                NFTs are ERC-721 standard compliant.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Are my NFTs secure?
              </h3>
              <p className="text-gray-600">
                Yes. All smart contracts are audited by OpenZeppelin, and 100% of user funds are stored 
                in cold storage. Your NFTs are yours forever.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

