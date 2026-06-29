import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { Card, Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { graphql } from "@gc-digital-talent/graphql";
import { setInLocalStorage } from "@gc-digital-talent/storage";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import profileMessages from "~/messages/profileMessages";
import { KEY_NEW_USER_LANGUAGE_PRESET } from "~/constants/storageKeys";

import messages from "../messages";
import GettingStartedForm, {
  sectionTitle as gettingStartedSectionTitle,
} from "./GettingStartedForm";

const GettingStarted_Query = graphql(/** GraphQL */ `
  query GettingStarted {
    me {
      id
      ...GettingStartedInitialValues
    }
  }
`);

export const GettingStartedPage = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const [{ data, fetching, error }] = useQuery({
    query: GettingStarted_Query,
  });

  // someone on this page is probably a new user so enable the new user flags
  setInLocalStorage<boolean>(KEY_NEW_USER_LANGUAGE_PRESET, true);

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(messages.breadcrumb),
        url: paths.registrationAccount(),
      },
    ],
  });

  return (
    <>
      <SEO
        title={intl.formatMessage(gettingStartedSectionTitle)}
        description={intl.formatMessage(messages.subtitle)}
      />
      <Hero
        title={intl.formatMessage(messages.title)}
        subtitle={intl.formatMessage(messages.subtitle)}
        crumbs={crumbs}
        overlap
        centered
      >
        <section className="mb-18">
          <Card space="lg">
            <Pending fetching={fetching} error={error}>
              {data?.me ? (
                <GettingStartedForm initialValuesQuery={data.me} />
              ) : (
                <ThrowNotFound
                  message={intl.formatMessage(profileMessages.userNotFound)}
                />
              )}
            </Pending>
          </Card>
        </section>
      </Hero>
    </>
  );
};
