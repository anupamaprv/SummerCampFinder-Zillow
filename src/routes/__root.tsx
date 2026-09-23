import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Kodanz — Find camps and enrichment programs they'll love" },
      { name: "description", content: "Zillow for Summer camps and year-round enrichment programs. Search coding, dance, entrepreneurship, sports, arts, and more by ZIP, age, and interests." },
      { name: "author", content: "Kodanz" },
      { property: "og:title", content: "Kodanz — Find camps and enrichment programs they'll love" },
      { property: "og:description", content: "Zillow for Summer camps and year-round enrichment programs. Search coding, dance, entrepreneurship, sports, arts, and more by ZIP, age, and interests." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Kodanz" },
      { name: "twitter:title", content: "Kodanz — Find camps and enrichment programs they'll love" },
      { name: "twitter:description", content: "Zillow for Summer camps and year-round enrichment programs. Search coding, dance, entrepreneurship, sports, arts, and more by ZIP, age, and interests." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/387030a2-8da9-487a-948e-27e9a136ae2d/id-preview-5af9aab6--009b0cd1-0934-4f73-83fd-5a7042781446.lovable.app-1776811897482.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/387030a2-8da9-487a-948e-27e9a136ae2d/id-preview-5af9aab6--009b0cd1-0934-4f73-83fd-5a7042781446.lovable.app-1776811897482.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
