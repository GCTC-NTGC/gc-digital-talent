import { useIntl } from "react-intl";
import { OperationContext, useQuery } from "urql";

import {
  Pending,
  ResourceBlock,
  NotFound,
  Container,
} from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import {
  graphql,
  getFragment,
  ApplicantDashboardQuery,
} from "@gc-digital-talent/graphql";
import { commonMessages, navigationMessages } from "@gc-digital-talent/i18n";
import { NotFoundError, unpackMaybes } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";
import SEO from "~/components/SEO/SEO";
import { getFullNameHtml } from "~/utils/nameUtils";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import Hero from "~/components/Hero";
import messages from "~/messages/profileMessages";
import {
  aboutSectionHasEmptyRequiredFields,
  governmentInformationSectionHasEmptyRequiredFields,
  languageInformationSectionHasEmptyRequiredFields,
  workPreferencesSectionHasEmptyRequiredFields,
} from "~/validators/profile";
import { careerDevelopmentHasEmptyRequiredFields } from "~/validators/employeeProfile";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";

import CareerDevelopmentTaskCard from "./components/CareerDevelopmentTaskCard";
import ApplicationsProcessesTaskCard from "./components/ApplicationsProcessesTaskCard";
import TalentManagementTaskCard from "./components/TalentManagementTaskCard";

export const ApplicantDashboardPage_Fragment = graphql(/* GraphQL */ `
  fragment ApplicantDashboardPage on User {
    id
    firstName
    lastName
    isGovEmployee
    isVerifiedGovEmployee
    hasPriorityEntitlement
    priorityNumber
    employeeProfile {
      ...CareerDevelopmentTaskCard
      lateralMoveInterest
      promotionMoveInterest
      eligibleRetirementYear
      eligibleRetirementYearKnown
      mentorshipStatus {
        label {
          localized
        }
        value
      }
      execInterest
      execCoachingStatus {
        label {
          localized
        }
        value
      }
    }
    poolCandidates {
      ...ApplicationsProcessesTaskCard
    }
    lookingForEnglish
    lookingForFrench
    lookingForBilingual
    estimatedLanguageAbility {
      value
      label {
        en
        fr
      }
    }
    firstOfficialLanguage {
      value
      label {
        en
        fr
      }
    }
    secondLanguageExamCompleted
    secondLanguageExamValidity
    writtenLevel {
      value
      label {
        en
        fr
      }
    }
    comprehensionLevel {
      value
      label {
        en
        fr
      }
    }
    verbalLevel {
      value
      label {
        en
        fr
      }
    }
    userSkills {
      id
    }
    acceptedOperationalRequirements {
      value
      label {
        en
        fr
      }
    }
    positionDuration
    locationPreferences {
      value
      label {
        en
        fr
      }
    }
    locationExemptions
    currentCity
    currentProvince {
      value
      label {
        en
        fr
      }
    }
    experiences {
      id
    }
    offPlatformRecruitmentProcesses
    talentNominationsAsSubmitter {
      id
    }
    poolCandidateSearchRequests {
      id
    }
    ...TalentManagementTaskCard
  }
`);

interface DashboardPageProps {
  applicantDashboardQuery: ApplicantDashboardQuery;
}

