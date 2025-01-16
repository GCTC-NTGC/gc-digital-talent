/* eslint-disable import/no-unused-modules */
import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { Pending } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { User, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import SEO from "~/components/SEO/SEO";
import { getFullNameHtml } from "~/utils/nameUtils";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import Hero from "~/components/Hero";

export interface CreateCommunityInterestPageProps {
  currentUser?: User | null;
}

export const CreateCommunityInterestPage = ({
  currentUser,
}: CreateCommunityInterestPageProps) => {
  const intl = useIntl();

  return (
    <>
      <SEO title={""} description={""} />
      <Hero
        title={intl.formatMessage(
          {
            defaultMessage: "Hello, {name}",
            id: "lLeH+o",
            description: "Hellow world message",
          },
          {
            name: currentUser
              ? getFullNameHtml(
                  currentUser.firstName,
                  currentUser.lastName,
                  intl,
                )
              : intl.formatMessage(commonMessages.notAvailable),
          },
        )}
        subtitle={""}
      />
    </>
  );
};

const CreateCommunityInterest_Query = graphql(/* GraphQL */ `
  query CreateCommunityInterest_Query {
    me {
      id
      firstName
      lastName
    }
  }
`);

export const CreateCommunityInterestPageApi = () => {
  const [{ data, fetching, error }] = useQuery({
    query: CreateCommunityInterest_Query,
  });

  return (
    <Pending fetching={fetching} error={error}>
      <CreateCommunityInterestPage currentUser={data?.me} />
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <CreateCommunityInterestPageApi />
  </RequireAuth>
);

Component.displayName = "CreateCommunityInterestPage";
