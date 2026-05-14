import type { AnyRouter } from "@tanstack/react-router";
import { gsap } from "./gsap";

export function setupPageTransitions(router: AnyRouter) {
  if (typeof window === "undefined") return;

  let isTransitioning = false;

  router.subscribe("onBeforeLoad", async () => {
    if (isTransitioning) return;
    isTransitioning = true;

    const container = document.querySelector("[data-transition-container]");
    if (container) {
      await gsap.to(container, {
        opacity: 0,
        y: -30,
        duration: 0.3,
        ease: "power2.inOut",
      });
    }
  });

  router.subscribe("onLoad", async () => {
    window.scrollTo(0, 0);

    const container = document.querySelector("[data-transition-container]");
    if (container) {
      gsap.set(container, { opacity: 0, y: 30 });
      await gsap.to(container, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    }

    isTransitioning = false;
  });
}
