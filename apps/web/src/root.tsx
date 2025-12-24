/* eslint-disable formatjs/no-literal-string-in-jsx */
import { ReactNode } from "react";
import {
  Links,
  LinksFunction,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import { Loading } from "@gc-digital-talent/ui";

import ContextContainer from "~/components/Context/ContextProvider";
import messages from "~/lang/frCompiled.json";
import "~/assets/css/tailwind.css";

import RootErrorBoundary from "./components/Layout/RouteErrorBoundary/RootErrorBoundary";
import { makeServerConfigJS } from "./utils/runtime";

declare global {
  interface Window {
    __SERVER_CONFIG__?: Map<string, string>;
  }
}

const DEFAULT_TITLE: string =
  APP_TITLE ?? "GC Digital Talent | Talents numériques du GC";
const DEFAULT_DESCRIPTION: string =
  APP_DESCRIPTION ??
  "Recruitment platform for digital jobs in the Government of Canada. Plateforme de recrutement pour les emplois numériques au gouvernement du Canada.";
const APP_URL = "https://talent.canada.ca";
const DEFAULT_IMAGE = `${APP_URL}/images/digital-talent/banner.jpg`;

export const meta: MetaFunction = () => {
  return [
    { title: DEFAULT_TITLE },
    { name: "description", content: DEFAULT_DESCRIPTION, "data-rh": "true" },

    // Open Graph
    { property: "og:type", content: "website", "data-rh": "true" },
    { property: "og:title", content: DEFAULT_TITLE, "data-rh": "true" },
    {
      property: "og:description",
      content: DEFAULT_DESCRIPTION,
      "data-rh": "true",
    },
    { property: "og:url", content: APP_URL, "data-rh": "true" },
    { property: "og:image", content: DEFAULT_IMAGE, "data-rh": "true" },

    // Twitter
    { name: "twitter:card", content: "summary_large_image", "data-rh": "true" },
    { name: "twitter:title", content: DEFAULT_TITLE, "data-rh": "true" },
    {
      name: "twitter:description",
      content: DEFAULT_DESCRIPTION,
      "data-rh": "true",
    },
    { name: "twitter:image", content: DEFAULT_IMAGE, "data-rh": "true" },
    { name: "twitter:url", content: APP_URL, "data-rh": "true" },
  ];
};

export const links: LinksFunction = () => [
  // Favicons
  {
    rel: "icon",
    href: "/images/digital-talent/favicon.ico",
    sizes: "any",
  },
  {
    rel: "icon",
    href: "/images/digital-talent/favicon.svg",
    type: "image/svg+xml",
  },
  {
    rel: "icon",
    href: "/images/digital-talent/favicon-32x32.png",
    type: "image/png",
    sizes: "32x32",
  },
  {
    rel: "icon",
    href: "/images/digital-talent/favicon-16x16.png",
    type: "image/png",
    sizes: "16x16",
  },

  // Apple icons
  {
    rel: "apple-touch-icon",
    href: "/images/digital-talent/apple-touch-icon.png",
  },
  {
    rel: "apple-touch-icon",
    sizes: "144x144",
    href: "/images/digital-talent/apple-touch-icon-144x144.png",
  },
  {
    rel: "apple-touch-icon",
    sizes: "120x120",
    href: "/images/digital-talent/apple-touch-icon-120x120.png",
  },

  // Safari pinned tab
  {
    rel: "mask-icon",
    href: "/images/digital-talent/safari-pinned-tab.svg",
    color: "#9747FF",
  },

  // PWA
  {
    rel: "manifest",
    href: "/site-en.webmanifest",
  },

  // Fonts
  {
    rel: "preconnect",
    href: "https://fonts.googleapis.com",
  },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap",
  },
];

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="msapplication-TileColor" content="#9747FF" />
        <meta name="theme-color" content="#9747FF" />
        <Meta />
        <Links nonce="**CSP_NONCE**" />
      </head>
      <body className="bg-gray-100 font-sans text-black dark:bg-gray-700 dark:text-white">
        {children}

        <ScrollRestoration nonce="**CSP_NONCE**" />
        <Scripts nonce="**CSP_NONCE**" />

        <script
          nonce="**CSP_NONCE**"
          dangerouslySetInnerHTML={{
            __html: `
              const filterUnusable = (value) => !value.startsWith("$") && value.length > 0 ? value : undefined;
              if (!window.__SERVER_CONFIG__) {
                window.__SERVER_CONFIG__ = new Map(
                  ${makeServerConfigJS()}
                );
              }
            `,
          }}
        />
        <noscript>
          It looks like JavaScript is disabled in your browser settings or
          unsupported by the browser itself. JavaScript is required to view this
          application.
          <br />
          Il semblerait que la fonction JavaScript soit désactivée ou non prise
          en charge dans votre navigateur comme tel. Il est nécessaire d’avoir
          JavaScript pour consulter cette application.
        </noscript>
      </body>
    </html>
  );
}

export default function Root() {
  return (
    <ContextContainer messages={messages}>
      <Outlet />
    </ContextContainer>
  );
}

export function ErrorBoundary() {
  return <RootErrorBoundary />;
}

export function HydrateFallback() {
  return <Loading />;
}
