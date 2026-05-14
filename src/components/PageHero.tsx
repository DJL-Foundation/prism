"use client";

import type { ReactNode } from "react";
import { memo } from "react";

type PageHeroProps = {
  badge?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

function PageHeroComponent({
  badge,
  title,
  subtitle,
  meta,
  actions,
  className = "",
}: PageHeroProps) {
  return (
    <section className={["mb-16 max-w-4xl", className].join(" ")}>
      {badge && <div className="mb-6">{badge}</div>}

      <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 bg-linear-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
        {title}
      </h1>

      {subtitle && (
        <div className="text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed">
          {subtitle}
        </div>
      )}

      {meta && <div className="mt-8">{meta}</div>}

      {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
    </section>
  );
}

const PageHero = memo(PageHeroComponent);

export default PageHero;
