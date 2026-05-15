import { m } from "#p";
import { ErrorPage } from "./errorPage";

export function PreLaunchErrorPage() {
  return (
    <ErrorPage
      tailwindGradientBlurSourceColour="destructive"
      title={m.error_401_title()}
      description={m.error_401_message()}
      backToHomepageCta
    />
  );
}
