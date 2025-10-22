import { useIntl } from "react-intl";
import { OperationContext, useQuery } from "urql";

import {
  Pending,
  ResourceBlock,
  NotFound,
  Container,
  Ul,
  StatusItem,
  Link,
  Button,
} from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import {
  graphql,
  getFragment,
  ApplicantDashboardQuery,
} from "@gc-digital-talent/graphql";
import { commonMessages, navigationMessages } from "@gc-digital-talent/i18n";
import { NotFoundError } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";
import SEO from "~/components/SEO/SEO";
import { getFullNameHtml } from "~/utils/nameUtils";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import Hero from "~/components/Hero";
import messages from "~/messages/profileMessages";
import {
  governmentInformationSectionHasEmptyRequiredFields,
  languageInformationSectionHasEmptyRequiredFields,
  workPreferencesSectionHasEmptyRequiredFields,
} from "~/validators/profile";
import { careerDevelopmentHasEmptyRequiredFields } from "~/validators/employeeProfile";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import WfaBanner from "~/components/WfaBanner/WfaBanner";
import UnlockEmployeeToolsDialog from "~/components/UnlockEmployeeToolsDialog/UnlockEmployeeToolsDialog";

import CareerDevelopmentTaskCard from "./components/CareerDevelopmentTaskCard";
import ApplicationsProcessesTaskCard from "./components/ApplicationsProcessesTaskCard";
import TalentManagementTaskCard from "./components/TalentManagementTaskCard";

