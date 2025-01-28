/* eslint-disable import/no-unused-modules */
import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { Pending, ResourceBlock } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import {
  graphql,
  ApplicantDashboard_QueryQuery as ApplicantDashboardQueryType,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";
import SEO from "~/components/SEO/SEO";
import { getFullNameHtml } from "~/utils/nameUtils";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import Hero from "~/components/Hero";
import { isVerifiedGovEmployee } from "~/utils/userUtils";

import CareerDevelopmentTaskCard from "./components/CareerDevelopmentTaskCard";

export interface DashboardPageProps {
  currentUser?: ApplicantDashboardQueryType["me"];
}

export const DashboardPage = ({ currentUser }: DashboardPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const isVerifiedEmployee = isVerifiedGovEmployee({
    isGovEmployee: currentUser?.isGovEmployee,
    workEmail: currentUser?.workEmail,
    isWorkEmailVerified: currentUser?.isWorkEmailVerified,
  });

  const moveInterestsMapped = currentUser?.employeeProfile?.moveInterest
    ? currentUser.employeeProfile.moveInterest.map((interest) => interest.value)
    : null;
  const organizationTypeInterestsMapped = currentUser?.employeeProfile
    ?.organizationTypeInterest
    ? currentUser.employeeProfile.organizationTypeInterest.map(
        (interest) => interest.value,
      )
    : null;
  const communityInterestsQuery = unpackMaybes(
    currentUser?.employeeProfile?.communityInterests,
  );

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
            {isVerifiedEmployee ? (
              <CareerDevelopmentTaskCard
                moveInterests={moveInterestsMapped}
                organizationTypeInterests={organizationTypeInterestsMapped}
                communityInterestsQuery={communityInterestsQuery}
              ></CareerDevelopmentTaskCard>
            ) : null}
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
  query ApplicantDashboard_Query {
    me {
      id
      firstName
      lastName
      isGovEmployee
      workEmail
      isWorkEmailVerified
      employeeProfile {
        moveInterest {
          value
        }
        organizationTypeInterest {
          value
        }
        communityInterests {
          id
          ...PreviewListItemFunctionalCommunity
        }
      }
    }
  }
`);

export const ApplicantDashboardPageApi = () => {
  const [{ data, fetching, error }] = useQuery({
    query: ApplicantDashboard_Query,
  });

  return (
    <Pending fetching={fetching} error={error}>
      <DashboardPage currentUser={data?.me} />
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <ApplicantDashboardPageApi />
  </RequireAuth>
);

Component.displayName = "ApplicantDashboardPage";
