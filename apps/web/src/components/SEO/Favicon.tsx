import { Helmet } from "react-helmet-async";

type Locale = "en" | "fr";
export type Project = "digital-talent" | "iap" | "admin";

interface FaviconProps {
  locale: Locale;
  project: Project;
}

const colourMap = new Map<Project, string>([
  ["digital-talent", "#fff"],
  ["iap", "#6e1d41"],
  ["admin", "#fff"],
]);

const Favicon = ({ locale, project }: FaviconProps) => {
  const colour = colourMap.get(project);
  return (
    <Helmet>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href={`/images/${project}/apple-touch-icon.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`/images/${project}/favicon-32x32.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`/images/${project}/favicon-16x16.png`}
      />
      <link rel="manifest" href={`/${project}-${locale}.webmanifest`} />
      <link
        rel="mask-icon"
        href={`/images/${project}/safari-pinned-tab.svg`}
        color={colour}
      />
      <link rel="shortcut icon" href={`/images/${project}/favicon.ico`} />
      <meta name="msapplication-TileColor" content={colour} />
      <meta
        name="msapplication-config"
        content={`${project}.browserconfig.xml`}
      />
      <meta name="theme-color" content={colour} />
    </Helmet>
  );
};

export default Favicon;
