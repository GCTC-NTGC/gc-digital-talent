import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import {
  Scalars,
  graphql,
  FragmentType,
  getFragment,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import UserProfile from "~/components/UserProfile";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRequiredParams from "~/hooks/useRequiredParams";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useUserDownloads from "~/hooks/useUserDownloads";
import DownloadUsersDocButton from "~/components/DownloadButton/DownloadUsersDocButton";

const AdminUserProfileUser_Fragment = graphql(/* GraphQL */ `
  fragment AdminUserProfileUser on User {
    id
    email
    firstName
    lastName
    telephone
    citizenship {
      value
      label {
        en
        fr
      }
    }
    armedForcesStatus {
      value
      label {
        en
        fr
      }
    }
    preferredLang {
      value
      label {
        en
        fr
      }
    }
    preferredLanguageForInterview {
      value
      label {
        en
        fr
      }
    }
    preferredLanguageForExam {
      value
      label {
        en
        fr
      }
    }
    currentProvince {
      value
      label {
        en
        fr
      }
    }
    currentCity
    lookingForEnglish
    lookingForFrench
    lookingForBilingual
    firstOfficialLanguage {
      value
      label {
        en
        fr
      }
    }
    secondLanguageExamCompleted
    secondLanguageExamValidity
    comprehensionLevel {
      value
      label {
        en
        fr
      }
    }
    writtenLevel {
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
    estimatedLanguageAbility {
      value
      label {
        en
        fr
      }
    }
    isGovEmployee
    govEmployeeType {
      value
      label {
        en
        fr
      }
    }
    workEmail
    isWorkEmailVerified
    hasPriorityEntitlement
    priorityNumber
    locationPreferences {
      value
      label {
        en
        fr
      }
    }
    locationExemptions
    positionDuration
    acceptedOperationalRequirements {
      value
      label {
        en
        fr
      }
    }
    indigenousCommunities {
      value
      label {
        en
        fr
      }
    }
    indigenousDeclarationSignature
    hasDisability
    isVisibleMinority
    isWoman
    poolCandidates {
      id
      status {
        value
        label {
          en
          fr
        }
      }
      expiryDate
      notes
      suspendedAt
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
        workStream {
          id
          name {
            en
            fr
          }
        }
        publishingGroup {
          value
          label {
            en
            fr
          }
        }
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
        category {
          value
          label {
            en
            fr
          }
        }
        experienceSkillRecord {
          details
        }
      }
      ... on AwardExperience {
        title
        issuedBy
        awardedDate
        awardedTo {
          value
          label {
            en
            fr
          }
        }
        awardedScope {
          value
          label {
            en
            fr
          }
        }
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
        type {
          value
          label {
            en
            fr
          }
        }
        status {
          value
          label {
            en
            fr
          }
        }
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
        employmentCategory {
          value
          label {
            en
            fr
          }
        }
        extSizeOfOrganization {
          value
          label {
            en
            fr
          }
        }
        extRoleSeniority {
          value
          label {
            en
            fr
          }
        }
        govEmploymentType {
          value
          label {
            en
            fr
          }
        }
        govPositionType {
          value
          label {
            en
            fr
          }
        }
        govContractorRoleSeniority {
          value
          label {
            en
            fr
          }
        }
        govContractorType {
          value
          label {
            en
            fr
          }
        }
        contractorFirmAgencyName
        cafEmploymentType {
          value
          label {
            en
            fr
          }
        }
        cafForce {
          value
          label {
            en
            fr
          }
        }
        cafRank {
          value
          label {
            en
            fr
          }
        }
        classification {
          id
          group
          level
        }
        department {
          id
          departmentNumber
          name {
            en
            fr
          }
        }
        workStreams {
          id
          key
          name {
            localized
          }
          community {
            id
            key
            name {
              localized
            }
          }
        }
      }
    }
    topTechnicalSkillsRanking {
      id
      skill {
        id
        key
        category {
          value
          label {
            en
            fr
          }
        }
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
      skill {
        id
        key
        category {
          value
          label {
            en
            fr
          }
        }
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
      skill {
        id
        key
        category {
          value
          label {
            en
            fr
          }
        }
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
      skill {
        id
        key
        category {
          value
          label {
            en
            fr
          }
        }
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
  const { downloadDoc, downloadingDoc } = useUserDownloads();

  const handleDocDownload = (anonymous: boolean) => {
    downloadDoc({ id: user.id, anonymous });
  };

  return (
    <>
      <div
        data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)"
        data-h2-text-align="base(right)"
      >
        <DownloadUsersDocButton
          disabled={downloadingDoc}
          onClick={handleDocDownload}
          isDownloading={downloadingDoc}
        />
      </div>
      <UserProfile user={user} headingLevel="h3" />
    </>
  );
};

const AdminUserProfile_Query = graphql(/* GraphQL */ `
  query AdminUserProfile($id: UUID!) {
    user(id: $id, trashed: WITH) {
      ...AdminUserProfileUser
    }
  }
`);

interface RouteParams extends Record<string, string> {
  userId: Scalars["ID"]["output"];
}

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

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.PoolOperator,
      ROLE_NAME.RequestResponder,
      ROLE_NAME.PlatformAdmin,
      ROLE_NAME.CommunityAdmin,
      ROLE_NAME.CommunityRecruiter,
      ROLE_NAME.ProcessOperator,
    ]}
  >
    <AdminUserProfilePage />
  </RequireAuth>
);

Component.displayName = "AdminUserProfilePage";

export default AdminUserProfilePage;
