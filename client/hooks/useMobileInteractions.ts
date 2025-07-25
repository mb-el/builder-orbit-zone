import { useEffect, useRef, useCallback } from "react";

interface UseMobileInteractionsOptions {
  onLongPress?: () => void;
  onDoubleTab?: () => void;
  longPressDelay?: number;
}

export const useMobileInteractions = ({
  onLongPress,
  onDoubleTab,
  longPressDelay = 500,
}: UseMobileInteractionsOptions = {}) => {
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const lastTap = useRef<number>(0);
  const pressStarted = useRef<boolean>(false);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      pressStarted.current = true;
      if (onLongPress) {
        pressTimer.current = setTimeout(() => {
          if (pressStarted.current) {
            onLongPress();
            // Haptic feedback for long press
            if ("vibrate" in navigator) {
              navigator.vibrate(100);
            }
          }
        }, longPressDelay);
      }
    },
    [onLongPress, longPressDelay],
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      pressStarted.current = false;
      if (pressTimer.current) {
        clearTimeout(pressTimer.current);
        pressTimer.current = null;
      }

      // Handle double tap
      if (onDoubleTab) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap.current;
        if (tapLength < 500 && tapLength > 0) {
          onDoubleTab();
          // Haptic feedback for double tap
          if ("vibrate" in navigator) {
            navigator.vibrate([50, 50, 50]);
          }
        }
        lastTap.current = currentTime;
      }
    },
    [onDoubleTab],
  );

  const handleTouchMove = useCallback(() => {
    pressStarted.current = false;
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (pressTimer.current) {
        clearTimeout(pressTimer.current);
      }
    };
  }, []);

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchMove: handleTouchMove,
  };
};

// Custom hook for keyboard handling on mobile
export const useMobileKeyboard = () => {
  const isKeyboardOpen = useRef<boolean>(false);
  const initialViewportHeight = useRef<number>(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const heightDifference = initialViewportHeight.current - currentHeight;

      // If viewport height decreased by more than 150px, keyboard is likely open
      const keyboardThreshold = 150;
      isKeyboardOpen.current = heightDifference > keyboardThreshold;

      // Dispatch custom event for keyboard state
      window.dispatchEvent(
        new CustomEvent("keyboardToggle", {
          detail: {
            isOpen: isKeyboardOpen.current,
            height: heightDifference,
          },
        }),
      );
    };

    // Set initial height
    initialViewportHeight.current = window.innerHeight;

    window.addEventListener("resize", handleResize);

    // Listen for orientation changes
    window.addEventListener("orientationchange", () => {
      setTimeout(() => {
        initialViewportHeight.current = window.innerHeight;
      }, 500);
    });

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return {
    isKeyboardOpen: isKeyboardOpen.current,
  };
};

// Enhanced clipboard functionality for mobile
export const useMobileClipboard = () => {
  const copyToClipboard = useCallback(
    async (text: string): Promise<boolean> => {
      try {
        // Modern Clipboard API (preferred)
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
          return true;
        }

        // Fallback for older mobile browsers
        const textArea = document.createElement("textarea");
        textArea.value = text;

        // Make textarea invisible and position off-screen
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        textArea.style.opacity = "0";
        textArea.style.pointerEvents = "none";
        textArea.setAttribute("readonly", "");

        document.body.appendChild(textArea);

        // For mobile devices, we need to focus and select
        textArea.focus();
        textArea.setSelectionRange(0, text.length);

        // For iOS, we need to handle the selection differently
        if (navigator.userAgent.match(/ipad|iphone/i)) {
          const range = document.createRange();
          range.selectNodeContents(textArea);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
          textArea.setSelectionRange(0, 999999);
        } else {
          textArea.select();
        }

        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);

        return successful;
      } catch (err) {
        console.error("Failed to copy text:", err);
        return false;
      }
    },
    [],
  );

  const readFromClipboard = useCallback(async (): Promise<string | null> => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        return await navigator.clipboard.readText();
      }
      return null;
    } catch (err) {
      console.error("Failed to read from clipboard:", err);
      return null;
    }
  }, []);

  return {
    copyToClipboard,
    readFromClipboard,
  };
};

// Hook for handling mobile message interactions
export const useMessageInteractions = () => {
  const { copyToClipboard } = useMobileClipboard();

  const copyMessage = useCallback(
    async (content: string): Promise<boolean> => {
      const success = await copyToClipboard(content);

      if (success) {
        // Haptic feedback for successful copy
        if ("vibrate" in navigator) {
          navigator.vibrate([50, 50, 50]);
        }
      }

      return success;
    },
    [copyToClipboard],
  );

  const shareMessage = useCallback(
    async (content: string, title?: string) => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: title || "Shared Message",
            text: content,
          });
          return true;
        } catch (err) {
          console.error("Failed to share:", err);
          return false;
        }
      } else {
        // Fallback to copy
        return await copyMessage(content);
      }
    },
    [copyMessage],
  );

  return {
    copyMessage,
    shareMessage,
  };
};

// Hook for optimized mobile scrolling
export const useMobileScroll = (elementRef: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Enable momentum scrolling on iOS
    element.style.webkitOverflowScrolling = "touch";

    // Prevent rubber band effect
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const element = e.currentTarget as HTMLElement;

      // Prevent scrolling past boundaries
      if (
        (element.scrollTop <= 0 && currentY > startY) ||
        (element.scrollTop >= element.scrollHeight - element.clientHeight &&
          currentY < startY)
      ) {
        e.preventDefault();
      }
    };

    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
    };
  }, [elementRef]);
};

// Hook for handling mobile input focus
export const useMobileInputFocus = () => {
  const scrollToInput = useCallback((inputElement: HTMLElement) => {
    // Delay to allow keyboard to open
    setTimeout(() => {
      inputElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  }, []);

  const handleInputFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if ("ontouchstart" in window) {
        // Mobile device detected
        scrollToInput(e.target);
      }
    },
    [scrollToInput],
  );

  return {
    handleInputFocus,
    scrollToInput,
  };
};
