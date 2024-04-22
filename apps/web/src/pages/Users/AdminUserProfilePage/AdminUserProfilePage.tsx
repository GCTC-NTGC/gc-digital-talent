import React from "react";
import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import {
  Scalars,
  graphql,
  FragmentType,
  getFragment,
} from "@gc-digital-talent/graphql";

import SEO from "~/components/SEO/SEO";
import UserProfile from "~/components/UserProfile";
import AdminAboutUserSection from "~/components/AdminAboutUserSection/AdminAboutUserSection";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRequiredParams from "~/hooks/useRequiredParams";

import SingleUserProfilePrintButton from "./components/SingleUserProfilePrintButton";

const AdminUserProfileUser_Fragment = graphql(/* GraphQL */ `
  fragment AdminUserProfileUser on User {
    id
    email
    firstName
    lastName
    telephone
    citizenship
    armedForcesStatus
    preferredLang
    preferredLanguageForInterview
    preferredLanguageForExam
    currentProvince
    currentCity
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
    govEmployeeType
    hasPriorityEntitlement
    priorityNumber
    locationPreferences
    locationExemptions
    positionDuration
    acceptedOperationalRequirements
    indigenousCommunities
    indigenousDeclarationSignature
    hasDisability
    isVisibleMinority
    isWoman
    poolCandidates {
      id
      status
      expiryDate
      notes
      suspendedAt
      user {
        id
      }
      pool {
        id
        name {
          en
          fr
        }
        classification {
          id
          group
          level
        }
        stream
        publishingGroup
        team {
          id
          name
          displayName {
            en
            fr
          }
        }
      }
    }
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
      skillLevel
      topSkillsRank
      improveSkillsRank
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
      skillLevel
      topSkillsRank
      improveSkillsRank
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
      skillLevel
      topSkillsRank
      improveSkillsRank
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
      skillLevel
      topSkillsRank
      improveSkillsRank
    }
  }
`);

interface AdminUserProfileProps {
  userQuery: FragmentType<typeof AdminUserProfileUser_Fragment>;
}

export const AdminUserProfile = ({ userQuery }: AdminUserProfileProps) => {
  const user = getFragment(AdminUserProfileUser_Fragment, userQuery);
  return (
    <>
      <div
        data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
        data-h2-text-align="base(right)"
      >
        <SingleUserProfilePrintButton
          users={[user]}
          color="primary"
          mode="solid"
        />
      </div>
      <UserProfile
        user={user}
        headingLevel="h3"
        sections={{
          about: {
            isVisible: true,
            override: <AdminAboutUserSection user={user} />,
          },
          language: { isVisible: true },
          government: { isVisible: true },
          workLocation: { isVisible: true },
          workPreferences: { isVisible: true },
          employmentEquity: { isVisible: true },
          careerTimelineAndRecruitment: { isVisible: true },
          skillShowcase: { isVisible: true },
        }}
      />
    </>
  );
};

const AdminUserProfile_Query = graphql(/* GraphQL */ `
  query AdminUserProfile($id: UUID!) {
    user(id: $id, trashed: WITH) {
      ...AdminUserProfileUser
    }
    pools {
      id
      name {
        en
        fr
      }
      stream
      classification {
        id
        group
        level
      }
      status
    }
  }
`);

type RouteParams = {
  userId: Scalars["ID"]["output"];
};

const AdminUserProfilePage = () => {
  const { userId } = useRequiredParams<RouteParams>("userId");
  const intl = useIntl();
  const [{ data, fetching, error }] = useQuery({
    query: AdminUserProfile_Query,
    variables: { id: userId || "" },
  });

  return (
    <AdminContentWrapper>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Candidate details",
          id: "dj8GiH",
          description: "Page title for the individual user page",
        })}
      />
      <Pending fetching={fetching} error={error}>
        {data?.user ? (
          <AdminUserProfile userQuery={data?.user} />
        ) : (
          <ThrowNotFound />
        )}
      </Pending>
    </AdminContentWrapper>
  );
};

export default AdminUserProfilePage;
