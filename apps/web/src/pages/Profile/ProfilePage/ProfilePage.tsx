import { defineMessage, useIntl } from "react-intl";
import { OperationContext, useMutation, useQuery } from "urql";

import {
  TableOfContents,
  ThrowNotFound,
  Pending,
  Container,
} from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import Hero from "~/components/Hero";
import useRoutes from "~/hooks/useRoutes";
import profileMessages from "~/messages/profileMessages";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import SEO from "~/components/SEO/SEO";
import PersonalInformation from "~/components/Profile/components/PersonalInformation/PersonalInformation";
import { SectionProps } from "~/components/Profile/types";
import { PAGE_SECTION_ID } from "~/constants/sections/userProfile";
import { getSectionTitle } from "~/components/Profile/utils";
import WorkPreferences from "~/components/Profile/components/WorkPreferences/WorkPreferences";
import LanguageProfile from "~/components/Profile/components/LanguageProfile/LanguageProfile";
import GovernmentInformation from "~/components/Profile/components/GovernmentInformation/GovernmentInformation";
import DiversityEquityInclusion from "~/components/Profile/components/DiversityEquityInclusion/DiversityEquityInclusion";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import pageMessages from "./messages";

const ProfileUpdateUser_Mutation = graphql(/* GraphQL */ `
  mutation UpdateUserAsUser($id: ID!, $user: UpdateUserAsUserInput!) {
    updateUserAsUser(id: $id, user: $user) {
      id
    }
  }
`);

const pageTitle = defineMessage(pageMessages.pageTitle);

const subTitle = defineMessage(pageMessages.subTitle);

// export text for testing
// should match the getProfile query from api/app/GraphQL/Mutations/PoolCandidateSnapshot.graphql
// eslint-disable-next-line camelcase
export const UserProfile_FragmentText = /** GraphQL */ `
query getProfile($userId: UUID!) {
  user(id: $userId) {
    id
    firstName
    lastName
    email
    isEmailVerified
    telephone
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
    workEmail
    isWorkEmailVerified
    hasPriorityEntitlement
    priorityNumber
    govEmployeeType {
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
    govEndDate
    govRole
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
      maxSalary
      minSalary
    }
    isWoman
    hasDisability
    indigenousCommunities {
      value
      label {
        en
        fr
      }
    }
    indigenousDeclarationSignature
    isVisibleMinority
    hasDiploma
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
    acceptedOperationalRequirements {
      value
      label {
        en
        fr
      }
    }
    positionDuration
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
    experiences {
      # profileExperience fragment
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
          name {
            en
            fr
          }
          group
          level
          maxSalary
          minSalary
        }
        department {
          id
          name {
            en
            fr
          }
          departmentNumber
        }
        workStreams {
          id
          key
          name {
            en
            fr
          }
          community {
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
          }
          plainLanguageName {
            en
            fr
          }
        }
        supervisoryPosition
        supervisedEmployees
        supervisedEmployeesNumber
        budgetManagement
        annualBudgetAllocation
        seniorManagementStatus
        cSuiteRoleTitle {
          value
          label {
            en
            fr
          }
        }
        otherCSuiteRoleTitle
      }
    }
    isProfileComplete
  }
}
`;

export const UserProfile_Fragment = graphql(/** GraphQL */ `
  fragment UserProfile on User {
    id
    firstName
    lastName
    email
    isEmailVerified
    telephone
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
    workEmail
    isWorkEmailVerified
    hasPriorityEntitlement
    priorityNumber
    govEmployeeType {
      value
      label {
        en
        fr
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
    isWoman
    hasDisability
    indigenousCommunities {
      value
      label {
        en
        fr
      }
    }
    indigenousDeclarationSignature
    isVisibleMinority
    hasDiploma
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
    flexibleWorkLocations {
      value
      label {
        en
        fr
      }
    }
    locationExemptions
    acceptedOperationalRequirements {
      value
      label {
        en
        fr
      }
    }
    positionDuration
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
    experiences {
      id
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
          name {
            en
            fr
          }
          group
          level
          maxSalary
          minSalary
        }
        department {
          id
          name {
            en
            fr
          }
          departmentNumber
        }
        workStreams {
          id
          key
          name {
            en
            fr
          }
          community {
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
          }
          plainLanguageName {
            en
            fr
          }
        }
      }
    }
    isProfileComplete
  }
`);