export const DashboardPage = ({
  applicantDashboardQuery,
}: DashboardPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(navigationMessages.applicantDashboard),
        url: paths.applicantDashboard(),
      },
    ],
  });

  const currentUser = getFragment(
    ApplicantDashboardPage_Fragment,
    applicantDashboardQuery.me,
  );

  if (!currentUser) {
    throw new NotFoundError();
  }

  const displayTalentManagementTaskCard =
    !!currentUser?.talentNominationsAsSubmitter?.length ||
    !!currentUser?.poolCandidateSearchRequests?.length;

  const personalInformationState =
    aboutSectionHasEmptyRequiredFields(currentUser) ||
    governmentInformationSectionHasEmptyRequiredFields(currentUser) ||
    languageInformationSectionHasEmptyRequiredFields(currentUser) ||
    workPreferencesSectionHasEmptyRequiredFields(currentUser)
      ? "complete"
      : "incomplete";

  const employeeProfileState = careerDevelopmentHasEmptyRequiredFields(
    currentUser?.employeeProfile ?? {},
  )
    ? "incomplete"
    : "complete";

  const careerExperienceState =
    currentUser.experiences && currentUser.experiences?.length > 0
      ? "complete"
      : "incomplete";

  const skillsPortfolioState =
    currentUser.userSkills && currentUser.userSkills?.length > 0
      ? "complete"
      : "incomplete";

  return (
    <>
      <SEO
        title={intl.formatMessage(navigationMessages.applicantDashboard)}
        description={intl.formatMessage({
          defaultMessage:
            "Track job applications and manage your applicant information, including career experience, skills portfolio, and more.",
          id: "zsjK3M",
          description: "Subtitle for applicant dashboard",
        })}
      />
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
        subtitle={intl.formatMessage({
          defaultMessage:
            "Track job applications and manage your applicant information, including career experience, skills portfolio, and more.",
          id: "zsjK3M",
          description: "Subtitle for applicant dashboard",
        })}
        crumbs={crumbs}
      />
      <section className="my-18">
        <Container>
          <div className="flex flex-col gap-6 xs:flex-row">
            <div className="flex flex-col gap-6">
              <ApplicationsProcessesTaskCard
                applicationsProcessesTaskCardQuery={unpackMaybes(
                  currentUser?.poolCandidates,
                )}
                userId={currentUser.id}
                offPlatformRecruitmentProcesses={
                  currentUser.offPlatformRecruitmentProcesses
                }
              />
              {currentUser?.isVerifiedGovEmployee &&
              currentUser?.employeeProfile ? (
                <CareerDevelopmentTaskCard
                  careerDevelopmentTaskCardQuery={currentUser.employeeProfile}
                  careerDevelopmentOptionsQuery={applicantDashboardQuery}
                />
              ) : null}
              {displayTalentManagementTaskCard ? (
                <TalentManagementTaskCard
                  talentManagementTaskCardQuery={currentUser}
                />
              ) : null}
            </div>
            <div className="flex shrink-0 flex-col gap-6 xs:max-w-84">
              <ResourceBlock.Root
                headingColor="warning"
                headingAs="h2"
                title={intl.formatMessage({
                  defaultMessage: "Your information",
                  id: "Jlk0bi",
                  description: "Card title for a 'your information' card",
                })}
              >
                <ResourceBlock.SingleLinkItem
                  as="h3"
                  state={personalInformationState}
                  title={intl.formatMessage({
                    defaultMessage: "Personal information",
                    id: "g8Ur9z",
                    description:
                      "applicant dashboard card title for profile card",
                  })}
                  href={paths.profile()}
                  description={intl.formatMessage({
                    defaultMessage:
                      "Name, contact info, employment equity, language proficiency, and work preferences.",
                    id: "aDCqiX",
                    description:
                      "Helper instructions for an 'Personal information' card",
                  })}
                />
                {currentUser?.isVerifiedGovEmployee ? (
                  <ResourceBlock.SingleLinkItem
                    as="h3"
                    state={employeeProfileState}
                    title={intl.formatMessage(
                      navigationMessages.employeeProfileGC,
                    )}
                    href={paths.employeeProfile()}
                    description={intl.formatMessage({
                      defaultMessage:
                        "Career development preferences and career goals.",
                      id: "GBfPU+",
                      description:
                        "Helper instructions for an 'employee profile' card",
                    })}
                  />
                ) : null}
                <ResourceBlock.SingleLinkItem
                  as="h3"
                  state={careerExperienceState}
                  title={intl.formatMessage({
                    defaultMessage: "Career experience",
                    id: "UfjJ9P",
                    description: "Link to the 'Career experience' page",
                  })}
                  href={paths.careerTimeline()}
                  description={intl.formatMessage({
                    defaultMessage:
                      "Work, education, volunteering, awards, and more.",
                    id: "RSUZix",
                    description:
                      "Helper instructions for an 'Career experience' card",
                  })}
                />
                <ResourceBlock.SingleLinkItem
                  as="h3"
                  state={skillsPortfolioState}
                  title={intl.formatMessage(navigationMessages.skillPortfolio)}
                  href={paths.skillPortfolio()}
                  description={intl.formatMessage({
                    defaultMessage:
                      "Manage skills and edit top skills or skills you'd like to learn.",
                    id: "NUrFMU",
                    description:
                      "Helper instructions for an 'Skills portfolio' card",
                  })}
                />
                <ResourceBlock.SingleLinkItem
                  as="h3"
                  state="complete"
                  title={intl.formatMessage(navigationMessages.accountSettings)}
                  href={paths.accountSettings()}
                  description={intl.formatMessage({
                    defaultMessage:
                      "Learn about GCKey and manage notifications.",
                    id: "dj+m3H",
                    description:
                      "Helper instructions for an 'Account settings' card",
                  })}
                />
              </ResourceBlock.Root>
              <ResourceBlock.Root
                headingColor="error"
                headingAs="h2"
                title={intl.formatMessage({
                  defaultMessage: "Resources",
                  id: "nGSUzp",
                  description: "Card title for a 'resources' card",
                })}
              >
                <ResourceBlock.SingleLinkItem
                  as="h3"
                  title={intl.formatMessage({
                    defaultMessage: "Learn about skills",
                    id: "n40Nry",
                    description: "Link for the 'learn about skills' card",
                  })}
                  href={paths.skills()}
                  description={intl.formatMessage({
                    defaultMessage:
                      "Browse a complete list of available skills and learn how they’re organized.",
                    id: "mluvY2",
                    description: "the 'Learn about skills' tool description",
                  })}
                />
                <ResourceBlock.SingleLinkItem
                  as="h3"
                  title={intl.formatMessage({
                    defaultMessage: "Contact support",
                    id: "jRnA1D",
                    description: "Link for the 'contact support' card",
                  })}
                  href={paths.support()}
                  description={intl.formatMessage({
                    defaultMessage:
                      "Questions or need help? Get in touch with our support team and let us know how we can help.",
                    id: "s8ByY4",
                    description: "the 'contact support' tool description",
                  })}
                />
              </ResourceBlock.Root>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

const context: Partial<OperationContext> = {
  additionalTypenames: ["PoolCandidateSearchRequest"],
};

const ApplicantDashboard_Query = graphql(/* GraphQL */ `
  query ApplicantDashboard {
    me {
      ...ApplicantDashboardPage
    }
    ...CareerDevelopmentTaskCardOptions
  }
`);

export const ApplicantDashboardPageApi = () => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useQuery({
    query: ApplicantDashboard_Query,
    context,
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.me ? (
        <DashboardPage applicantDashboardQuery={data} />
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
