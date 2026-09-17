import { lazy, Suspense } from "react";
import { PortfolioPage } from "./portfolio/PortfolioPage";
import { PortfolioContentProvider } from "./providers/PortfolioContentProvider";

const DevelopmentEditor = import.meta.env.DEV
  ? lazy(() => import("./editor/PortfolioEditor"))
  : null;

export default function App() {
  return (
    <PortfolioContentProvider>
      <PortfolioPage />
      {DevelopmentEditor ? (
        <Suspense fallback={null}>
          <DevelopmentEditor />
        </Suspense>
      ) : null}
    </PortfolioContentProvider>
  );
}