export const ApplicantDashboardPage_Fragment = graphql(/* GraphQL */ `
  fragment ApplicantDashboardPage on User {
    firstName
    lastName
    isGovEmployee
    isVerifiedGovEmployee
    hasPriorityEntitlement
    priorityNumber
    telephone
    email
    preferredLang {
      value
      label {
        localized
      }
    }
    preferredLanguageForInterview {
      value
      label {
        localized
      }
    }
    preferredLanguageForExam {
      value
      label {
        localized
      }
    }
    citizenship {
      value
      label {
        localized
      }
    }
    armedForcesStatus {
      value
      label {
        localized
      }
    }
    employeeProfile {
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
      communityInterests {
        id
      }
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
    flexibleWorkLocations {
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
    talentNominationsAsSubmitter {
      id
    }
    poolCandidateSearchRequests {
      id
    }
    ...TalentManagementTaskCard
    ...ApplicationsProcessesTaskCard
    ...CareerDevelopmentTaskCardUser
    ...UnlockEmployeeTools
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
    workPreferencesSectionHasEmptyRequiredFields(currentUser) ||
    governmentInformationSectionHasEmptyRequiredFields(currentUser) ||
    languageInformationSectionHasEmptyRequiredFields(currentUser)
      ? "error"
      : "success";

  const careerExperienceState =
    currentUser.experiences && currentUser.experiences?.length > 0
      ? "success"
      : "error";

  const skillsPortfolioState =
    currentUser.userSkills && currentUser.userSkills?.length > 0
      ? "success"
      : "optional";

  const employeeVerificationState = currentUser.isVerifiedGovEmployee
    ? "success"
    : "not done";

  const functionalCommunitiesState =
    currentUser.employeeProfile?.communityInterests &&
    currentUser.employeeProfile.communityInterests.length > 0
      ? "success"
      : "optional";

  const careerPlanningState = careerDevelopmentHasEmptyRequiredFields(
    currentUser.employeeProfile ?? {},
  )
    ? "error"
    : "success";

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
          <WfaBanner />
          <div className="flex flex-col gap-6 xs:flex-row">
            <div className="flex flex-col gap-6">
              <ApplicationsProcessesTaskCard
                applicationsProcessesTaskCardQuery={currentUser}
              />
              {currentUser?.employeeProfile ? (
                <CareerDevelopmentTaskCard
                  userQuery={currentUser}
                  optionsQuery={applicantDashboardQuery}
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
                  defaultMessage: "Your account",
                  id: "CBedVL",
                  description: "Nav menu trigger for account links sub menu",
                })}
              >
                <ResourceBlock.RawContentItem
                  title={intl.formatMessage({
                    defaultMessage: "Applicant profile",
                    id: "zn0wg9",
                    description: "Title of a resource card with profile links",
                  })}
                  as="h3"
                >
                  <Ul unStyled space="sm" className="mt-3">
                    <li>
                      <Link href={paths.profile()} color="black">
                        <StatusItem
                          status={personalInformationState}
                          title={intl.formatMessage(
                            navigationMessages.profilePage,
                          )}
                        />
                      </Link>
                    </li>
                    <li>
                      <Link href={paths.careerTimeline()} color="black">
                        <StatusItem
                          status={careerExperienceState}
                          title={intl.formatMessage(
                            navigationMessages.careerExperience,
                          )}
                        />
                      </Link>
                    </li>
                    <li>
                      <Link href={paths.skillPortfolio()} color="black">
                        <StatusItem
                          status={skillsPortfolioState}
                          title={intl.formatMessage(
                            navigationMessages.skillPortfolio,
                          )}
                        />
                      </Link>
                    </li>
                  </Ul>
                </ResourceBlock.RawContentItem>

                <ResourceBlock.RawContentItem
                  title={intl.formatMessage(
                    navigationMessages.employeeProfileGC,
                  )}
                  as="h3"
                >
                  <Ul unStyled space="sm" className="mt-3">
                    <li>
                      <UnlockEmployeeToolsDialog query={currentUser}>
                        <Button mode="text" color="black">
                          <StatusItem
                            status={employeeVerificationState}
                            title={intl.formatMessage({
                              defaultMessage: "Employee verification",
                              id: "VpjQL1",
                              description:
                                "Label for status of employee verification",
                            })}
                          />
                        </Button>
                      </UnlockEmployeeToolsDialog>
                    </li>
                    <li>
                      {currentUser.isVerifiedGovEmployee ? (
                        // is a verified gov employee
                        <Link
                          href={paths.createCommunityInterest()}
                          color="black"
                        >
                          <StatusItem
                            status={functionalCommunitiesState}
                            title={intl.formatMessage({
                              defaultMessage: "Functional communities",
                              id: "QuVtMh",
                              description:
                                "Label for functional communities field",
                            })}
                          />
                        </Link>
                      ) : (
                        // is not a verified gov employee
                        <UnlockEmployeeToolsDialog query={currentUser}>
                          <Button mode="text" color="black">
                            <StatusItem
                              status="locked"
                              title={intl.formatMessage({
                                defaultMessage: "Functional communities",
                                id: "QuVtMh",
                                description:
                                  "Label for functional communities field",
                              })}
                            />
                          </Button>
                        </UnlockEmployeeToolsDialog>
                      )}
                    </li>
                    <li>
                      {currentUser.isVerifiedGovEmployee ? (
                        // is a verified gov employee
                        <Link
                          href={`${paths.employeeProfile()}#career-planning-section`}
                          color="black"
                        >
                          <StatusItem
                            status={careerPlanningState}
                            title={intl.formatMessage(
                              commonMessages.careerPlanning,
                            )}
                          />
                        </Link>
                      ) : (
                        // is not a verified gov employee
                        <UnlockEmployeeToolsDialog query={currentUser}>
                          <Button mode="text" color="black">
                            <StatusItem
                              status="locked"
                              title={intl.formatMessage(
                                commonMessages.careerPlanning,
                              )}
                            />
                          </Button>
                        </UnlockEmployeeToolsDialog>
                      )}
                    </li>
                  </Ul>
                </ResourceBlock.RawContentItem>

                <ResourceBlock.SingleLinkItem
                  as="h3"
                  title={intl.formatMessage({
                    defaultMessage: "Settings and privacy",
                    id: "6I6YTz",
                    description: "Link to the account settings page",
                  })}
                  href={paths.accountSettings()}
                  description={intl.formatMessage({
                    defaultMessage:
                      "Name, contact info, privacy settings, notifications, and more.",
                    id: "zniUBO",
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
  additionalTypenames: [
    "PoolCandidateSearchRequest",
    "OffPlatformRecruitmentProcess",
  ],
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
