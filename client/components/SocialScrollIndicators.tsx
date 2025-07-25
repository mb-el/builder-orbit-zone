import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Zap,
} from "lucide-react";

interface SocialScrollIndicatorsProps {
  className?: string;
  theme?: "gradient" | "neon" | "glassmorphism" | "minimal";
}

const SocialScrollIndicators: React.FC<SocialScrollIndicatorsProps> = ({
  className = "",
  theme = "gradient",
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeButton, setActiveButton] = useState<"up" | "down" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const maxScroll = scrollHeight - clientHeight;

      setScrollPosition(scrollTop);
      setScrollProgress((scrollTop / maxScroll) * 100);
      setCanScrollUp(scrollTop > 200);
      setCanScrollDown(scrollTop < maxScroll - 200);
      setIsVisible(maxScroll > 500);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    setActiveButton("up");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setActiveButton(null), 1000);
  };

  const scrollToBottom = () => {
    setActiveButton("down");
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
    setTimeout(() => setActiveButton(null), 1000);
  };

  if (!isVisible) return null;

  const themes = {
    gradient: {
      container:
        "bg-gradient-to-b from-pink-500/20 via-purple-500/20 to-blue-500/20",
      upButton:
        "bg-gradient-to-br from-pink-500 to-red-500 hover:from-pink-400 hover:to-red-400",
      downButton:
        "bg-gradient-to-br from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400",
      progress: "bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400",
    },
    neon: {
      container: "bg-black/40 border border-cyan-400/30",
      upButton:
        "bg-cyan-500/20 border border-cyan-400 text-cyan-400 hover:bg-cyan-500/30 hover:shadow-cyan-400/50",
      downButton:
        "bg-purple-500/20 border border-purple-400 text-purple-400 hover:bg-purple-500/30 hover:shadow-purple-400/50",
      progress: "bg-gradient-to-r from-cyan-400 to-purple-400",
    },
    glassmorphism: {
      container: "bg-white/10 backdrop-blur-md border border-white/20",
      upButton:
        "bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30",
      downButton:
        "bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30",
      progress: "bg-white/60",
    },
    minimal: {
      container: "bg-card/95 border border-border",
      upButton: "bg-primary text-primary-foreground hover:bg-primary/90",
      downButton:
        "bg-secondary text-secondary-foreground hover:bg-secondary/90",
      progress: "bg-primary",
    },
  };

  const currentTheme = themes[theme];

  return (
    <div
      ref={containerRef}
      className={`
        fixed right-6 top-1/2 transform -translate-y-1/2 z-50 
        flex flex-col items-center gap-4 p-4 rounded-2xl
        ${currentTheme.container}
        shadow-2xl backdrop-blur-sm
        transition-all duration-300 hover:scale-105
        ${className}
      `}
    >
      {/* Floating Social Icons Background */}
      <div className="absolute -inset-8 pointer-events-none">
        <Heart className="absolute -top-2 -left-2 w-4 h-4 text-pink-400/30 animate-pulse" />
        <MessageCircle className="absolute -bottom-2 -right-2 w-4 h-4 text-blue-400/30 animate-pulse delay-1000" />
        <Share className="absolute top-1/2 -left-3 w-3 h-3 text-green-400/30 animate-ping delay-500" />
        <Bookmark className="absolute top-1/3 -right-3 w-3 h-3 text-yellow-400/30 animate-bounce delay-700" />
      </div>

      {/* Scroll Up Button */}
      {canScrollUp && (
        <Button
          onClick={scrollToTop}
          className={`
            relative w-12 h-12 rounded-xl p-0 overflow-hidden
            ${currentTheme.upButton}
            ${activeButton === "up" ? "animate-pulse scale-110" : ""}
            transition-all duration-300 group
            ${theme === "neon" ? "shadow-lg" : ""}
          `}
          variant="ghost"
          title="Scroll to top"
        >
          <div className="relative z-10 flex items-center justify-center">
            {theme === "gradient" && (
              <TrendingUp className="w-6 h-6 text-white drop-shadow-sm" />
            )}
            {theme === "neon" && <ArrowUp className="w-5 h-5 animate-pulse" />}
            {theme === "glassmorphism" && <Sparkles className="w-5 h-5" />}
            {theme === "minimal" && <ArrowUp className="w-5 h-5" />}
          </div>

          {/* Animated Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {theme === "gradient" && (
            <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping" />
          )}

          {theme === "neon" && (
            <div className="absolute inset-0 bg-cyan-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
          )}
        </Button>
      )}

      {/* Scroll Progress Indicator */}
      <div className="relative w-2 h-24 bg-white/20 rounded-full overflow-hidden">
        <div
          className={`
            w-full ${currentTheme.progress} rounded-full transition-all duration-300
            ${theme === "neon" ? "shadow-lg animate-pulse" : ""}
          `}
          style={{
            height: `${Math.min(100, scrollProgress)}%`,
            transform: "translateY(0)",
          }}
        />

        {/* Progress Indicator Dot */}
        <div
          className="absolute left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-lg transition-all duration-300"
          style={{
            top: `${Math.min(88, scrollProgress)}%`,
          }}
        >
          {theme === "gradient" && (
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full animate-spin" />
          )}
        </div>
      </div>

      {/* Scroll Down Button */}
      {canScrollDown && (
        <Button
          onClick={scrollToBottom}
          className={`
            relative w-12 h-12 rounded-xl p-0 overflow-hidden
            ${currentTheme.downButton}
            ${activeButton === "down" ? "animate-pulse scale-110" : ""}
            transition-all duration-300 group
            ${theme === "neon" ? "shadow-lg" : ""}
          `}
          variant="ghost"
          title="Scroll to bottom"
        >
          <div className="relative z-10 flex items-center justify-center">
            {theme === "gradient" && (
              <TrendingDown className="w-6 h-6 text-white drop-shadow-sm" />
            )}
            {theme === "neon" && (
              <ArrowDown className="w-5 h-5 animate-pulse" />
            )}
            {theme === "glassmorphism" && <Zap className="w-5 h-5" />}
            {theme === "minimal" && <ArrowDown className="w-5 h-5" />}
          </div>

          {/* Animated Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {theme === "gradient" && (
            <div className="absolute bottom-1 left-1 w-2 h-2 bg-green-300 rounded-full animate-ping delay-200" />
          )}

          {theme === "neon" && (
            <div className="absolute inset-0 bg-purple-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
          )}
        </Button>
      )}

      {/* Ambient Glow Effect */}
      {theme === "gradient" && (
        <div className="absolute -inset-4 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10 rounded-3xl blur-xl opacity-50 animate-pulse" />
      )}

      {theme === "neon" && (
        <div className="absolute -inset-2 bg-cyan-400/5 rounded-2xl blur-md animate-pulse" />
      )}
    </div>
  );
};

export default SocialScrollIndicators;
