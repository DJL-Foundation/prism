"use client";

import type { ReactNode } from "react";
import { memo } from "react";

type SectionCardProps = {
  icon?: ReactNode;
  title: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

function SectionCardComponent({
  icon,
  title,
  children,
  className = "",
  contentClassName = "",
}: SectionCardProps) {
  return (
    <article
      className={[
        "rounded-3xl border border-border bg-card p-6 md:p-8",
        className,
      ].join(" ")}
    >
      <div className="flex items-center gap-3 mb-5">
        {icon && (
          <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            {icon}
          </div>
        )}
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>

      <div className={contentClassName}>{children}</div>
    </article>
  );
}

const SectionCard = memo(SectionCardComponent);

export default SectionCard;
