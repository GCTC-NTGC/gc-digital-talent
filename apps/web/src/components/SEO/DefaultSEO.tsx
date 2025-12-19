import { Helmet } from "react-helmet-async";

import { env } from "~/utils/env";

const DEFAULT_TITLE =
  env.APP_TITLE ?? "GC Digital Talent | Talents numériques du GC";

const DEFAULT_DESCRIPTION =
  env.APP_DESCRIPTION ??
  "Recruitment platform for digital jobs in the Government of Canada. Plateforme de recrutement pour les emplois numériques au gouvernement du Canada.";

const APP_URL = "https://talent.canada.ca";
const DEFAULT_IMAGE = `${APP_URL}/images/digital-talent/banner.jpg`;

export function DefaultMeta() {
  return (
    <Helmet>
      <title key="title">{DEFAULT_TITLE}</title>
      <meta
        name="description"
        content={DEFAULT_DESCRIPTION}
        key="description"
      />

      <meta property="og:type" content="website" key="og:type" />
      <meta property="og:title" content={DEFAULT_TITLE} key="og:title" />
      <meta
        property="og:description"
        content={DEFAULT_DESCRIPTION}
        key="og:description"
      />
      <meta property="og:url" content={APP_URL} key="og:url" />
      <meta property="og:image" content={DEFAULT_IMAGE} key="og:image" />

      <meta
        name="twitter:card"
        content="summary_large_image"
        key="twitter:card"
      />
      <meta name="twitter:title" content={DEFAULT_TITLE} key="twitter:title" />
      <meta
        name="twitter:description"
        content={DEFAULT_DESCRIPTION}
        key="twitter:description"
      />
      <meta name="twitter:image" content={DEFAULT_IMAGE} key="twitter:image" />
      <meta name="twitter:url" content={APP_URL} key="twitter:url" />
    </Helmet>
  );
}
