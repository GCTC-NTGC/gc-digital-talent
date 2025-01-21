import { useIntl } from "react-intl";
import { useSearchParams } from "react-router";

import { commonMessages } from "@gc-digital-talent/i18n";

import useLayoutTheme from "~/hooks/useLayoutTheme";

import Layout from "./Layout";

export const Component = () => {
  const intl = useIntl();
  useLayoutTheme("default");

  const [searchParams] = useSearchParams();

  const iapPersonality = searchParams.get("personality") === "iap";

  return (
    <Layout
      project="digital-talent"
      title={intl.formatMessage(commonMessages.projectTitle)}
      description={intl.formatMessage({
        defaultMessage:
          "GC Digital Talent is the new recruitment platform for digital and tech jobs in the Government of Canada. Apply now!",
        id: "jRmRd+",
        description: "Meta tag description for Talent Search site",
      })}
      iapPersonality={iapPersonality}
    />
  );
};

Component.displayName = "MainLayout";

export default Component;
