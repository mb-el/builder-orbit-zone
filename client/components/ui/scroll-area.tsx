import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/lib/utils";

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors relative group",
      orientation === "vertical" &&
        "h-full w-3 border-l border-l-transparent p-[1px] hover:w-4 transition-all duration-200",
      orientation === "horizontal" &&
        "h-3 flex-col border-t border-t-transparent p-[1px] hover:h-4 transition-all duration-200",
      "bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-full",
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb
      className="
        relative flex-1 rounded-full transition-all duration-200
        bg-gradient-to-br from-primary/60 via-primary/80 to-primary/60
        hover:from-primary/80 hover:via-primary hover:to-primary/80
        shadow-sm hover:shadow-md
        before:content-[''] before:absolute before:inset-0
        before:bg-gradient-to-br before:from-white/20 before:to-transparent
        before:rounded-full before:opacity-0 hover:before:opacity-100
        before:transition-opacity before:duration-200
      "
    />
    {/* Decorative dots */}
    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-0.5 opacity-0 group-hover:opacity-60 transition-opacity duration-200">
      <div className="w-0.5 h-0.5 bg-white rounded-full" />
      <div className="w-0.5 h-0.5 bg-white rounded-full" />
      <div className="w-0.5 h-0.5 bg-white rounded-full" />
    </div>
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
