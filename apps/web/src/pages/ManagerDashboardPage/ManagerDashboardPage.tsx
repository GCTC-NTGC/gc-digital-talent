import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { ThrowNotFound, Pending } from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import profileMessages from "~/messages/profileMessages";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

export const ManagerDashboardUser_Fragment = graphql(/* GraphQL */ `
  fragment ManagerDashboardUser on User {
    id
  }
`);

interface ManagerDashboardProps {
  userQuery: FragmentType<typeof ManagerDashboardUser_Fragment>;
}

const ManagerDashboard = ({ userQuery }: ManagerDashboardProps) => {
  const intl = useIntl();
  const user = getFragment(ManagerDashboardUser_Fragment, userQuery);

  return (
    <>
      <SEO
        title={intl.formatMessage(navigationMessages.profileAndApplications)}
        description={intl.formatMessage({
          defaultMessage:
            "Manage your talent searches and curate your manager profile.",
          id: "KSnS+B",
          description: "SEO description for the manager dashboard",
        })}
      />
      This is the manger dashboard
    </>
  );
};

const ManagerDashboard_Query = graphql(/* GraphQL */ `
  query ManagerDashboard {
    me {
      ...ManagerDashboardUser
    }
  }
`);

const ManagerDashboardPage = () => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useQuery({
    query: ManagerDashboard_Query,
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.me ? (
        <ManagerDashboard userQuery={data.me} />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(profileMessages.userNotFound)}
        />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Manager]}>
    <ManagerDashboardPage />
  </RequireAuth>
);

Component.displayName = "ManagerDashboardPage";

export default ManagerDashboardPage;
