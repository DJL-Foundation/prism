import { m } from "#p";
import { ErrorPage } from "./errorPage";

export function PreLaunchErrorPage() {
  return (
    <ErrorPage
      tailwindGradientBlurSourceColour="destructive"
      title={m.error_prelaunch_title()}
      description={m.error_prelaunch_message()}
      cta={m.error_prelaunch_cta()}
      ctaHref="/blog/homepage-launch"
      backToHomepageCta
    />
  );
}
