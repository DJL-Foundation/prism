import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Download, FileText, Link2, Presentation } from "lucide-react";
import { Logo } from "~/components/logo";

export const Route = createFileRoute("/presentation/demo")({
  component: DemoPresentation,
  head: () => ({
    meta: [{ title: "The Future of Learning — Prism archive demo" }],
  }),
});

const resources = [
  { icon: Presentation, type: "Presentation", title: "The Future of Learning", detail: "PDF · Demo file" },
  { icon: FileText, type: "Handout", title: "Audience notes & reading list", detail: "PDF · Demo file" },
  { icon: Link2, type: "Interactive link", title: "Live audience questions", detail: "Unavailable in archive" },
];

function DemoPresentation() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-5xl items-center justify-between border-b border-border px-6 py-5">
        <Link to="/" className="flex items-center gap-3 font-semibold">
          <Logo className="h-6 w-6 dark:invert" />
          <span>Prism</span>
        </Link>
        <span className="rounded border border-primary/30 bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
          Archive demo
        </span>
      </header>

      <div className="border-b border-primary/25 bg-primary/10">
        <div className="mx-auto max-w-5xl px-6 py-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Archived interface.</strong>{" "}
          This page contains representative demo content. Downloads and external links are disabled.
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to project archive
        </Link>

        <section className="py-14">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Example presentation · Demo content
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">The Future of Learning</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A sample presentation about thoughtful technology in the classroom.
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card p-4 md:p-8" aria-label="Presentation preview">
          <div className="flex aspect-video flex-col justify-between rounded-lg bg-white p-8 text-zinc-900 md:p-14">
            <div className="flex items-center justify-between">
              <Logo className="h-7 w-7" />
              <span className="text-xs font-medium uppercase tracking-widest">Education × Technology</span>
            </div>
            <div>
              <h2 className="text-4xl font-bold tracking-tight md:text-7xl">The future of learning</h2>
              <p className="mt-4 text-zinc-600">Designing tools that create room for curiosity.</p>
            </div>
            <div className="flex justify-between text-xs text-zinc-500">
              <span>Alex Morgan</span>
              <span>Archive demo</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>Preview preserved for archival purposes</span>
            <button type="button" disabled className="flex cursor-not-allowed items-center gap-2 opacity-60">
              <Download className="h-4 w-4" /> Download unavailable
            </button>
          </div>
        </section>

        <section className="py-20">
          <h2 className="text-3xl font-bold tracking-tight">Project materials</h2>
          <div className="mt-8 divide-y divide-border border-y border-border">
            {resources.map(({ icon: Icon, type, title, detail }) => (
              <article key={title} className="flex items-center gap-5 py-6">
                <span className="grid h-12 w-12 place-items-center rounded-md border border-border bg-muted/30 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-primary">{type}</p>
                  <h3 className="mt-1 font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
                </div>
                <button type="button" disabled className="cursor-not-allowed text-muted-foreground opacity-50" aria-label={`${title} is unavailable`}>
                  <Download className="h-5 w-5" />
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
