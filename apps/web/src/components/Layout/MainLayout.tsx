import {
  LoaderFunctionArgs,
  useLoaderData,
  useSearchParams,
} from "react-router";
import { IntlShape } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";

import useLayoutTheme from "~/hooks/useLayoutTheme";
import { intlContext, IntlContext } from "~/middleware/intlMiddleware";
import { RouteContext } from "~/middleware/routeContext";

import Layout from "./Layout";

interface ClientLoaderData {
  intl: IntlShape;
  message: string;
}

export const clientLoader = ({
  context,
}: LoaderFunctionArgs<RouteContext<IntlContext>>): ClientLoaderData => {
  const intl = context.get(intlContext);
  // We can return either the IntlShape or, translate a message directly here
  return {
    intl,
    message: intl.formatMessage(commonMessages.yes),
  };
};

export const Component = () => {
  const { intl, message } = useLoaderData<ClientLoaderData>();
  useLayoutTheme("default");

  console.log({
    intl,
    loaderMessage: message,
    componentMessage: intl.formatMessage(commonMessages.yes),
  });

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
