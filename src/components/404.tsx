import { m } from "#p";
import { ErrorPage } from "./errorPage";

export function NotFoundPage() {
  return (
    <ErrorPage
      tailwindGradientBlurSourceColour="primary"
      title={m.error_404_title()}
      description={m.error_404_message()}
      backToHomepageCta
    />
  );
}
