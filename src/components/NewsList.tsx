import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export type NewsItem = {
  title: string;
  date: string;
  category: string;
  excerpt: string;
  to?: string;
  ariaLabel?: string;
};

type NewsListProps = {
  items: NewsItem[];
  className?: string;
};

export default function NewsList({ items, className = "" }: NewsListProps) {
  return (
    <div className={className}>
      <div className="space-y-4">
        {items.map((item) => {
          const content = (
            <>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  {item.category}
                </span>
                <time dateTime={item.date}>
                  {new Date(item.date).toLocaleDateString("de-DE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>

              <div className="flex items-start justify-between gap-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" />
              </div>
            </>
          );

          return (
            <article
              key={item.title}
              className="group rounded-xl border border-border/70 bg-background/50 hover:bg-background transition-colors duration-300 overflow-hidden"
            >
              {item.to ? (
                <Link
                  to={item.to}
                  className="block p-5 md:p-6"
                  aria-label={item.ariaLabel ?? item.title}
                >
                  {content}
                </Link>
              ) : (
                <div className="block p-5 md:p-6">{content}</div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
