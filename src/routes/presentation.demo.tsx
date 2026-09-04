import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Download, ExternalLink, FileText, Link2, Presentation, UserRound } from "lucide-react";
import { Logo } from "~/components/logo";

export const Route = createFileRoute("/presentation/demo")({
  component: DemoPresentation,
  head: () => ({ meta: [{ title: "The Future of Learning — Prism archive demo" }] }),
});

const resources = [
  { icon: Presentation, type: "Presentation", title: "The Future of Learning", meta: "PDF · 4.8 MB · Demo file" },
  { icon: FileText, type: "Handout", title: "Audience notes & reading list", meta: "PDF · 680 KB · Demo file" },
  { icon: Link2, type: "Interactive link", title: "Live audience questions", meta: "Unavailable in archive · Demo link" },
];

function DemoPresentation() {
  return (
    <div className="presentation-page">
      <header className="presentation-header">
        <Link to="/" className="wordmark"><Logo /><span>PRISM</span></Link>
        <span className="demo-label">ARCHIVE DEMO</span>
      </header>
      <aside className="archive-notice compact"><span className="status-dot" /><div><strong>Archived interface.</strong> This page contains representative demo content only. Downloads, external links, and sign-in are disabled.</div></aside>
      <main className="presentation-main">
        <Link to="/" className="back-link"><ArrowLeft size={15} /> Back to project archive</Link>
        <section className="project-heading">
          <div><span className="section-kicker">EXAMPLE PRESENTATION · DEMO CONTENT</span><h1>The Future of Learning</h1><p>A sample presentation about thoughtful technology in the classroom.</p></div>
          <div className="presenter"><span><UserRound size={18} /></span><div><small>Presented by</small><strong>Alex Morgan</strong></div></div>
        </section>
        <section className="preview-shell" aria-label="Presentation preview">
          <div className="slide-number">01 / 12</div>
          <div className="sample-slide"><div className="slide-mark"><Logo /></div><span>EDUCATION × TECHNOLOGY</span><h2>The future of<br /><em>learning</em></h2><p>Designing tools that create room for curiosity.</p><div className="slide-footer"><span>Alex Morgan</span><span>2026 · Archive demo</span></div></div>
          <div className="preview-controls"><button type="button" disabled><Download size={16} /> Download demo PDF</button><span>Preview preserved for archival purposes</span></div>
        </section>
        <section className="resources"><div className="resources-heading"><div><span className="section-kicker">PROJECT MATERIALS</span><h2>Everything in one place.</h2></div><span>3 demo resources</span></div>
          <div className="resource-list">{resources.map(({ icon: Icon, type, title, meta }, index) => <article className="resource" key={title}><span className="resource-icon"><Icon /></span><div><small>{type}</small><h3>{title}</h3><p>{meta}</p></div><button type="button" disabled aria-label={`${title} is unavailable`}>{index === 2 ? <ExternalLink /> : <Download />}</button></article>)}</div>
        </section>
      </main>
      <footer><span>Shared with Prism</span><span>STATIC ARCHIVE · NO DATA COLLECTED</span></footer>
    </div>
  );
}
