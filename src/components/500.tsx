import { m } from "#p";
import { ErrorPage } from "./errorPage";

export function ServerErrorPage() {
  return (
    <ErrorPage
      tailwindGradientBlurSourceColour="destructive"
      title={m.error_500_title()}
      description={m.error_500_message()}
      backToHomepageCta
    />
  );
}
