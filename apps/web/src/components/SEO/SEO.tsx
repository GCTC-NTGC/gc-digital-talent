import React from "react";
import { Helmet } from "react-helmet-async";
import { useIntl } from "react-intl";

import { useLocale } from "@gc-digital-talent/i18n";

import Favicon from "./Favicon";

interface SEOProps {
  // Only accept strings to prevent HTML being passed
  title?: string;
  description?: string;
  // SEE: https://ogp.me/#types
  type?: "article" | "profile" | "website";
}

const SEO = ({ title, description, type = "website" }: SEOProps) => {
  const intl = useIntl();
  const { locale } = useLocale();
  const defaultTitle = intl.formatMessage({
    id: "vD6Uia",
    defaultMessage: "GC Digital Talent",
    description: "Default title for the site",
  });

  const defaultDescription = intl.formatMessage({
    id: "jRmRd+",
    defaultMessage:
      "GC Digital Talent is the new recruitment platform for digital and tech jobs in the Government of Canada. Apply now!",
    description: "Meta tag description for Talent Search site",
  });

  const seo = {
    title: title ? `${title} | ${defaultTitle}` : defaultTitle,
    description: description || defaultDescription,
    type,
  };

  return (
    <Helmet>
      <html lang={locale} />
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta property="og:type" content={seo.type} />
      <meta property="og:site_name" content={defaultTitle} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:locale" content={locale} />
      <meta name="twitter:card" content={seo.type} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
    </Helmet>
  );
};

export { Favicon };
export default SEO;
