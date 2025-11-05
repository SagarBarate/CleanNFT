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
  const [isVisible, setIsVisible] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show shadow when scrolled
      setIsScrolled(currentScrollY > 20);
      
      // Elegant hide/show behavior
      if (currentScrollY <= 100) {
        // Always show at top
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide header elegantly
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show header elegantly
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { label: "Company", href: "/about", hasDropdown: true },
    { label: "Blog", href: "/docs", hasDropdown: true },
  ];

  // Portal links - these should point to the actual admin and customer portals
  const portalLinks = {
    admin: process.env.NEXT_PUBLIC_ADMIN_PORTAL_URL || "https://adminportal-cleannft.netlify.app/",
    users: process.env.NEXT_PUBLIC_USERS_PORTAL_URL || "https://userportal-cleannft.netlify.app/",
  };

  // MetaMask-style header: clean white background with gap from top
  const headerBg = "bg-white";
  const textColor = "text-[#171717]";
  const textColorHover = "hover:text-[#171717]/80";
  const borderColor = "border-gray-200";

  return (
    <header
      className={cn(
        "fixed left-0 right-0 z-50 transition-all duration-500 ease-in-out",
        isVisible 
          ? "top-4 translate-y-0 opacity-100" 
          : "-top-full translate-y-[-100%] opacity-0 pointer-events-none"
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div 
          className={cn(
            "flex h-16 items-center justify-between bg-white rounded-lg px-6 transition-all duration-300",
            isScrolled && "shadow-lg border border-gray-100"
          )}
          style={{
            boxShadow: isScrolled 
              ? "0 8px 30px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)" 
              : "0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)",
          }}
        >
          {/* Logo - MetaMask style (stacked) with green NFT */}
          <Link href="/" className="flex items-center">
            <span className={cn("text-xl font-bold tracking-tight flex flex-col leading-tight")}>
              <span className="text-2xl text-[#171717]">Clean</span>
              <span className="text-2xl text-[#00A86B]">NFT</span>
            </span>
          </Link>

          {/* Desktop Navigation - MetaMask style center positioning */}
          <div className="hidden md:flex items-center space-x-6 flex-1 justify-center">
            {navItems.map((item) => (
              <div key={item.href} className="relative group">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-1 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "text-[#171717]"
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
                  ? "text-[#171717]"
                  : cn(textColor, textColorHover)
              )}
            >
              Gallery
            </Link>

            {/* Portal Links */}
            <a
              href={portalLinks.users}
              target="_blank"
              rel="noopener noreferrer"
              className={cn("text-sm font-medium transition-colors", textColor, textColorHover)}
            >
              Users Portal
            </a>
            <a
              href={portalLinks.admin}
              target="_blank"
              rel="noopener noreferrer"
              className={cn("text-sm font-medium transition-colors", textColor, textColorHover)}
            >
              Admin Portal
            </a>
          </div>

          {/* CTA Button - MetaMask style black button on right */}
          <div className="hidden md:flex items-center">
            <Link href="/nfts">
              <Button 
                size="sm" 
                className="bg-[#171717] text-white hover:bg-[#171717]/90 rounded-md px-4 py-2 text-sm font-medium"
              >
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
              href={portalLinks.users}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn("block text-sm font-medium transition-colors", textColor, textColorHover)}
            >
              Users Portal
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
              <Link href="/nfts" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  size="sm"
                  className="w-full bg-[#171717] text-white hover:bg-[#171717]/90"
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

