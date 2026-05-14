import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Flip);
}

export { gsap, ScrollTrigger, Flip };

export function initScrollTrigger() {
  if (typeof window === "undefined") return;
  ScrollTrigger.refresh();
}

export function cleanupScrollTrigger() {
  if (typeof window === "undefined") return;
  ScrollTrigger.getAll().forEach((st) => {
    st.kill();
  });
}

export function fadeInStagger(
  selector: string,
  options?: {
    stagger?: number;
    delay?: number;
    duration?: number;
    y?: number;
  },
) {
  const { stagger = 0.15, delay = 0, duration = 1, y = 60 } = options || {};

  return gsap.from(selector, {
    opacity: 0,
    y,
    duration,
    delay,
    stagger,
    ease: "expo.out",
    scrollTrigger: {
      trigger: selector,
      start: "top 85%",
    },
  });
}
