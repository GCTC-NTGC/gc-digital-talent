import React from "react";
import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { ThrowNotFound, Pending } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { graphql } from "@gc-digital-talent/graphql";

import SEO from "~/components/SEO/SEO";
import profileMessages from "~/messages/profileMessages";

import ProfileAndApplicationsHeading from "./components/ProfileAndApplicationsHeading";
import TrackApplications from "./components/TrackApplications/TrackApplications";
import { PartialUser } from "./types";

interface ProfileAndApplicationsProps {
  user: PartialUser;
}

export const ProfileAndApplications = ({
  user,
}: ProfileAndApplicationsProps) => {
  const intl = useIntl();
  const applications = user.poolCandidates?.filter(notEmpty) ?? [];

  return (
    <>
      <SEO
        title={intl.formatMessage(navigationMessages.profileAndApplications)}
      />
      <ProfileAndApplicationsHeading user={user} />
      <section data-h2-margin="base(x3, 0)">
        <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
          <div id="track-applications-section">
            <TrackApplications applications={applications} userId={user.id} />
          </div>
        </div>
      </section>
    </>
  );
};

const ProfileAndApplicationsApplicant_Query = graphql(/* GraphQL */ `
  query ProfileAndApplicationsApplicant {
    me {
      id
      firstName
      lastName
      email
      telephone
      preferredLang
      preferredLanguageForInterview
      preferredLanguageForExam
      currentProvince
      currentCity
      citizenship
      armedForcesStatus
      lookingForEnglish
      lookingForFrench
      lookingForBilingual
      bilingualEvaluation
      comprehensionLevel
      writtenLevel
      verbalLevel
      estimatedLanguageAbility
      isGovEmployee
      hasPriorityEntitlement
      priorityNumber
      govEmployeeType
      department {
        id
        departmentNumber
        name {
          en
          fr
        }
      }
      currentClassification {
        id
        group
        level
        name {
          en
          fr
        }
      }
      isWoman
      hasDisability
      indigenousCommunities
      indigenousDeclarationSignature
      indigenousCommunities
      indigenousDeclarationSignature
      isVisibleMinority
      locationPreferences
      locationExemptions
      acceptedOperationalRequirements
      positionDuration
      isProfileComplete
      experiences {
        id
        __typename
        user {
          id
          email
        }
        details
        skills {
          id
          key
          name {
            en
            fr
          }
          description {
            en
            fr
          }
          keywords {
            en
            fr
          }
          category
          experienceSkillRecord {
            details
          }
        }
        ... on AwardExperience {
          title
          issuedBy
          awardedDate
          awardedTo
          awardedScope
        }
        ... on CommunityExperience {
          title
          organization
          project
          startDate
          endDate
        }
        ... on EducationExperience {
          institution
          areaOfStudy
          thesisTitle
          startDate
          endDate
          type
          status
        }
        ... on PersonalExperience {
          title
          description
          startDate
          endDate
        }
        ... on WorkExperience {
          role
          organization
          division
          startDate
          endDate
        }
      }
      poolCandidates {
        id
        status
        archivedAt
        submittedAt
        suspendedAt
        pool {
          id
          closingDate
          name {
            en
            fr
          }
          publishingGroup
          stream
          classifications {
            id
            group
            level
            name {
              en
              fr
            }
            genericJobTitles {
              id
              key
              name {
                en
                fr
              }
            }
            minSalary
            maxSalary
          }
        }
      }
      userSkills {
        id
        user {
          id
        }
        skill {
          id
          key
          category
          name {
            en
            fr
          }
        }
      }
      topTechnicalSkillsRanking {
        id
        user {
          id
        }
        skill {
          id
          key
          category
          name {
            en
            fr
          }
        }
      }
      topBehaviouralSkillsRanking {
        id
        user {
          id
        }
        skill {
          id
          key
          category
          name {
            en
            fr
          }
        }
      }
      improveTechnicalSkillsRanking {
        id
        user {
          id
        }
        skill {
          id
          key
          category
          name {
            en
            fr
          }
        }
      }
      improveBehaviouralSkillsRanking {
        id
        user {
          id
        }
        skill {
          id
          key
          category
          name {
            en
            fr
          }
        }
      }
    }
  }
`);

const ProfileAndApplicationsPage = () => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useQuery({
    query: ProfileAndApplicationsApplicant_Query,
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.me ? (
        <ProfileAndApplications user={data.me} />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(profileMessages.userNotFound)}
        />
      )}
    </Pending>
  );
};

export default ProfileAndApplicationsPage;
