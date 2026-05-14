"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "~/lib/gsap";

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], [role="combobox"], [role="option"], [role="menuitem"], [role="tab"], input, textarea, select, [data-slot="select-trigger"], [data-slot="select-item"], .magnetic-target, [href], label[for], summary';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isTouchDevice = "ontouchstart" in window;
    setIsTouchDevice(isTouchDevice);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !cursorRef.current) return;

    const isTouchDevice = "ontouchstart" in window;
    if (isTouchDevice) return;

    const cursor = cursorRef.current;

    // Initialize position and centering
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    // Use quickTo for performant updates
    const xTo = gsap.quickTo(cursor, "x", {
      duration: 0.1,
      ease: "power2.out",
    });
    const yTo = gsap.quickTo(cursor, "y", {
      duration: 0.1,
      ease: "power2.out",
    });

    const moveCursor = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", moveCursor);

    // Event delegation for hover states
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(INTERACTIVE_SELECTOR)) {
        gsap.to(cursor, {
          scale: 3,
          backgroundColor: "#FFD948",
          mixBlendMode: "difference",
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(INTERACTIVE_SELECTOR)) {
        gsap.to(cursor, {
          scale: 1,
          backgroundColor: "white",
          mixBlendMode: "difference",
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  if (!isTouchDevice) return;
  return (
    <div
      ref={cursorRef}
      className="custom-cursor"
      style={{
        position: "fixed",
        width: "16px",
        height: "16px",
        borderRadius: "50%",
        backgroundColor: "white",
        pointerEvents: "none",
        zIndex: 10000,
        top: 0,
        left: 0,
        // transform is handled by GSAP
        mixBlendMode: "difference",
      }}
      aria-hidden="true"
    />
  );
}

export default CustomCursor;
