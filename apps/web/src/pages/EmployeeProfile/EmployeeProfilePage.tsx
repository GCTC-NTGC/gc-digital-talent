import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { navigationMessages } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { UnauthorizedError } from "@gc-digital-talent/helpers";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import { isVerifiedGovEmployee } from "~/utils/userUtils";
import profileMessages from "~/messages/profileMessages";

const EmployeeProfile_Fragment = graphql(/** GraphQL */ `
  fragment EmployeeProfile on User {
    isGovEmployee
    workEmail
    isWorkEmailVerified
  }
`);

interface EmployeeProfileProps {
  userQuery: FragmentType<typeof EmployeeProfile_Fragment>;
}

const EmployeeProfile = ({ userQuery }: EmployeeProfileProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const user = getFragment(EmployeeProfile_Fragment, userQuery);
  const { isGovEmployee, workEmail, isWorkEmailVerified } = user;

  if (
    !isVerifiedGovEmployee({ isGovEmployee, workEmail, isWorkEmailVerified })
  ) {
    throw new UnauthorizedError();
  }

  const pageTitle = intl.formatMessage({
    defaultMessage: "Your empoloyee profile",
    id: "HwW7BZ",
    description: "Page title for a users employee profile",
  });

  const subtitle = intl.formatMessage({
    defaultMessage:
      "Manage your government employee information, including talent mobility preferences and work styles.",
    id: "q8vDUx",
    description: "Description of the employee profile page",
  });

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(navigationMessages.profileAndApplications),
        url: paths.profileAndApplications(),
      },
      {
        url: paths.employeeProfile(),
        label: pageTitle,
      },
    ],
  });

  return (
    <>
      <SEO title={pageTitle} description={subtitle} />
      <Hero title={pageTitle} subtitle={subtitle} crumbs={crumbs} />
    </>
  );
};

const EmployeeProfilePage_Query = graphql(/** GraphQL */ `
  query EmployeeProfilePage {
    me {
      ...EmployeeProfile
    }
  }
`);

const EmployeeProfilePage = () => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useQuery({
    query: EmployeeProfilePage_Query,
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.me ? (
        <EmployeeProfile userQuery={data.me} />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(profileMessages.userNotFound)}
        />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <EmployeeProfilePage />
  </RequireAuth>
);

Component.displayName = "EmployeeProfilePage";
