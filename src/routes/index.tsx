import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as m from "#p";
import { gsap } from "~/lib/gsap";
import { generateMetaTags, generateWebSiteSchema } from "~/lib/meta";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => {
    const title = m.site_title_full();
    const description = m.site_description();

    return {
      ...generateMetaTags({
        title,
        description,
        url: "/",
        type: "website",
      }),
      scripts: [generateWebSiteSchema()],
    };
  },
});

function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const overTitleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLElement>(null);
  const manifestoTitleRef = useRef<HTMLHeadingElement>(null);
  const manifestoTextRef = useRef<HTMLParagraphElement>(null);
  const manifestoLinksRef = useRef<HTMLDivElement>(null);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      // setCurrentImageIndex((prev) => (prev + 1) % cc.heroImage.images.length);
    }, 4500);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: "expo.out" } });

      if (overTitleRef.current) {
        tl.from(
          overTitleRef.current,
          {
            y: 32,
            opacity: 0,
            duration: 0.7,
            ease: "expo.out",
          },
          0,
        );
      }

      if (titleRef.current) {
        const words = titleRef.current.querySelectorAll(".word");
        tl.from(words, {
          y: 110,
          opacity: 0,
          duration: 0.75,
          ease: "expo.out",
        });
      }

      if (subtitleRef.current) {
        tl.from(
          subtitleRef.current,
          {
            y: 48,
            opacity: 0,
            duration: 0.9,
            ease: "expo.out",
          },
          "-=0.6",
        );
      }

      if (ctaRef.current) {
        tl.from(
          ctaRef.current,
          {
            y: 36,
            opacity: 0,
            duration: 0.85,
            ease: "expo.out",
          },
          "-=0.5",
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const animationTuner = 50; // Percent

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const ease = "power3.out";

      if (heroRef.current) {
        gsap.to(heroRef.current, {
          scale: 0.86,
          y: -220,
          opacity: 0,
          transformOrigin: "center top",
          ease,
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: `${100 + animationTuner}% top`,
            scrub: 2,
          },
        });
      }

      if (heroImageRef.current) {
        gsap.to(heroImageRef.current, {
          scale: 1.08,
          yPercent: -12,
          opacity: 0.25,
          transformOrigin: "center top",
          ease,
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "120% top",
            scrub: 2,
          },
        });
      }

      if (overTitleRef.current) {
        gsap.fromTo(
          overTitleRef.current,
          {
            y: 0,
            opacity: 1,
            scale: 1,
          },
          {
            y: -200,
            opacity: 0,
            scale: 0.92,
            ease,
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "100% top",
              scrub: 2,
            },
          },
        );
      }

      if (titleRef.current) {
        gsap.to(titleRef.current, {
          y: -160,
          opacity: 0,
          ease,
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "95% top",
            scrub: 2,
          },
        });
      }

      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          {
            y: 0,
            opacity: 1,
          },
          {
            y: -120,
            opacity: 0,
            ease,
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "90% top",
              scrub: 2,
            },
          },
        );
      }

      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          {
            y: 0,
            opacity: 1,
          },
          {
            y: -90,
            opacity: 0,
            ease,
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "85% top",
              scrub: 2,
            },
          },
        );
      }

      if (manifestoRef.current) {
        gsap.fromTo(
          manifestoRef.current,
          {
            opacity: 0,
            // scale: 0.86, //
            scale: 0.86 * 0.75,
            y: 220,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease,
            scrollTrigger: {
              trigger: manifestoRef.current,
              start: `-${animationTuner}% bottom`,
              end: "top top",
              // start: "top top",
              // end: "120% top",
              scrub: 1.5,
            },
          },
        );
      }

      if (manifestoTitleRef.current) {
        gsap.fromTo(
          manifestoTitleRef.current,
          {
            opacity: 0,
            y: 60,
          },
          {
            opacity: 1,
            y: 0,
            ease,
            scrollTrigger: {
              trigger: manifestoRef.current,
              start: "top 80%",
              end: "center center",
              scrub: 1.2,
            },
          },
        );
      }

      if (manifestoTextRef.current) {
        gsap.fromTo(
          manifestoTextRef.current,
          {
            opacity: 0,
            y: 70,
          },
          {
            opacity: 1,
            y: 0,
            ease,
            scrollTrigger: {
              trigger: manifestoRef.current,
              start: "top 75%",
              end: "center center",
              scrub: 1.2,
            },
          },
        );
      }

      if (manifestoLinksRef.current) {
        gsap.fromTo(
          manifestoLinksRef.current,
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            ease,
            scrollTrigger: {
              trigger: manifestoRef.current,
              start: "top 70%",
              end: "center center",
              scrub: 1,
            },
          },
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // const isMobile = window.innerWidth < 768;
  const isMobile = false;
  // const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
  const isTablet = false;

  const heroTitle = isMobile
    ? m.site_title_short()
    : isTablet
      ? m.site_title()
      : m.site_title_full();
  const heroWords = heroTitle.split(" ");

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#070708] text-foreground"
      style={{
        background:
          "radial-gradient(circle at 50% 0%, rgba(168, 139, 250, 0.14) 0%, transparent 45%), linear-gradient(180deg, #070708 0%, #0b0b0e 50%, #09090b 100%)",
      }}
    >
      <section
        ref={heroRef}
        className="relative min-h-screen overflow-hidden px-6 will-change-transform origin-top"
      >
        <div
          ref={heroImageRef}
          className="absolute inset-0 pointer-events-none"
        >
          {/*{cc.heroImage.images.map((image, index: number) => (
            <div
              key={image.src}
              className={`absolute inset-0 transition-opacity duration-1000 bg-cover bg-center ${
                index === currentImageIndex ? "opacity-35" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url('${image.src}')`,
                filter: "saturate(0.8) contrast(1.05)",
              }}
            />
          ))}*/}
          <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/55 to-[#070708]" />
          <div className="fixed bottom-4 left-4 z-20 rounded-md bg-black/40 px-3 py-2 text-xs text-white/70 backdrop-blur-sm shadow-lg">
            {/*{cc.heroImage.images.at(currentImageIndex)?.credit}*/}
          </div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto pt-28 pb-20 min-h-screen flex items-center justify-center text-center will-change-transform origin-top">
          <div className="w-full max-w-4xl space-y-8">
            <div
              ref={overTitleRef}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm max-md:hidden"
            >
              <span className="text-xs uppercase tracking-[0.24em] text-white/75">
                {m.hero_overtitle()}
              </span>
            </div>

            <h1
              ref={titleRef}
              className="max-sm:text-5xl text-6xl md:text-8xl lg:flex lg:items-center lg:justify-center font-black tracking-tight leading-[0.92] text-white gap-8"
            >
              {heroWords.map((word) => (
                <span key={word} className="word block lg:inline-block py-1">
                  {word}
                </span>
              ))}
            </h1>

            <p
              ref={subtitleRef}
              className="text-xl md:text-3xl max-w-2xl max-md:hidden mx-auto text-white/72 leading-relaxed"
            >
              {m.hero_subtitle()}
            </p>

            <div
              ref={ctaRef}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm max-sm:scale-75">
                <Calendar className="w-5 h-5 text-primary" />
                <span
                // className={`text-white/85 ${RedactEventData ? "blurhide" : ""}`}
                >
                  {/*{RedactEventData ? m.hero_date_censored() : m.hero_date()}*/}
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm max-sm:scale-75">
                <MapPin className="w-5 h-5 text-primary" />
                <span
                // className={`text-white/85 ${RedactEventData ? "blurhide" : ""}`}
                >
                  {/*{RedactEventData*/}
                  {/*? m.hero_location_censored()*/}
                  {/*: m.hero_location()}*/}
                </span>
              </div>
            </div>

            {/*<div className="flex flex-wrap gap-3 justify-center pt-2">
              <Link
                to="/konzept"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-primary-foreground transition-all duration-300 hover:gap-3 hover:bg-primary/90"
              >
                Konzept ansehen
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/zeitplan"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-white/90 transition-colors hover:bg-white/10"
              >
                Zum Zeitplan
              </Link>
            </div>*/}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-[#070708] to-transparent pointer-events-none" />
      </section>

      <section
        ref={manifestoRef}
        className="relative min-h-[120vh] overflow-hidden px-6 py-28"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,139,250,0.18)_0%,transparent_45%),linear-gradient(180deg,rgba(7,7,8,0)_0%,rgba(255,255,255,0.03)_45%,rgba(7,7,8,0)_100%)]" />
        <div className="relative mx-auto flex min-h-[120vh] max-w-5xl flex-col justify-center">
          <div className="rounded-4xl border border-white/10 bg-white/5 p-8 md:p-12 backdrop-blur-xl shadow-2xl shadow-black/20">
            <p className="mb-4 text-sm uppercase tracking-[0.28em] text-white/55">
              Hinweis
            </p>

            <h2
              ref={manifestoTitleRef}
              className="max-w-4xl text-4xl md:text-6xl font-black tracking-tight text-white leading-[0.95]"
            >
              {/*{m.root_manifesto_title()}*/}
            </h2>

            <p
              ref={manifestoTextRef}
              className="mt-6 max-w-3xl text-lg md:text-2xl leading-relaxed text-white/72"
            >
              {/*{m.root_manifesto_text()}*/}
            </p>

            <div
              ref={manifestoLinksRef}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/blog"
                className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-4 font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90"
              >
                {m.nav_to_blog()}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/presse"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-medium text-white/90 transition-colors hover:bg-white/10"
              >
                {m.nav_to_presse()}
              </Link>
              <Link
                to="/kontakt"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-medium text-white/90 transition-colors hover:bg-white/10"
              >
                {m.nav_cta_kontakt()}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
