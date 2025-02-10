/* eslint-disable import/no-unused-modules */
import { useIntl } from "react-intl";
import { useQuery } from "urql";

import {
  Pending,
  Separator,
  ResourceBlock,
  NotFound,
} from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { graphql, FragmentType, getFragment } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import useRoutes from "~/hooks/useRoutes";
import SEO from "~/components/SEO/SEO";
import { getFullNameHtml } from "~/utils/nameUtils";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import Hero from "~/components/Hero";
import { isVerifiedGovEmployee } from "~/utils/userUtils";
import messages from "~/messages/profileMessages";
import {
  aboutSectionHasEmptyRequiredFields,
  governmentInformationSectionHasEmptyRequiredFields,
  languageInformationSectionHasEmptyRequiredFields,
  workPreferencesSectionHasEmptyRequiredFields,
} from "~/validators/profile";

import ReviewApplicationPreviewList from "./components/ReviewApplicationPreviewList";
import ReviewRecruitmentProcessPreviewList from "./components/ReviewRecruitmentProcessPreviewList";
import CareerDevelopmentTaskCard from "./components/CareerDevelopmentTaskCard";

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
      ...ReviewApplicationPreviewList
      ...ReviewRecruitmentProcessPreviewList
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
      skill {
        id
        key
        name {
          en
          fr
        }
        category {
          value
          label {
            en
            fr
          }
        }
      }
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

  const personalInformationState =
    aboutSectionHasEmptyRequiredFields(currentUser) ||
    governmentInformationSectionHasEmptyRequiredFields(currentUser) ||
    languageInformationSectionHasEmptyRequiredFields(currentUser) ||
    workPreferencesSectionHasEmptyRequiredFields(currentUser)
      ? "complete"
      : "incomplete";

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
        title={intl.formatMessage({
          defaultMessage: "Applicant dashboard",
          id: "tFpXkQ",
          description: "SEO title for applicant dashboard",
        })}
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
              <ReviewApplicationPreviewList
                applicationsQuery={unpackMaybes(currentUser?.poolCandidates)}
              />
              {/* Temporary separator till https://github.com/GCTC-NTGC/gc-digital-talent/issues/10772 */}
              <Separator data-h2-margin="base(0)" decorative />
              <ReviewRecruitmentProcessPreviewList
                recruitmentProcessesQuery={unpackMaybes(
                  currentUser?.poolCandidates,
                )}
              />
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
                headingColor="quaternary"
                headingAs="h2"
                title={intl.formatMessage({
                  defaultMessage: "Your information",
                  id: "Jlk0bi",
                  description: "Card title for a 'your information' card",
                })}
              >
                <ResourceBlock.SingleLinkItem
                  state={personalInformationState}
                  title={intl.formatMessage({
                    defaultMessage: "Personal information",
                    id: "3v6Tmi",
                    description: "Link to the 'Personal information' page",
                  })}
                  href={paths.careerTimelineAndRecruitment()}
                  description={intl.formatMessage({
                    defaultMessage:
                      "Name, contact info, employment equity, language proficiency, and work preferences.",
                    id: "aDCqiX",
                    description:
                      "Helper instructions for an 'Personal information' card",
                  })}
                />
                <ResourceBlock.SingleLinkItem
                  state={careerExperienceState}
                  title={intl.formatMessage({
                    defaultMessage: "Career experience",
                    id: "UfjJ9P",
                    description: "Link to the 'Career experience' page",
                  })}
                  href={paths.careerTimelineAndRecruitment()}
                  description={intl.formatMessage({
                    defaultMessage:
                      "Work, education, volunteering, awards, and more.",
                    id: "RSUZix",
                    description:
                      "Helper instructions for an 'Career experience' card",
                  })}
                />
                <ResourceBlock.SingleLinkItem
                  state={skillsPortfolioState}
                  title={intl.formatMessage({
                    defaultMessage: "Skills portfolio",
                    id: "UmlE9r",
                    description: "Link to the 'Skills portfolio' page",
                  })}
                  href={paths.skillPortfolio()}
                  description={intl.formatMessage({
                    defaultMessage:
                      "Manage skills, and edit top skills or skills you'd like to learn.",
                    id: "gCDfWw",
                    description:
                      "Helper instructions for an 'Skills portfolio' card",
                  })}
                />
                <ResourceBlock.SingleLinkItem
                  state="complete"
                  title={intl.formatMessage({
                    defaultMessage: "Account settings",
                    id: "dEMBDa",
                    description: "Link to the 'Account settings' page",
                  })}
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
                      "Browse a complete list of available skills and learn how they’re organized.",
                    id: "mluvY2",
                    description: "the 'Learn about skills' tool description",
                  })}
                />
                <ResourceBlock.SingleLinkItem
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
