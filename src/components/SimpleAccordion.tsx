"use client";

import { ChevronDown } from "lucide-react";
import { memo, useState } from "react";

type SimpleAccordionItem = {
  id: string;
  title: string;
  content: React.ReactNode;
  defaultOpen?: boolean;
};

type SimpleAccordionProps = {
  items: SimpleAccordionItem[];
  allowMultipleOpen?: boolean;
  className?: string;
  itemClassName?: string;
  titleClassName?: string;
  contentClassName?: string;
};

function SimpleAccordionComponent({
  items,
  allowMultipleOpen = false,
  className = "",
  itemClassName = "",
  titleClassName = "",
  contentClassName = "",
}: SimpleAccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(() =>
    items.filter((item) => item.defaultOpen).map((item) => item.id),
  );

  const isOpen = (id: string) => openIds.includes(id);

  const toggleItem = (id: string) => {
    setOpenIds((current) => {
      const currentlyOpen = current.includes(id);

      if (allowMultipleOpen) {
        return currentlyOpen ? current.filter((itemId) => itemId !== id) : [...current, id];
      }

      return currentlyOpen ? [] : [id];
    });
  };

  return (
    <div className={className}>
      {items.map((item) => {
        const open = isOpen(item.id);

        return (
          <div
            key={item.id}
            className={[
              "overflow-hidden rounded-xl border border-border transition-colors",
              open ? "border-primary/40 bg-accent/20" : "bg-card",
              itemClassName,
            ].join(" ")}
          >
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
            >
              <span className={titleClassName}>{item.title}</span>
              <ChevronDown
                className={[
                  "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300",
                  open ? "rotate-180" : "",
                ].join(" ")}
              />
            </button>

            <div
              className={[
                "grid transition-all duration-300 overflow-hidden",
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              ].join(" ")}
            >
              <div className="min-h-0">
                <div className={["px-4 pb-4 pt-0", contentClassName].join(" ")}>
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const SimpleAccordion = memo(SimpleAccordionComponent);

export default SimpleAccordion;
