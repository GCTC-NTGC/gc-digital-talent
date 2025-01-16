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

export interface UpdateCommunityInterestPageProps {
  currentUser?: User | null;
}

export const UpdateCommunityInterestPage = ({
  currentUser,
}: UpdateCommunityInterestPageProps) => {
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

const UpdateCommunityInterest_Query = graphql(/* GraphQL */ `
  query UpdateCommunityInterest_Query {
    me {
      id
      firstName
      lastName
    }
  }
`);

export const UpdateCommunityInterestPageApi = () => {
  const [{ data, fetching, error }] = useQuery({
    query: UpdateCommunityInterest_Query,
  });

  return (
    <Pending fetching={fetching} error={error}>
      <UpdateCommunityInterestPage currentUser={data?.me} />
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <UpdateCommunityInterestPageApi />
  </RequireAuth>
);

Component.displayName = "UpdateCommunityInterestPage";
