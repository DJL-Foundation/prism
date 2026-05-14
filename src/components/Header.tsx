"use client";

import { usePostHog } from "@posthog/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useHotkeys } from "@tanstack/react-hotkeys";
import { X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as m from "#p";
import { gsap } from "~/lib/gsap";
import { Logo } from "./logo";
import { RedactEventData } from "~/lib/constants";

type NavItem = {
  to: string;
  label: string;
  hidden?: boolean;
};

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const brandRef = useRef<HTMLAnchorElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuInnerRef = useRef<HTMLDivElement>(null);
  const menuBrandRef = useRef<HTMLAnchorElement>(null);
  const exitTimerRef = useRef<number | null>(null);

  const posthog = usePostHog();
  const navigate = useNavigate();

  const navItems = useMemo<NavItem[]>(
    () => [
      { to: "/", label: m.nav_home() },
      { to: "/konzept", label: m.nav_konzept(), hidden: RedactEventData },
      { to: "/zeitplan", label: m.nav_zeitplan(), hidden: RedactEventData },
      { to: "/team", label: m.nav_team(), hidden: RedactEventData },
      { to: "/partner", label: m.nav_partner(), hidden: RedactEventData },
      { to: "/blog", label: m.nav_blog() },
      { to: "/presse", label: m.nav_presse() },
      { to: "/kontakt", label: m.nav_kontakt() },
      { to: "/impressum", label: m.nav_impressum() },
    ],
    [],
  );

  const clearExitTimer = useCallback(() => {
    if (exitTimerRef.current !== null) {
      window.clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
  }, []);

  const animateHeaderOut = () => {
    const brand = brandRef.current;
    const menuButton = menuButtonRef.current;

    if (brand) {
      gsap.killTweensOf(brand);
      gsap.fromTo(
        brand,
        { x: 0, y: 0, opacity: 1 },
        {
          x: -10,
          y: -6,
          opacity: 0,
          duration: 0.18,
          ease: "power2.in",
        },
      );
    }

    if (menuButton) {
      gsap.killTweensOf(menuButton);
      gsap.fromTo(
        menuButton,
        { x: 0, y: 0, opacity: 1 },
        {
          x: 10,
          y: -6,
          opacity: 0,
          duration: 0.18,
          ease: "power2.in",
        },
      );
    }
  };

  const animateHeaderIn = () => {
    const brand = brandRef.current;
    const menuButton = menuButtonRef.current;

    if (brand) {
      gsap.killTweensOf(brand);
      gsap.fromTo(
        brand,
        { x: -10, y: -6, opacity: 0 },
        {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 0.22,
          ease: "power2.out",
        },
      );
    }

    if (menuButton) {
      gsap.killTweensOf(menuButton);
      gsap.fromTo(
        menuButton,
        { x: 10, y: -6, opacity: 0 },
        {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 0.22,
          ease: "power2.out",
        },
      );
    }
  };

  const openMenu = () => {
    if (isOpen) return;

    clearExitTimer();
    setIsClosing(false);
    setIsOpen(true);
    animateHeaderOut();
    posthog.capture("nav_menu_opened");
  };

  const closeMenu = () => {
    if (!isOpen || isClosing) return;

    setIsClosing(true);
    clearExitTimer();

    const menu = menuRef.current;
    const inner = menuInnerRef.current;
    const menuBrand = menuBrandRef.current;

    if (!menu || !inner) {
      setIsOpen(false);
      setIsClosing(false);
      animateHeaderIn();
      return;
    }

    gsap.killTweensOf([menu, inner]);
    if (menuBrand) gsap.killTweensOf(menuBrand);

    const tl = gsap.timeline({
      onComplete: () => {
        exitTimerRef.current = window.setTimeout(() => {
          setIsOpen(false);
          setIsClosing(false);
          animateHeaderIn();
          exitTimerRef.current = null;
        }, 40);
      },
    });

    tl.to(inner, {
      opacity: 0,
      y: 18,
      scale: 0.985,
      duration: 0.22,
      ease: "power2.in",
    })
      .to(
        menu,
        {
          opacity: 0,
          duration: 0.22,
          ease: "power1.in",
        },
        "<",
      )
      .to(
        menuBrand,
        {
          x: 10,
          y: -6,
          opacity: 0,
          duration: 0.18,
          ease: "power2.in",
        },
        "<",
      );
  };

  const handleNavLinkClick = (label: string, to: string) => {
    posthog.capture("nav_link_clicked", {
      link_label: label,
      link_destination: to,
    });

    closeMenu();
    window.setTimeout(() => {
      navigate({ to });
    }, 260);
  };

  useHotkeys(
    [
      {
        hotkey: "Mod+H",
        callback: () => {
          openMenu();
        },
      },
      {
        hotkey: "Escape",
        callback: () => {
          if (isOpen) closeMenu();
        },
      },
      {
        hotkey: "1",
        callback: () => {
          if (isOpen && !isClosing && navItems[0]) {
            handleNavLinkClick(navItems[0].label, navItems[0].to);
          }
        },
      },
      {
        hotkey: "2",
        callback: () => {
          if (isOpen && !isClosing && navItems[1]) {
            handleNavLinkClick(navItems[1].label, navItems[1].to);
          }
        },
      },
      {
        hotkey: "3",
        callback: () => {
          if (isOpen && !isClosing && navItems[2]) {
            handleNavLinkClick(navItems[2].label, navItems[2].to);
          }
        },
      },
      {
        hotkey: "4",
        callback: () => {
          if (isOpen && !isClosing && navItems[3]) {
            handleNavLinkClick(navItems[3].label, navItems[3].to);
          }
        },
      },
      {
        hotkey: "5",
        callback: () => {
          if (isOpen && !isClosing && navItems[4]) {
            handleNavLinkClick(navItems[4].label, navItems[4].to);
          }
        },
      },
      {
        hotkey: "6",
        callback: () => {
          if (isOpen && !isClosing && navItems[5]) {
            handleNavLinkClick(navItems[5].label, navItems[5].to);
          }
        },
      },
      {
        hotkey: "7",
        callback: () => {
          if (isOpen && !isClosing && navItems[6]) {
            handleNavLinkClick(navItems[6].label, navItems[6].to);
          }
        },
      },
      {
        hotkey: "8",
        callback: () => {
          if (isOpen && !isClosing && navItems[7]) {
            handleNavLinkClick(navItems[7].label, navItems[7].to);
          }
        },
      },
      {
        hotkey: "9",
        callback: () => {
          if (isOpen && !isClosing && navItems[8]) {
            handleNavLinkClick(navItems[8].label, navItems[8].to);
          }
        },
      },
    ],
    { preventDefault: true },
  );

  useEffect(() => {
    if (typeof window === "undefined" || !headerRef.current) return;

    const header = headerRef.current;

    gsap.set(header, {
      webkitMaskImage:
        "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
      maskImage:
        "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
    });

    const ctx = gsap.context(() => {
      gsap.to(header, {
        backdropFilter: "blur(20px)",
        background:
          "linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0))",
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top -10",
          end: "top -200",
          scrub: 0.5,
        },
      });
    }, headerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    return () => {
      clearExitTimer();
    };
  }, [clearExitTimer]);

  useEffect(() => {
    if (!isOpen || isClosing || !menuRef.current || !menuInnerRef.current) {
      return;
    }

    const menu = menuRef.current;
    const inner = menuInnerRef.current;
    const menuBrand = menuBrandRef.current;

    gsap.killTweensOf([menu, inner]);
    if (menuBrand) gsap.killTweensOf(menuBrand);

    gsap.set(menu, { opacity: 0 });
    gsap.set(inner, { opacity: 0, y: 18, scale: 0.985 });

    if (menuBrand) {
      gsap.set(menuBrand, { opacity: 1, x: 0, y: 0 });
    }

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
    });

    tl.to(menu, {
      opacity: 1,
      duration: 0.24,
    }).to(
      inner,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.3,
      },
      "<0.03",
    );

    if (menuBrand) {
      gsap.fromTo(
        menuBrand,
        { x: 10, y: -6, opacity: 0 },
        {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 0.22,
          ease: "power2.out",
        },
      );
    }

    const items = inner.querySelectorAll(".menu-item");
    if (items.length > 0) {
      gsap.fromTo(
        items,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.45,
          stagger: 0.05,
          ease: "expo.out",
          delay: 0.1,
        },
      );
    }
  }, [isOpen, isClosing]);

  const mobileScrollable = navItems.length > 6;

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 z-40 w-full transition-all duration-300 h-32 pointer-events-none"
        style={{ backgroundColor: "transparent" }}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between pointer-events-auto">
          <Link
            ref={brandRef}
            to="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity magnetic-target group"
          >
            <Logo className="w-8 h-8 text-white group-hover:scale-110 transition-transform dark:invert" />
            <span className="font-bold text-xl hidden sm:inline text-white">
              {m.site_title()}
            </span>
            <span className="font-bold text-xl sm:hidden text-white">
              {m.site_title_short()}
            </span>
          </Link>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={openMenu}
            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors group"
            aria-label="Open menu"
          >
            <span className="text-2xl font-light group-hover:tracking-wider transition-all">
              +
            </span>
            <span className="text-sm font-medium uppercase tracking-wider">
              {m.nav_menu()}
            </span>
          </button>
        </div>
      </header>

      {(isOpen || isClosing) && (
        <div
          ref={menuRef}
          className="fixed inset-0 z-50 bg-card/95 backdrop-blur-xl overflow-hidden"
          style={{
            opacity: isOpen ? 1 : 0,
            pointerEvents: isClosing ? "none" : "auto",
          }}
        >
          <div
            ref={menuInnerRef}
            className={[
              "max-w-7xl mx-auto px-6 h-screen flex flex-col",
              mobileScrollable
                ? "overflow-y-auto md:overflow-visible"
                : "overflow-hidden",
            ].join(" ")}
          >
            <div className="h-20 flex items-center justify-between shrink-0">
              <Link
                ref={menuBrandRef}
                to="/"
                onClick={(event) => {
                  event.preventDefault();
                  handleNavLinkClick(m.site_title(), "/");
                }}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
              >
                <Logo className="w-8 h-8 text-foreground group-hover:scale-110 transition-transform dark:invert" />
                <span className="font-bold text-xl hidden sm:inline text-foreground">
                  {m.site_title()}
                </span>
                <span className="font-bold text-xl sm:hidden text-foreground">
                  {m.site_title_short()}
                </span>
              </Link>

              <button
                type="button"
                onClick={closeMenu}
                className="flex items-center gap-2 hover:text-muted-foreground transition-colors group"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 transition-transform duration-200 group-hover:rotate-90" />
                <span
                  className={"text-sm font-medium uppercase tracking-wider"}
                >
                  {m.nav_close()}
                </span>
              </button>
            </div>

            <nav
              className={[
                "flex-1 flex justify-center",
                mobileScrollable
                  ? "items-start md:items-center pt-6 md:pt-0"
                  : "items-center",
              ].join(" ")}
            >
              <div className="w-full max-w-5xl">
                <div className="grid gap-2 md:grid-cols-2">
                  {navItems.map((item, index) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={(event) => {
                        event.preventDefault();
                        handleNavLinkClick(item.label, item.to);
                      }}
                      className="menu-item block group"
                      activeProps={{
                        className: "menu-item block group active",
                      }}
                    >
                      <div className="flex items-center justify-between py-6 px-8 border-b border-border/50 hover:border-primary/50 transition-all duration-300 ">
                        <span
                          className={`text-4xl md:text-6xl font-bold group-hover:text-primary group-hover:translate-x-4 transition-all duration-300 ${item.hidden ? "blurhide decoration-10" : ""}`}
                        >
                          {item.label}
                        </span>
                        <span className="text-lg md:text-2xl text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all duration-300">
                          ({String(index + 1).padStart(2, "0")})
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            <div className="h-20 flex items-center justify-between text-sm text-muted-foreground shrink-0">
              <p className="hidden max-md:block">
                {m.copyright({
                  currentYear: new Date().getFullYear(),
                  site_title_noyear: m.site_title_noyear(),
                })}
              </p>
              <p className="hidden md:block">
                {m.copyright_nonprofit({
                  currentYear: new Date().getFullYear(),
                  site_title_noyear: m.site_title_noyear(),
                })}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
