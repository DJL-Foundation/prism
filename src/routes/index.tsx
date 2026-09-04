import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ExternalLink,
  FileText,
  Link2,
  LockKeyhole,
  Presentation,
  Sparkles,
} from "lucide-react";
import * as m from "#p";
import { Logo } from "~/components/logo";
import { generateMetaTags } from "~/lib/meta";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    ...generateMetaTags({
      title: `${m.site_title_full()} — Project archive`,
      description:
        "An archived presentation-sharing experiment by Jack Ruder.",
      url: "/",
      type: "website",
    }),
  }),
});

function HomePage() {
  return (
    <div className="archive-page">
      <header className="site-header">
        <Link to="/" className="wordmark" aria-label="Prism home">
          <Logo />
          <span>PRISM</span>
        </Link>
        <nav aria-label="Main navigation">
          <a href="#about">About</a>
          <Link to="/presentation/demo">Example</Link>
          <button type="button" disabled title="Authentication is unavailable in the archive">
            <LockKeyhole size={14} /> Sign in unavailable
          </button>
        </nav>
      </header>

      <aside className="archive-notice" aria-label="Archive notice">
        <span className="status-dot" />
        <div>
          <strong>This project is archived.</strong> The original backend and
          authentication may no longer be available. The interface is preserved
          as part of Jack Ruder&apos;s project archive.
        </div>
      </aside>

      <main>
        <section className="hero">
          <div className="eyebrow"><Sparkles size={14} /> Presentation sharing, simplified</div>
          <h1>Your presentation.<br /><em>One memorable link.</em></h1>
          <p>
            Prism was designed to keep slides, handouts, and useful links
            together—ready to open from any browser when it was time to present.
          </p>
          <div className="hero-actions">
            <Link to="/presentation/demo" className="button button-primary">
              View example presentation <ArrowRight size={17} />
            </Link>
            <a href="#retrospective" className="button button-secondary">Read the retrospective</a>
          </div>
          <div className="url-demo" aria-label="Example Prism URL">
            <div className="browser-dots"><i /><i /><i /></div>
            <div className="address"><LockKeyhole size={13} /> prism.example/<b>future-of-learning</b></div>
            <span className="demo-label">ARCHIVE DEMO</span>
          </div>
        </section>

        <section className="feature-grid" id="about" aria-label="Original product features">
          <Feature icon={<Presentation />} number="01" title="Open anywhere">
            A browser-first home for presentation files, without hunting through drives or inboxes.
          </Feature>
          <Feature icon={<Link2 />} number="02" title="Share one link">
            A short, human-readable URL made every project easy to share and remember.
          </Feature>
          <Feature icon={<FileText />} number="03" title="Keep context together">
            Slides, papers, handouts, and interactive resources lived side by side.
          </Feature>
        </section>

        <section className="demo-callout">
          <div>
            <span className="section-kicker">PRESERVED INTERFACE</span>
            <h2>A presentation page,<br />without the infrastructure.</h2>
          </div>
          <div>
            <p>
              The example uses local, clearly labeled demo content. It preserves
              the public viewing flow while making no requests to the retired
              database, storage, analytics, or authentication services.
            </p>
            <Link to="/presentation/demo" className="text-link">Explore the demo <ExternalLink size={16} /></Link>
          </div>
        </section>

        <section className="retrospective" id="retrospective">
          <span className="section-kicker">PROJECT RETROSPECTIVE</span>
          <div className="retro-grid">
            <Retro title="Problem">Presentation-day materials were scattered across storage services, messages, and unwieldy URLs.</Retro>
            <Retro title="Approach">Design the smallest possible publishing flow: upload once, then share one durable link.</Retro>
            <Retro title="What was built">A product concept and frontend for public presentation pages, supporting files, and account-based publishing.</Retro>
            <Retro title="What was learned">The most valuable feature was not storage—it was confidence that the right material would open quickly, anywhere.</Retro>
            <Retro title="Status">Archived as a static, secret-free exhibit. Some concepts later informed a new confidential project.</Retro>
          </div>
        </section>
      </main>

      <footer><span>PRISM / THE PRESENTATION FOUNDATION</span><span>ARCHIVED PROJECT · JACK RUDER</span></footer>
    </div>
  );
}

function Feature({ icon, number, title, children }: { icon: React.ReactNode; number: string; title: string; children: React.ReactNode }) {
  return <article className="feature-card"><div className="feature-meta"><span>{icon}</span><small>{number}</small></div><h2>{title}</h2><p>{children}</p></article>;
}

function Retro({ title, children }: { title: string; children: React.ReactNode }) {
  return <article><h3>{title}</h3><p>{children}</p></article>;
}
