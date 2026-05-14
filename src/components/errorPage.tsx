import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { gsap } from "~/lib/gsap";
import { Logo } from "./logo";
import { m } from "#p";

type ErrorPageProps = {
  tailwindGradientBlurSourceColour: string;
  title: string;
  description: string;
  backToHomepageCta?: boolean;
  cta?: string;
  ctaHref?: string;
};

export function ErrorPage({
  tailwindGradientBlurSourceColour,
  title,
  backToHomepageCta,
  description,
  cta,
  ctaHref,
}: ErrorPageProps) {
  const logoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const messageRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      const ease = "expo.out";
      const tl = gsap.timeline({ defaults: { ease } });

      tl.from(logoRef.current, { y: 30, opacity: 0, duration: 0.8 })
        .from(titleRef.current, { y: 30, opacity: 0, duration: 0.8 }, "-=0.4")
        .from(messageRef.current, { y: 24, opacity: 0, duration: 0.7 }, "-=0.4")
        .fromTo(
          ".cta",
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.2,
          },
          "-=0.5",
        );
    });

    return () => ctx.revert();
  }, []);

  const gradientFromClass = `from-[color:var(--${tailwindGradientBlurSourceColour})]/20`;
  const gradientToClass = `to-[color:var(--${tailwindGradientBlurSourceColour})]/10`;

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-linear-to-br ${gradientFromClass} via-background ${gradientToClass} px-6`}
    >
      <div className="text-center space-y-8 max-w-2xl">
        <div className="flex justify-center" ref={logoRef}>
          <div className="relative">
            <Logo className="w-24 h-24 text-current/20 absolute blur-xl opacity-50 dark:invert" />
            <Logo
              className={`w-24 h-24 text-[color:var(--${tailwindGradientBlurSourceColour})] relative dark:invert`}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h1
            className="text-5xl md:text-7xl font-bold text-foreground"
            ref={titleRef}
          >
            {title}
          </h1>
          <p
            className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto leading-relaxed"
            ref={messageRef}
          >
            {description}
          </p>
        </div>

        {(cta && ctaHref) || backToHomepageCta ? (
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            {backToHomepageCta && (
              <Link
                to="/"
                className="cta inline-flex items-center justify-center gap-2 px-8 py-4 bg-card hover:bg-card/80 text-foreground rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border border-border min-w-[18rem] sm:min-w-0"
              >
                <span className="font-medium">
                  {m.error_back_to_homepage()}
                </span>
              </Link>
            )}
            {cta && ctaHref && (
              <Link
                to={ctaHref}
                className="cta inline-flex items-center justify-center gap-2 px-8 py-4 bg-card hover:bg-card/80 text-foreground rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border border-border min-w-[18rem] sm:min-w-0"
              >
                <span className="font-medium">{cta}</span>
              </Link>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
