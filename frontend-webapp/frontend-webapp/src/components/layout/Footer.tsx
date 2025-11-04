"use client";

import * as React from "react";
import Link from "next/link";
import { Twitter, Send } from "lucide-react";

export function Footer() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    // Check for dark mode preference
    const checkDarkMode = () => {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(isDark);
    };
    
    checkDarkMode();
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", checkDarkMode);
    
    return () => mediaQuery.removeEventListener("change", checkDarkMode);
  }, []);
  const footerLinks = {
    products: [
      { label: "Exchange", href: "/products/exchange" },
      { label: "Wallet", href: "/products/wallet" },
      { label: "Transfers", href: "/products/transfers" },
      { label: "Cards", href: "/products/cards" },
    ],
    company: [
      { label: "About", href: "/about" },
      { label: "Roadmap", href: "/about/roadmap" },
      { label: "Security", href: "/about/security" },
      { label: "Community", href: "/about/community" },
      { label: "Careers", href: "/about/careers" },
    ],
    blog: [
      { label: "Basics", href: "/docs/basics" },
      { label: "Advanced", href: "/docs/advanced" },
      { label: "Research", href: "/docs/research" },
    ],
    resources: [
      { label: "Prices", href: "/nfts" },
      { label: "Site Widgets", href: "/docs/widgets" },
      { label: "FAQ", href: "/docs#faq" },
      { label: "Contact Us", href: "/contact" },
    ],
  };

  // Theme-aware colors
  const footerBg = isDarkMode ? "bg-[#0B0F0E]" : "bg-gray-50";
  const textColor = isDarkMode ? "text-white" : "text-[#171717]";
  const textGray = isDarkMode ? "text-gray-400" : "text-gray-600";
  const borderColor = isDarkMode ? "border-white/10" : "border-gray-300";

  return (
    <footer className={footerBg + " " + textColor}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4">
              Clean<span className="text-[#00A86B]">NFT</span>
            </h3>
            <p className={textGray + " text-sm mb-4"}>
              Turning waste into digital impact. Blockchain-powered recycling rewards.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/cleannft"
                target="_blank"
                rel="noopener noreferrer"
                className={textGray + " hover:text-[#00A86B] transition-colors"}
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://t.me/cleannft"
                target="_blank"
                rel="noopener noreferrer"
                className={textGray + " hover:text-[#00A86B] transition-colors"}
                aria-label="Telegram"
              >
                <Send className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-[#00A86B] font-semibold mb-4">Products</h4>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={textGray + " hover:text-[#00A86B] text-sm transition-colors"}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[#00A86B] font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={textGray + " hover:text-[#00A86B] text-sm transition-colors"}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Blog */}
          <div>
            <h4 className="text-[#00A86B] font-semibold mb-4">Blog</h4>
            <ul className="space-y-2">
              {footerLinks.blog.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={textGray + " hover:text-[#00A86B] text-sm transition-colors"}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[#00A86B] font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={textGray + " hover:text-[#00A86B] text-sm transition-colors"}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={"mt-12 pt-8 border-t " + borderColor}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className={"text-sm " + textGray}>
              <p className="mb-2">
                CleanNFT is a blockchain-powered recycling rewards platform.
              </p>
              <p>
                Regulated and licensed for virtual currency activities.
              </p>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link
                href="/terms"
                className="text-[#00A86B] hover:text-[#A3FFB0] transition-colors"
              >
                Terms & Conditions
              </Link>
              <span className={textGray}>|</span>
              <Link
                href="/privacy"
                className="text-[#00A86B] hover:text-[#A3FFB0] transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
          <div className={"mt-6 text-center text-sm " + textGray}>
            <p>© Copyright 2020 - 2025 CleanNFT - All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