export interface ProfilePageProps {
  userQuery: FragmentType<typeof UserProfile_Fragment>;
}

export const ProfileForm = ({ userQuery }: ProfilePageProps) => {
  const paths = useRoutes();
  const intl = useIntl();
  const user = getFragment(UserProfile_Fragment, userQuery);

  const formattedPageTitle = intl.formatMessage(pageTitle);
  const formattedSubTitle = intl.formatMessage(subTitle);

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(navigationMessages.applicantDashboard),
        url: paths.applicantDashboard(),
      },
      {
        label: formattedPageTitle,
        url: paths.profile(),
      },
    ],
  });

  const [{ fetching: isUpdating }, executeUpdateMutation] = useMutation(
    ProfileUpdateUser_Mutation,
  );

  const handleUpdate: SectionProps["onUpdate"] = async (userId, userData) => {
    return executeUpdateMutation({
      id: userId,
      user: userData,
    }).then((res) => res.data?.updateUserAsUser);
  };

  const sectionProps = {
    user,
    isUpdating,
    onUpdate: handleUpdate,
    pool: null,
  };

  return (
    <>
      <SEO title={formattedPageTitle} description={formattedSubTitle} />
      <Hero
        title={formattedPageTitle}
        subtitle={formattedSubTitle}
        crumbs={crumbs}
      />
      <Container className="my-18">
        <TableOfContents.Wrapper>
          <TableOfContents.Navigation>
            <TableOfContents.List>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={PAGE_SECTION_ID.ABOUT}>
                  {intl.formatMessage(getSectionTitle("personal"))}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink
                  id={PAGE_SECTION_ID.WORK_PREFERENCES}
                >
                  {intl.formatMessage(getSectionTitle("work"))}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={PAGE_SECTION_ID.DEI}>
                  {intl.formatMessage(getSectionTitle("dei"))}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={PAGE_SECTION_ID.GOVERNMENT}>
                  {intl.formatMessage(getSectionTitle("government"))}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={PAGE_SECTION_ID.LANGUAGE}>
                  {intl.formatMessage(getSectionTitle("language"))}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
            </TableOfContents.List>
          </TableOfContents.Navigation>
          <TableOfContents.Content>
            <div className="flex flex-col gap-y-18">
              <TableOfContents.Section id={PAGE_SECTION_ID.ABOUT}>
                <PersonalInformation {...sectionProps} />
              </TableOfContents.Section>
              <TableOfContents.Section id={PAGE_SECTION_ID.WORK_PREFERENCES}>
                <WorkPreferences {...sectionProps} />
              </TableOfContents.Section>
              <TableOfContents.Section id={PAGE_SECTION_ID.DEI}>
                <DiversityEquityInclusion {...sectionProps} />
              </TableOfContents.Section>
              <TableOfContents.Section id={PAGE_SECTION_ID.GOVERNMENT}>
                <GovernmentInformation {...sectionProps} />
              </TableOfContents.Section>
              <TableOfContents.Section id={PAGE_SECTION_ID.LANGUAGE}>
                <LanguageProfile {...sectionProps} />
              </TableOfContents.Section>
            </div>
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </Container>
    </>
  );
};

const ProfileUser_Query = graphql(/* GraphQL */ `
  query ProfileUser {
    me {
      ...UserProfile
    }
  }
`);

const context: Partial<OperationContext> = {
  requestPolicy: "cache-first",
};

const ProfilePage = () => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useQuery({
    query: ProfileUser_Query,
    context,
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.me ? (
        <ProfileForm userQuery={data?.me} />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(profileMessages.userNotFound)}
        />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <ProfilePage />
  </RequireAuth>
);

Component.displayName = "ProfilePage";

export default ProfilePage;
