import React from 'react';

// Extend React component props to include mobile-specific events
declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    onLongPress?: () => void;
    onDoubleTab?: () => void;
  }
}

// Custom hook to add long press functionality to any element
export const useLongPress = (
  callback: () => void,
  options: {
    threshold?: number;
    onStart?: () => void;
    onFinish?: () => void;
    onCancel?: () => void;
  } = {}
) => {
  const { threshold = 400, onStart, onFinish, onCancel } = options;
  const timeout = React.useRef<NodeJS.Timeout>();
  const target = React.useRef<EventTarget>();

  const start = React.useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (onStart) onStart();
      target.current = event.target;
      timeout.current = setTimeout(() => {
        callback();
        if (onFinish) onFinish();
      }, threshold);
    },
    [callback, threshold, onStart, onFinish]
  );

  const clear = React.useCallback(
    (event: React.MouseEvent | React.TouchEvent, shouldTriggerOnCancel = true) => {
      timeout.current && clearTimeout(timeout.current);
      shouldTriggerOnCancel && onCancel && onCancel();
    },
    [onCancel]
  );

  return {
    onMouseDown: (e: React.MouseEvent) => start(e),
    onTouchStart: (e: React.TouchEvent) => start(e),
    onMouseUp: (e: React.MouseEvent) => clear(e),
    onTouchEnd: (e: React.TouchEvent) => clear(e),
    onMouseLeave: (e: React.MouseEvent) => clear(e, false),
  };
};

// Enhanced Button component with mobile interactions
interface MobileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onLongPress?: () => void;
  onDoubleTab?: () => void;
  hapticFeedback?: boolean;
  children: React.ReactNode;
}

export const MobileButton: React.FC<MobileButtonProps> = ({
  onLongPress,
  onDoubleTab,
  hapticFeedback = true,
  onClick,
  children,
  ...props
}) => {
  const longPressEvents = useLongPress(
    () => {
      if (onLongPress) {
        onLongPress();
        if (hapticFeedback && 'vibrate' in navigator) {
          navigator.vibrate(100);
        }
      }
    },
    { threshold: 500 }
  );

  const lastTap = React.useRef<number>(0);

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (hapticFeedback && 'vibrate' in navigator) {
        navigator.vibrate(30);
      }

      if (onDoubleTab) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap.current;
        if (tapLength < 300 && tapLength > 0) {
          onDoubleTab();
          if (hapticFeedback && 'vibrate' in navigator) {
            navigator.vibrate([50, 50, 50]);
          }
          return;
        }
        lastTap.current = currentTime;
      }

      if (onClick) {
        onClick(e);
      }
    },
    [onClick, onDoubleTab, hapticFeedback]
  );

  return (
    <button
      {...props}
      {...longPressEvents}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

// Enhanced Input component with mobile optimizations
interface MobileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onMobileFocus?: () => void;
  autoScrollOnFocus?: boolean;
}

export const MobileInput: React.FC<MobileInputProps> = ({
  onMobileFocus,
  autoScrollOnFocus = true,
  onFocus,
  ...props
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFocus = React.useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (onMobileFocus) onMobileFocus();

      // Auto-scroll to input on mobile when keyboard opens
      if (autoScrollOnFocus && 'ontouchstart' in window) {
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }
        }, 300);
      }

      if (onFocus) onFocus(e);
    },
    [onFocus, onMobileFocus, autoScrollOnFocus]
  );

  return (
    <input
      ref={inputRef}
      {...props}
      onFocus={handleFocus}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="sentences"
      spellCheck="true"
    />
  );
};

// Enhanced message bubble component with mobile interactions
interface MessageBubbleProps {
  message: string;
  isOwn: boolean;
  onCopy?: () => void;
  onReact?: (emoji: string) => void;
  onReply?: () => void;
  onLongPress?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  onCopy,
  onReact,
  onReply,
  onLongPress,
  children,
  className = ''
}) => {
  const longPressEvents = useLongPress(
    () => {
      if (onLongPress) {
        onLongPress();
      }
    },
    { threshold: 500 }
  );

  const copyToClipboard = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(message);
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 50, 50]);
      }
      if (onCopy) onCopy();
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = message;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        if (onCopy) onCopy();
      } catch (err) {
        console.error('Failed to copy message');
      }
      
      document.body.removeChild(textArea);
    }
  }, [message, onCopy]);

  return (
    <div
      className={`
        select-text cursor-pointer transition-all duration-200 
        active:scale-95 hover:shadow-md
        ${className}
      `}
      {...longPressEvents}
      onDoubleClick={copyToClipboard}
    >
      {children}
    </div>
  );
};

// Context for mobile-specific settings
interface MobileContextValue {
  hapticFeedback: boolean;
  autoScroll: boolean;
  keyboardHeight: number;
  isKeyboardOpen: boolean;
}

const MobileContext = React.createContext<MobileContextValue>({
  hapticFeedback: true,
  autoScroll: true,
  keyboardHeight: 0,
  isKeyboardOpen: false
});

export const useMobileContext = () => React.useContext(MobileContext);

// Provider for mobile settings
export const MobileProvider: React.FC<{
  children: React.ReactNode;
  hapticFeedback?: boolean;
  autoScroll?: boolean;
}> = ({ 
  children, 
  hapticFeedback = true, 
  autoScroll = true 
}) => {
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);
  const [isKeyboardOpen, setIsKeyboardOpen] = React.useState(false);

  React.useEffect(() => {
    const handleKeyboardToggle = (e: CustomEvent) => {
      setIsKeyboardOpen(e.detail.isOpen);
      setKeyboardHeight(e.detail.height || 0);
    };

    window.addEventListener('keyboardToggle', handleKeyboardToggle as EventListener);
    
    return () => {
      window.removeEventListener('keyboardToggle', handleKeyboardToggle as EventListener);
    };
  }, []);

  const value = React.useMemo(() => ({
    hapticFeedback,
    autoScroll,
    keyboardHeight,
    isKeyboardOpen
  }), [hapticFeedback, autoScroll, keyboardHeight, isKeyboardOpen]);

  return (
    <MobileContext.Provider value={value}>
      {children}
    </MobileContext.Provider>
  );
};
