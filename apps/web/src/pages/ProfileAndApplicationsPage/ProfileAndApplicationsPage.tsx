import React from "react";
import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { ThrowNotFound, Pending } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import SEO from "~/components/SEO/SEO";
import profileMessages from "~/messages/profileMessages";

import ProfileAndApplicationsHeading from "./components/ProfileAndApplicationsHeading";
import TrackApplications from "./components/TrackApplications/TrackApplications";

export const ProfileAndApplicationsUser_Fragment = graphql(/* GraphQL */ `
  fragment ProfileAndApplicationsUser on User {
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
    firstOfficialLanguage
    secondLanguageExamCompleted
    secondLanguageExamValidity
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
    hasDiploma
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
        classification {
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
`);

interface ProfileAndApplicationsProps {
  userQuery: FragmentType<typeof ProfileAndApplicationsUser_Fragment>;
}

export const ProfileAndApplications = ({
  userQuery,
}: ProfileAndApplicationsProps) => {
  const intl = useIntl();
  const user = getFragment(ProfileAndApplicationsUser_Fragment, userQuery);
  const applications = user.poolCandidates?.filter(notEmpty) ?? [];

  return (
    <>
      <SEO
        title={intl.formatMessage(navigationMessages.profileAndApplications)}
        description={intl.formatMessage({
          defaultMessage:
            "Manage your personal information, career timeline, skills, and track applications.",
          id: "OyV6MH",
          description: "SEO description for profile and applications hero",
        })}
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
      ...ProfileAndApplicationsUser
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
        <ProfileAndApplications userQuery={data.me} />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(profileMessages.userNotFound)}
        />
      )}
    </Pending>
  );
};

export default ProfileAndApplicationsPage;
