"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

type Mode = "initial" | "changed" | "reset";

const arraysEqual = (a: number[], b: number[]) =>
  a.length === b.length && a.every((v, i) => v === b[i]);

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    defaultValue?: number[];
  }
>(({ className, defaultValue = [0], onValueChange, ...props }, ref) => {
  const [mode, setMode] = React.useState<Mode>("initial");
  const [currentValue, setCurrentValue] = React.useState<number[]>(
    defaultValue
  );

  const handleChange = (val: number[]) => {
    const isDefault = arraysEqual(val, defaultValue);

    setCurrentValue(val);

    // decide next mode
    if (!isDefault) {
      // moved off default
      setMode("changed");
    } else {
      // val === default
      if (mode === "changed") {
        setMode("reset");
      }
      // if mode is initial or reset and still default, leave it
    }

    onValueChange?.(val);
  };

  // pick colors per mode
  const colorMap = {
    initial: {
      track: "bg-secondary",
      range: "bg-secondary",
      thumb: "border-secondary bg-secondary focus-visible:ring-secondary",
    },
    changed: {
      track: "bg-red-500",
      range: "bg-red-500",
      thumb: "border-red-500 bg-red-500 focus-visible:ring-red-500",
    },
    reset: {
      track: "bg-secondary",
      range: "bg-secondary",
      thumb: "border-secondary bg-secondary focus-visible:ring-secondary",
    },
  } as const;

  const { track, range, thumb } = colorMap[mode];

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      defaultValue={defaultValue}
      value={currentValue}
      onValueChange={handleChange}
      {...props}
    >
      <SliderPrimitive.Track
        className={cn(
          "relative h-1 w-full grow overflow-hidden rounded-full",
          track
        )}
      >
        <SliderPrimitive.Range
          className={cn("absolute h-full", range)}
        />
      </SliderPrimitive.Track>

      {/* render one Thumb per handle */}
      {currentValue.map((_, idx) => (
        <SliderPrimitive.Thumb
          key={idx}
          className={cn(
            "block h-4 w-4 rounded-full border-2 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            thumb
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
