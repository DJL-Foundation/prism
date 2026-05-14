"use client";

import type { ReactNode } from "react";
import { memo } from "react";

type HeroBadgeProps = {
  icon: ReactNode;
  children: ReactNode;
  className?: string;
};

function HeroBadgeComponent({
  icon,
  children,
  className = "",
}: HeroBadgeProps) {
  return (
    <div
      className={[
        "inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-medium uppercase tracking-wider",
        className,
      ].join(" ")}
    >
      {icon}
      <span>{children}</span>
    </div>
  );
}

const HeroBadge = memo(HeroBadgeComponent);

export default HeroBadge;
