"use client";

import type { ReactNode } from "react";
import { memo } from "react";

type ListSectionProps = {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
};

function ListSectionComponent({
  icon,
  title,
  children,
  className = "",
  headerClassName = "",
  contentClassName = "",
}: ListSectionProps) {
  return (
    <section
      className={[
        "rounded-3xl border border-border bg-card p-6 md:p-8",
        className,
      ].join(" ")}
    >
      <div className={["flex items-center gap-3 mb-5", headerClassName].join(" ")}>
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          {icon}
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>

      <div className={contentClassName}>{children}</div>
    </section>
  );
}

const ListSection = memo(ListSectionComponent);

export default ListSection;
