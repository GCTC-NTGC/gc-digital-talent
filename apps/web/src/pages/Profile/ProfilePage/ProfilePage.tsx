import { defineMessage, useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";

import { TableOfContents, ThrowNotFound, Pending } from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import Hero from "~/components/Hero/Hero";
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

const ProfileUpdateUser_Mutation = graphql(/* GraphQL */ `
  mutation UpdateUserAsUser($id: ID!, $user: UpdateUserAsUserInput!) {
    updateUserAsUser(id: $id, user: $user) {
      id
      firstName
      lastName
      telephone
      preferredLang
      preferredLanguageForInterview
      preferredLanguageForExam
      currentProvince
      currentCity

      preferredLang
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
        name {
          en
          fr
        }
        group
        level
        minSalary
        maxSalary
      }

      isWoman
      hasDisability
      isVisibleMinority
      indigenousCommunities
      indigenousDeclarationSignature

      hasDiploma
      locationPreferences
      locationExemptions
      acceptedOperationalRequirements
      positionDuration
    }
  }
`);

const pageTitle = defineMessage({
  defaultMessage: "Personal information",
  id: "g8Ur9z",
  description: "applicant dashboard card title for profile card",
});

const subTitle = defineMessage({
  defaultMessage:
    "View and update account information including contact and work preferences.",
  id: "NflJW7",
  description: "subtitle for the profile page",
});

// export text for testing
// should match the getProfile query from api/app/GraphQL/Mutations/PoolCandidateSnapshot.graphql
// eslint-disable-next-line camelcase
export const UserProfile_FragmentText = /* GraphQL */ `
  fragment UserProfile on User {
    id
    authInfo {
      id
      sub
    }
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
    isVisibleMinority
    hasDiploma
    locationPreferences
    locationExemptions
    acceptedOperationalRequirements
    positionDuration
    userSkills {
      id
      user {
        id
        email
      }
      skill {
        id
        key
        name {
          en
          fr
        }
        category
      }
    }
    experiences {
      # profileExperience fragment
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
    isProfileComplete
    poolCandidates {
      id
      user {
        id
        email
      }
      status
      expiryDate
      signature
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
      educationRequirementOption
      educationRequirementExperiences {
        # profileExperience fragment
        id
        __typename
        details
        user {
          id
          email
        }
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
      screeningQuestionResponses {
        id
        answer
        screeningQuestion {
          id
          sortOrder
          question {
            en
            fr
          }
        }
      }
      generalQuestionResponses {
        id
        answer
        generalQuestion {
          id
          sortOrder
          question {
            en
            fr
          }
        }
      }
    }
  }
`;

export const UserProfile_Fragment = graphql(UserProfile_FragmentText);

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
        label: intl.formatMessage(navigationMessages.profileAndApplications),
        url: paths.profileAndApplications(),
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
      <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
        <TableOfContents.Wrapper>
          <TableOfContents.Navigation data-h2-padding-top="base(x3)">
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
          <TableOfContents.Content data-h2-padding-top="base(x3)">
            <TableOfContents.Section id={PAGE_SECTION_ID.ABOUT}>
              <PersonalInformation {...sectionProps} />
            </TableOfContents.Section>
            <TableOfContents.Section
              id={PAGE_SECTION_ID.WORK_PREFERENCES}
              data-h2-padding-top="base(x3)"
            >
              <WorkPreferences {...sectionProps} />
            </TableOfContents.Section>
            <TableOfContents.Section
              id={PAGE_SECTION_ID.DEI}
              data-h2-padding-top="base(x3)"
            >
              <DiversityEquityInclusion {...sectionProps} />
            </TableOfContents.Section>
            <TableOfContents.Section
              id={PAGE_SECTION_ID.GOVERNMENT}
              data-h2-padding-top="base(x3)"
            >
              <GovernmentInformation {...sectionProps} />
            </TableOfContents.Section>
            <TableOfContents.Section
              id={PAGE_SECTION_ID.LANGUAGE}
              data-h2-padding-top="base(x3)"
            >
              <LanguageProfile {...sectionProps} />
            </TableOfContents.Section>
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </div>
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

const ProfilePage = () => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useQuery({ query: ProfileUser_Query });

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
