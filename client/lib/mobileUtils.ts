// Mobile device detection utilities
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isAndroid = (): boolean => {
  return /Android/i.test(navigator.userAgent);
};

export const isTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Enhanced haptic feedback
export const hapticFeedback = {
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
  },
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  },
  heavy: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
  },
  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 50, 50]);
    }
  },
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  },
  notification: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }
  }
};

// Mobile keyboard utilities
export const keyboardUtils = {
  // Check if virtual keyboard is likely open
  isKeyboardOpen: (): boolean => {
    if (!isMobileDevice()) return false;
    const heightDifference = screen.height - window.innerHeight;
    return heightDifference > 150; // Threshold for keyboard detection
  },

  // Get estimated keyboard height
  getKeyboardHeight: (): number => {
    if (!isMobileDevice()) return 0;
    return Math.max(0, screen.height - window.innerHeight);
  },

  // Scroll element into view when keyboard opens
  scrollIntoView: (element: HTMLElement, delay: number = 300) => {
    if (!isMobileDevice()) return;
    
    setTimeout(() => {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }, delay);
  }
};

// Enhanced clipboard utilities for mobile
export const clipboardUtils = {
  // Copy text with mobile-optimized fallback
  copy: async (text: string): Promise<boolean> => {
    try {
      // Modern Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        hapticFeedback.success();
        return true;
      }

      // Fallback for older mobile browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      // Position off-screen
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      textArea.style.opacity = '0';
      
      document.body.appendChild(textArea);
      
      // Focus and select text
      textArea.focus();
      textArea.setSelectionRange(0, text.length);
      
      // iOS specific handling
      if (isIOS()) {
        const range = document.createRange();
        range.selectNodeContents(textArea);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
        textArea.setSelectionRange(0, 999999);
      } else {
        textArea.select();
      }
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        hapticFeedback.success();
      } else {
        hapticFeedback.error();
      }
      
      return successful;
    } catch (error) {
      console.error('Copy failed:', error);
      hapticFeedback.error();
      return false;
    }
  },

  // Read from clipboard
  read: async (): Promise<string | null> => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        return await navigator.clipboard.readText();
      }
      return null;
    } catch (error) {
      console.error('Clipboard read failed:', error);
      return null;
    }
  }
};

// Message interaction utilities
export const messageUtils = {
  // Share message using Web Share API or fallback to copy
  share: async (text: string, title?: string, url?: string): Promise<boolean> => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: title || 'Shared Message',
          text,
          url
        });
        hapticFeedback.success();
        return true;
      } else {
        // Fallback to copy
        return await clipboardUtils.copy(text);
      }
    } catch (error) {
      console.error('Share failed:', error);
      hapticFeedback.error();
      return false;
    }
  },

  // Format message for copying
  formatForCopy: (message: {
    content: string;
    senderName: string;
    timestamp: Date;
  }): string => {
    const time = message.timestamp.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${message.senderName} (${time}): ${message.content}`;
  },

  // Extract text from message (handles different message types)
  extractText: (message: {
    content: string;
    type: 'text' | 'image' | 'video' | 'audio' | 'file';
    mediaUrl?: string;
  }): string => {
    switch (message.type) {
      case 'text':
        return message.content;
      case 'image':
        return message.content || '[Image]';
      case 'video':
        return message.content || '[Video]';
      case 'audio':
        return '[Voice message]';
      case 'file':
        return message.content || '[File]';
      default:
        return message.content;
    }
  }
};

// Touch gesture utilities
export const gestureUtils = {
  // Double tap detection
  createDoubleTapHandler: (callback: () => void, delay: number = 300) => {
    let lastTap = 0;
    
    return () => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;
      
      if (tapLength < delay && tapLength > 0) {
        callback();
        hapticFeedback.light();
      }
      
      lastTap = currentTime;
    };
  },

  // Long press detection
  createLongPressHandler: (
    callback: () => void,
    threshold: number = 500
  ) => {
    let timeout: NodeJS.Timeout | null = null;
    let startTime = 0;
    
    const start = () => {
      startTime = Date.now();
      timeout = setTimeout(() => {
        callback();
        hapticFeedback.medium();
      }, threshold);
    };
    
    const end = () => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
    };
    
    const cancel = () => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
    };
    
    return { start, end, cancel };
  }
};

// Performance utilities for mobile
export const performanceUtils = {
  // Debounce function for touch events
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): T => {
    let timeout: NodeJS.Timeout;
    
    return ((...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(null, args), wait);
    }) as T;
  },

  // Throttle function for scroll events
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): T => {
    let inThrottle: boolean;
    
    return ((...args: any[]) => {
      if (!inThrottle) {
        func.apply(null, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }) as T;
  },

  // Request animation frame wrapper
  raf: (callback: () => void): void => {
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(callback);
    } else {
      setTimeout(callback, 16); // Fallback to 60fps
    }
  }
};

// Mobile-specific event helpers
export const eventUtils = {
  // Prevent default touch behaviors
  preventTouchDefaults: (element: HTMLElement) => {
    element.addEventListener('touchstart', (e) => {
      // Prevent zoom on double tap for UI elements
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });
    
    element.addEventListener('touchmove', (e) => {
      // Prevent scrolling for specific elements
      if (element.classList.contains('no-scroll')) {
        e.preventDefault();
      }
    }, { passive: false });
  },

  // Add mobile-friendly event listeners
  addMobileEvents: (
    element: HTMLElement,
    handlers: {
      tap?: () => void;
      doubleTap?: () => void;
      longPress?: () => void;
      swipeLeft?: () => void;
      swipeRight?: () => void;
    }
  ) => {
    if (handlers.tap) {
      element.addEventListener('click', handlers.tap);
    }
    
    if (handlers.doubleTap) {
      const doubleTapHandler = gestureUtils.createDoubleTapHandler(handlers.doubleTap);
      element.addEventListener('click', doubleTapHandler);
    }
    
    if (handlers.longPress) {
      const longPress = gestureUtils.createLongPressHandler(handlers.longPress);
      element.addEventListener('touchstart', longPress.start);
      element.addEventListener('touchend', longPress.end);
      element.addEventListener('touchcancel', longPress.cancel);
      element.addEventListener('touchmove', longPress.cancel);
    }
    
    // Swipe detection
    if (handlers.swipeLeft || handlers.swipeRight) {
      let startX = 0;
      let startY = 0;
      
      element.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      });
      
      element.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Check if horizontal swipe
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
          if (diffX > 0 && handlers.swipeLeft) {
            handlers.swipeLeft();
            hapticFeedback.light();
          } else if (diffX < 0 && handlers.swipeRight) {
            handlers.swipeRight();
            hapticFeedback.light();
          }
        }
      });
    }
  }
};

export default {
  isMobileDevice,
  isIOS,
  isAndroid,
  isTouchDevice,
  hapticFeedback,
  keyboardUtils,
  clipboardUtils,
  messageUtils,
  gestureUtils,
  performanceUtils,
  eventUtils
};
