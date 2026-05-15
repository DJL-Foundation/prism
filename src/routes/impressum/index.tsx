import { MDXContent } from "@content-collections/mdx/react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { allPages } from "#cc";
import * as m from "#p";
import { gsap } from "~/lib/gsap";
import { generateMetaTags } from "~/lib/meta";

export const Route = createFileRoute("/impressum/")({
  loader: () => {
    const page = allPages.find((p) => p.slug === "impressum");
    if (!page) throw notFound();
    return page;
  },
  component: ImpressumPage,
  head: () => {
    // const title = `${m.impressum_title()} - ${m.site_title()}`;
    const title = `ttt - ttt`;
    const description = "Impressum und rechtliche Informationen zu Prism";

    return generateMetaTags({
      title,
      description,
      url: "/impressum",
      type: "website",
    });
  },
});

function ImpressumPage() {
  const page = Route.useLoaderData();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".impressum-hero h1", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "expo.out",
      });
      gsap.from(".impressum-content", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.2,
        ease: "expo.out",
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-16">
        <div className="impressum-hero mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {/*{m.impressum_title()}*/}ttt
          </h1>
        </div>
        <div className="impressum-content prose prose-lg prose-slate dark:prose-invert max-w-none">
          <MDXContent code={page.mdx} />
        </div>
      </div>
    </div>
  );
}
