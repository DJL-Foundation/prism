import Lenis from "lenis";
import { ScrollTrigger } from "./gsap";

let lenis: Lenis | null = null;
let rafId: number | null = null;

export function initLenis() {
  if (typeof window === "undefined") return;

  lenis = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 1.2,
    smoothWheel: true,
    syncTouch: false,
  });

  function raf(time: number) {
    lenis?.raf(time);
    rafId = requestAnimationFrame(raf);
  }

  rafId = requestAnimationFrame(raf);

  lenis.on("scroll", () => {
    ScrollTrigger.update();
  });

  return lenis;
}

export function destroyLenis() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  lenis?.destroy();
  lenis = null;
}

export function getLenis() {
  return lenis;
}
