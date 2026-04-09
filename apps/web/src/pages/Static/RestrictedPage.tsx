/* eslint-disable formatjs/no-literal-string-in-jsx */
import GocLogoEn from "../../components/Svg/GocLogoEn";
import GocLogoFr from "../../components/Svg/GocLogoFr";

/**
 * Standalone bilingual "access restricted" page.
 *
 * Intentionally avoids imports that require a browser runtime (react-intl,
 * react-router, window, etc.) so it can be rendered with
 * renderToStaticMarkup in the post-build prerender script.
 *
 * The Tailwind classes used here are picked up by the @tailwindcss/vite
 * plugin during the normal Vite build, so they are included in the
 * generated CSS bundle without any extra configuration.
 */
const RestrictedPage = () => (
  <div className="flex min-h-screen flex-col font-sans">
    {/* Flourish bar */}
    <div className="block h-6 bg-linear-(--gradient-main-linear)" />

    {/* Header */}
    <div className="mx-auto w-full max-w-6xl px-6">
      <div className="mt-6 flex flex-col items-center justify-between gap-6 xs:flex-row xs:items-start">
        <a
          href="https://www.canada.ca/en.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GocLogoEn className="h-auto w-64" />
        </a>
        <a
          href="https://www.canada.ca/fr.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GocLogoFr className="h-auto w-64" />
        </a>
      </div>
    </div>

    {/* Content */}
    <div className="flex flex-1 items-center bg-gray-100 py-18 text-black">
      <div className="mx-auto w-full max-w-6xl px-6 text-center">
        <h1 className="mb-6 mt-0 text-4xl/[1.1] font-bold lg:text-5xl/[1.1]">
          Unauthorized
          <span className="mx-4 font-light text-gray-400" aria-hidden="true">
            |
          </span>
          Non autorisé
        </h1>
        <p className="text-lg">
          This page can only be accessed on the secure network.
        </p>
        <p className="text-lg" lang="fr">
          Cette page n&apos;est accessible que sur le réseau sécurisé.
        </p>
      </div>
    </div>

    {/* Flourish bar */}
    <div className="block h-6 bg-linear-(--gradient-main-linear)" />
  </div>
);

export default RestrictedPage;
