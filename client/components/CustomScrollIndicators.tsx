import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, ArrowUp, ArrowDown } from "lucide-react";

interface CustomScrollIndicatorsProps {
  target?: string; // CSS selector for scroll target
  className?: string;
  variant?: "floating" | "sidebar" | "minimal" | "social";
  position?: "right" | "left" | "center";
}

const CustomScrollIndicators: React.FC<CustomScrollIndicatorsProps> = ({
  target = "body",
  className = "",
  variant = "social",
  position = "right",
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element =
        target === "body"
          ? document.documentElement
          : document.querySelector(target);
      if (!element) return;

      const scrollTop = element.scrollTop || window.pageYOffset;
      const scrollHeight =
        element.scrollHeight || document.documentElement.scrollHeight;
      const clientHeight = element.clientHeight || window.innerHeight;

      setScrollPosition(scrollTop);
      setCanScrollUp(scrollTop > 100);
      setCanScrollDown(scrollTop < scrollHeight - clientHeight - 100);
      setIsVisible(scrollHeight > clientHeight + 200);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll);
    };
  }, [target]);

  const scrollToTop = () => {
    const element = target === "body" ? window : document.querySelector(target);
    if (element) {
      element.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const scrollToBottom = () => {
    const element = target === "body" ? window : document.querySelector(target);
    if (element) {
      const scrollHeight = document.documentElement.scrollHeight;
      element.scrollTo({
        top: scrollHeight,
        behavior: "smooth",
      });
    }
  };

  if (!isVisible) return null;

  const positionClasses = {
    right: "right-4",
    left: "left-4",
    center: "left-1/2 transform -translate-x-1/2",
  };

  const variants = {
    floating: {
      container: "fixed bottom-20 z-40 flex flex-col gap-2",
      button:
        "w-12 h-12 rounded-full shadow-lg backdrop-blur-sm bg-card/80 border border-border/50 hover:bg-card hover:scale-110 transition-all duration-200",
      icon: "w-5 h-5",
    },
    sidebar: {
      container:
        "fixed top-1/2 transform -translate-y-1/2 z-40 flex flex-col gap-1",
      button:
        "w-8 h-8 rounded-md bg-card/60 border border-border/30 hover:bg-card hover:border-primary/50 transition-all duration-200",
      icon: "w-4 h-4",
    },
    minimal: {
      container: "fixed bottom-24 z-40 flex flex-col gap-1",
      button:
        "w-10 h-10 rounded-lg bg-background/80 border border-border/20 hover:bg-primary hover:text-primary-foreground transition-all duration-200",
      icon: "w-4 h-4",
    },
    social: {
      container: "fixed bottom-24 z-40 flex flex-col gap-3",
      button:
        "w-14 h-14 rounded-2xl shadow-xl bg-gradient-to-br from-primary/90 to-primary/70 border-2 border-white/20 hover:from-primary hover:to-primary/80 hover:scale-105 transition-all duration-300 backdrop-blur-md",
      icon: "w-6 h-6 text-primary-foreground",
    },
  };

  const currentVariant = variants[variant];

  return (
    <div
      className={`${currentVariant.container} ${positionClasses[position]} ${className}`}
    >
      {/* Scroll Up Button */}
      {canScrollUp && (
        <Button
          onClick={scrollToTop}
          className={`${currentVariant.button} group relative overflow-hidden`}
          variant="ghost"
          size="icon"
          title="Scroll to top"
        >
          {variant === "social" ? (
            <div className="relative z-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <ArrowUp className={`${currentVariant.icon} drop-shadow-sm`} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full opacity-60 animate-pulse" />
            </div>
          ) : (
            <ChevronUp className={currentVariant.icon} />
          )}

          {variant === "floating" && (
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          )}
        </Button>
      )}

      {/* Scroll Progress Indicator for Social Variant */}
      {variant === "social" && (
        <div className="w-14 h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-300"
            style={{
              width: `${Math.min(100, (scrollPosition / (document.documentElement.scrollHeight - window.innerHeight)) * 100)}%`,
            }}
          />
        </div>
      )}

      {/* Scroll Down Button */}
      {canScrollDown && (
        <Button
          onClick={scrollToBottom}
          className={`${currentVariant.button} group relative overflow-hidden`}
          variant="ghost"
          size="icon"
          title="Scroll to bottom"
        >
          {variant === "social" ? (
            <div className="relative z-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <ArrowDown className={`${currentVariant.icon} drop-shadow-sm`} />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-400 rounded-full opacity-60 animate-pulse" />
            </div>
          ) : (
            <ChevronDown className={currentVariant.icon} />
          )}

          {variant === "floating" && (
            <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          )}
        </Button>
      )}

      {/* Additional Design Elements for Social Variant */}
      {variant === "social" && (
        <div className="absolute -inset-2 bg-gradient-to-br from-primary/10 via-transparent to-purple/10 rounded-3xl blur-xl opacity-50" />
      )}
    </div>
  );
};

export default CustomScrollIndicators;
