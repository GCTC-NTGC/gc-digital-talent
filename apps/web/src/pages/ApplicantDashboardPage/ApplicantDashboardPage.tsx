/* eslint-disable import/no-unused-modules */
import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { Pending, ResourceBlock, NotFound } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { graphql, FragmentType, getFragment } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";
import SEO from "~/components/SEO/SEO";
import { getFullNameHtml } from "~/utils/nameUtils";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import Hero from "~/components/Hero";
import { isVerifiedGovEmployee } from "~/utils/userUtils";
import messages from "~/messages/profileMessages";

import CareerDevelopmentTaskCard from "./components/CareerDevelopmentTaskCard";
import ApplicationsProcessesTaskCard from "./components/ApplicationsProcessesTaskCard";

export const ApplicantDashboardPage_Fragment = graphql(/* GraphQL */ `
  fragment ApplicantDashboardPage on User {
    id
    firstName
    lastName
    isGovEmployee
    workEmail
    isWorkEmailVerified
    employeeProfile {
      ...CareerDevelopmentTaskCard
    }
    poolCandidates {
      ...ApplicationsProcessesTaskCard
    }
  }
`);

interface DashboardPageProps {
  applicantDashboardQuery: FragmentType<typeof ApplicantDashboardPage_Fragment>;
}

export const DashboardPage = ({
  applicantDashboardQuery,
}: DashboardPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const currentUser = getFragment(
    ApplicantDashboardPage_Fragment,
    applicantDashboardQuery,
  );

  const isVerifiedEmployee = isVerifiedGovEmployee({
    isGovEmployee: currentUser.isGovEmployee,
    workEmail: currentUser.workEmail,
    isWorkEmailVerified: currentUser.isWorkEmailVerified,
  });

  return (
    <>
      <SEO title={""} description={""} />
      <Hero
        title={intl.formatMessage(
          {
            defaultMessage:
              "Welcome back<hidden> to your applicant dashboard</hidden>, {name}",
            id: "bw4CAS",
            description:
              "Title for applicant dashboard on the talent cloud admin portal.",
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
      <section data-h2-margin="base(x3, 0)">
        <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column) p-tablet(row)"
            data-h2-gap="base(x1)"
          >
            <div
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
              data-h2-gap="base(x1)"
            >
              {currentUser?.poolCandidates ? (
                <ApplicationsProcessesTaskCard
                  applicationsProcessesTaskCardQuery={unpackMaybes(
                    currentUser?.poolCandidates,
                  )}
                />
              ) : null}
              {isVerifiedEmployee && currentUser?.employeeProfile ? (
                <CareerDevelopmentTaskCard
                  careerDevelopmentTaskCardQuery={currentUser.employeeProfile}
                />
              ) : null}
            </div>
            <div
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
              data-h2-gap="base(x1)"
              data-h2-max-width="p-tablet(x14)"
            >
              <ResourceBlock.Root
                headingColor="tertiary"
                headingAs="h2"
                title={intl.formatMessage({
                  defaultMessage: "Resources",
                  id: "nGSUzp",
                  description: "Card title for a 'resources' card",
                })}
              >
                <ResourceBlock.SingleLinkItem
                  title={intl.formatMessage({
                    defaultMessage: "Learn about skills",
                    id: "n40Nry",
                    description: "Link for the 'learn about skills' card",
                  })}
                  href={paths.skills()}
                  description={intl.formatMessage({
                    defaultMessage:
                      "Browse a complete list of available skills, learn how they’re organized, and recommend additional skills to include.",
                    id: "CTBcGm",
                    description: "the 'Learn about skills' tool description",
                  })}
                />
              </ResourceBlock.Root>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const ApplicantDashboard_Query = graphql(/* GraphQL */ `
  query ApplicantDashboard {
    me {
      ...ApplicantDashboardPage
    }
  }
`);

export const ApplicantDashboardPageApi = () => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useQuery({
    query: ApplicantDashboard_Query,
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.me ? (
        <DashboardPage applicantDashboardQuery={data.me} />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>{intl.formatMessage(messages.userNotFound)}</p>
        </NotFound>
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <ApplicantDashboardPageApi />
  </RequireAuth>
);
Component.displayName = "ApplicantDashboardPage";
