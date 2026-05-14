import type { ReactNode } from "react";

type SharedNoteCardProps = {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  className?: string;
};

export default function SharedNoteCard({
  icon,
  title,
  children,
  className = "",
}: SharedNoteCardProps) {
  return (
    <div
      className={[
        "bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300",
        className,
      ].join(" ")}
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
        {icon}
      </div>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {children}
    </div>
  );
}
