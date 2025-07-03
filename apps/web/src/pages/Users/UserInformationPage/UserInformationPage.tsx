import { useIntl } from "react-intl";
import CalculatorIcon from "@heroicons/react/24/outline/CalculatorIcon";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";
import PencilSquareIcon from "@heroicons/react/24/outline/PencilSquareIcon";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import { useQuery } from "urql";

import { Pending, TableOfContents, ThrowNotFound } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import {
  FragmentType,
  Scalars,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRequiredParams from "~/hooks/useRequiredParams";
import adminMessages from "~/messages/adminMessages";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import { JobPlacementOptionsFragmentType } from "~/components/PoolCandidatesTable/JobPlacementDialog";

import AboutSection from "./components/AboutSection";
import CandidateStatusSection from "./components/CandidateStatusSection";
import NotesSection from "./components/NotesSection";
import EmploymentEquitySection from "./components/EmploymentEquitySection";

export const UserInfo_Fragment = graphql(/* GraphQL */ `
  fragment UserInfo on User {
    ...UserCandidatesTableRow
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
    hasPriorityEntitlement
    priorityNumber
    priorityWeight
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
      notes
      pool {
        id
        name {
          en
          fr
        }
        publishingGroup {
          value
          label {
            en
            fr
          }
        }
        workStream {
          id
          name {
            en
            fr
          }
        }
        classification {
          id
          group
          level
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
        }
        awardedScope {
          value
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

interface UserInformationProps {
  userQuery: FragmentType<typeof UserInfo_Fragment>;
  jobPlacementOptions: JobPlacementOptionsFragmentType;
}

export const UserInformation = ({
  userQuery,
  jobPlacementOptions,
}: UserInformationProps) => {
  const intl = useIntl();
  const user = getFragment(UserInfo_Fragment, userQuery);

  const items = [
    {
      id: "about",
      title: intl.formatMessage({
        defaultMessage: "About",
        id: "uutH18",
        description: "Title of the 'About' section of the view-user page",
      }),
      titleIcon: UserIcon,
      content: <AboutSection user={user} />,
    },
    {
      id: "candidate-status",
      title: intl.formatMessage({
        defaultMessage: "Candidate status",
        id: "F00OD4",
        description:
          "Title of the 'Candidate status' section of the view-user page",
      }),
      titleIcon: CalculatorIcon,
      content: (
        <CandidateStatusSection
          user={user}
          jobPlacementOptions={jobPlacementOptions}
        />
      ),
    },
    {
      id: "notes",
      title: intl.formatMessage(adminMessages.notes),
      titleIcon: PencilSquareIcon,
      content: <NotesSection user={user} />,
    },
    {
      id: "employment-equity",
      title: intl.formatMessage(commonMessages.employmentEquity),
      titleIcon: InformationCircleIcon,
      content: <EmploymentEquitySection user={user} />,
    },
  ];

  return (
    <TableOfContents.Wrapper>
      <TableOfContents.Navigation>
        <TableOfContents.List>
          {items.map((item) => (
            <TableOfContents.ListItem key={item.id}>
              <TableOfContents.AnchorLink id={item.id}>
                {item.title}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
          ))}
        </TableOfContents.List>
      </TableOfContents.Navigation>
      <TableOfContents.Content>
        {items.map((item, index) => (
          <TableOfContents.Section key={item.id} id={item.id}>
            <TableOfContents.Heading
              icon={item.titleIcon}
              as="h3"
              className={`mb-6 ${index > 0 ? "mt-18" : "mt-0"}`}
            >
              {item.title}
            </TableOfContents.Heading>
            {item.content}
          </TableOfContents.Section>
        ))}
      </TableOfContents.Content>
    </TableOfContents.Wrapper>
  );
};

const UserInformation_Query = graphql(/* GraphQL */ `
  query GetViewUserData($id: UUID!) {
    user(id: $id, trashed: WITH) {
      ...UserInfo
    }

    ...JobPlacementOptions
  }
`);

interface RouteParams extends Record<string, string> {
  userId: Scalars["ID"]["output"];
}

const UserInformationPage = () => {
  const { userId } = useRequiredParams<RouteParams>("userId");
  const intl = useIntl();
  const [{ data, fetching, error }] = useQuery({
    query: UserInformation_Query,
    variables: { id: userId },
  });

  const user = data?.user;

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
        {user ? (
          <UserInformation userQuery={user} jobPlacementOptions={data} />
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
      ROLE_NAME.PlatformAdmin,
      ROLE_NAME.CommunityAdmin,
      ROLE_NAME.CommunityRecruiter,
      ROLE_NAME.CommunityTalentCoordinator,
      ROLE_NAME.ProcessOperator,
    ]}
  >
    <UserInformationPage />
  </RequireAuth>
);

Component.displayName = "AdminUserInformationPage";

export default UserInformationPage;
