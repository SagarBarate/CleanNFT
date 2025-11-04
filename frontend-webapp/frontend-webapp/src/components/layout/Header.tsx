"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const navItems = [
    { label: "Products", href: "/products", hasDropdown: true },
    { label: "Company", href: "/about", hasDropdown: true },
    { label: "Blog", href: "/docs", hasDropdown: true },
  ];

  // Portal links - these should point to the actual admin and customer portals
  const portalLinks = {
    admin: process.env.NEXT_PUBLIC_ADMIN_PORTAL_URL || "http://localhost:3000",
    recycling: process.env.NEXT_PUBLIC_RECYCLING_PWA_URL || "http://localhost:5173",
  };

  // Theme-aware colors
  const headerBg = isScrolled
    ? isDarkMode
      ? "bg-[#0B0F0E]/95 backdrop-blur-md shadow-lg"
      : "bg-white/95 backdrop-blur-md shadow-lg"
    : isDarkMode
      ? "bg-transparent"
      : "bg-white/80 backdrop-blur-sm";

  const textColor = isDarkMode ? "text-white" : "text-[#171717]";
  const textColorHover = isDarkMode ? "hover:text-[#A3FFB0]" : "hover:text-[#00A86B]";
  const borderColor = isDarkMode ? "border-white/10" : "border-gray-200";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        headerBg
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className={cn("text-2xl font-bold", textColor)}>
              Clean<span className="text-[#00A86B]">NFT</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.href} className="relative group">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-1 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "text-[#00A86B]"
                      : cn(textColor, textColorHover)
                  )}
                >
                  <span>{item.label}</span>
                  {item.hasDropdown && (
                    <ChevronDown className="h-4 w-4 opacity-70" />
                  )}
                </Link>
              </div>
            ))}

            <Link
              href="/nfts"
              className={cn(
                "text-sm font-medium transition-colors",
                pathname === "/nfts"
                  ? "text-[#00A86B]"
                  : cn(textColor, textColorHover)
              )}
            >
              Gallery
            </Link>

            {/* Portal Links */}
            <a
              href={portalLinks.recycling}
              target="_blank"
              rel="noopener noreferrer"
              className={cn("text-sm font-medium transition-colors", textColor, textColorHover)}
            >
              Recycling PWA
            </a>
            <a
              href={portalLinks.admin}
              target="_blank"
              rel="noopener noreferrer"
              className={cn("text-sm font-medium transition-colors", textColor, textColorHover)}
            >
              Admin Portal
            </a>

            <Link href="/contact">
              <Button 
                variant="outline" 
                size="sm" 
                className={cn(
                  isDarkMode
                    ? "text-white border-white/20 hover:bg-white hover:text-[#0B0F0E]"
                    : "text-[#171717] border-gray-300 hover:bg-[#171717] hover:text-white"
                )}
              >
                Contact
              </Button>
            </Link>

            <Link href="/nfts">
              <Button size="sm" className="bg-gradient-to-r from-[#00A86B] to-[#A3FFB0] text-white">
                Explore NFTs
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn("md:hidden p-2", textColor)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={cn("md:hidden py-4 space-y-4 border-t", borderColor)}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "block text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "text-[#00A86B]"
                    : cn(textColor, textColorHover)
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/nfts"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "block text-sm font-medium transition-colors",
                pathname === "/nfts"
                  ? "text-[#00A86B]"
                  : cn(textColor, textColorHover)
              )}
            >
              Gallery
            </Link>
            <a
              href={portalLinks.recycling}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn("block text-sm font-medium transition-colors", textColor, textColorHover)}
            >
              Recycling PWA
            </a>
            <a
              href={portalLinks.admin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn("block text-sm font-medium transition-colors", textColor, textColorHover)}
            >
              Admin Portal
            </a>
            <div className="pt-4 space-y-2">
              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "w-full",
                    isDarkMode
                      ? "text-white border-white/20 hover:bg-white hover:text-[#0B0F0E]"
                      : "text-[#171717] border-gray-300 hover:bg-[#171717] hover:text-white"
                  )}
                >
                  Contact
                </Button>
              </Link>
              <Link href="/nfts" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-[#00A86B] to-[#A3FFB0] text-white"
                >
                  Explore NFTs
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

