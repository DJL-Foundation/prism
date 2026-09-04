import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileText, Link2, LockKeyhole, Presentation } from "lucide-react";
import * as m from "#p";
import { Logo } from "~/components/logo";
import { generateMetaTags, generateWebSiteSchema } from "~/lib/meta";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => {
    const title = m.site_title_full();
    const description = m.site_description();

    return {
      ...generateMetaTags({ title, description, url: "/", type: "website" }),
      scripts: [generateWebSiteSchema()],
    };
  },
});

const features = [
  {
    icon: Presentation,
    title: "Open anywhere",
    description: "Open a presentation from any browser when it is time to present.",
  },
  {
    icon: Link2,
    title: "Share one link",
    description: "Give every presentation a short, human-readable URL.",
  },
  {
    icon: FileText,
    title: "Keep resources together",
    description: "Collect slides, handouts, papers, and interactive links in one place.",
  },
];

function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between border-b border-border px-6 py-5">
        <Link to="/" className="flex items-center gap-3 font-semibold">
          <Logo className="h-6 w-6 dark:invert" />
          <span>Prism</span>
        </Link>
        <button
          type="button"
          disabled
          className="flex cursor-not-allowed items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground opacity-70"
          title="Authentication is unavailable in the archive"
        >
          <LockKeyhole className="h-4 w-4" />
          Sign in unavailable
        </button>
      </header>

      <div className="border-b border-primary/25 bg-primary/10">
        <div className="mx-auto max-w-6xl px-6 py-4 text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">This project is archived.</strong>{" "}
          The original backend and authentication may no longer be available. The
          interface is preserved as part of Jack Ruder&apos;s project archive.
        </div>
      </div>

      <main>
        <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <p className="mb-5 text-sm font-medium uppercase tracking-widest text-primary">
            The Presentation Foundation
          </p>
          <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
            Your presentation materials, behind one simple link.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Prism was a lightweight presentation-sharing concept for keeping slides,
            handouts, papers, and useful links ready to open from any browser.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/presentation/demo"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 font-medium text-primary-foreground"
            >
              View example presentation
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#retrospective"
              className="rounded-md border border-border px-5 py-3 font-medium"
            >
              Read the retrospective
            </a>
          </div>
        </section>

        <section className="border-y border-border bg-card/40">
          <div className="mx-auto grid max-w-6xl md:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="border-b border-border px-6 py-10 last:border-b-0 md:border-r md:border-b-0 md:last:border-r-0"
              >
                <Icon className="mb-8 h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold">{title}</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="retrospective" className="mx-auto max-w-6xl px-6 py-24">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary">
            Project retrospective
          </p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">What this project explored</h2>
          <dl className="mt-12 grid gap-10 md:grid-cols-2">
            <RetrospectiveItem term="Problem">
              Presentation-day materials were scattered across storage services,
              messages, and unwieldy URLs.
            </RetrospectiveItem>
            <RetrospectiveItem term="Approach">
              Create the smallest possible publishing flow: upload once, then share one
              durable link.
            </RetrospectiveItem>
            <RetrospectiveItem term="What was built">
              A product concept and frontend for public presentation pages, supporting
              resources, and account-based publishing.
            </RetrospectiveItem>
            <RetrospectiveItem term="What was learned">
              The most valuable feature was confidence that the right material would
              open quickly, anywhere.
            </RetrospectiveItem>
            <RetrospectiveItem term="Status">
              Archived as a static, secret-free exhibit. Some concepts later informed a
              new confidential project.
            </RetrospectiveItem>
          </dl>
        </section>
      </main>

      <footer className="mx-auto flex max-w-6xl flex-wrap justify-between gap-3 border-t border-border px-6 py-8 text-sm text-muted-foreground">
        <span>Prism · The Presentation Foundation</span>
        <span>Archived project · Jack Ruder</span>
      </footer>
    </div>
  );
}

function RetrospectiveItem({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="font-semibold text-foreground">{term}</dt>
      <dd className="mt-2 leading-relaxed text-muted-foreground">{children}</dd>
    </div>
  );
}
