import React from "react";
import { useIntl } from "react-intl";
import UserCircleIcon from "@heroicons/react/20/solid/UserCircleIcon";
import { useQuery } from "urql";

import {
  Heading,
  Pending,
  Separator,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import { GetPageNavInfo } from "~/types/applicationStep";
import { useUpdateUserAsUserMutation } from "~/api/generated";
import applicationMessages from "~/messages/applicationMessages";
import { SectionProps } from "~/components/Profile/types";
import ProfileFormProvider from "~/components/Profile/components/ProfileFormContext";
import StepNavigation from "~/components/Profile/components/StepNavigation";
import PersonalInformation from "~/components/Profile/components/PersonalInformation/PersonalInformation";
import WorkPreferences from "~/components/Profile/components/WorkPreferences/WorkPreferences";
import DiversityEquityInclusion from "~/components/Profile/components/DiversityEquityInclusion/DiversityEquityInclusion";
import GovernmentInformation from "~/components/Profile/components/GovernmentInformation/GovernmentInformation";
import LanguageProfile from "~/components/Profile/components/LanguageProfile/LanguageProfile";

import {
  ApplicationPageProps,
  Application_PoolCandidateFragment,
} from "../ApplicationApi";
import stepHasError from "../profileStep/profileStepValidation";
import { useApplicationContext } from "../ApplicationContext";
import useApplicationId from "../useApplicationId";

export const getPageInfo: GetPageNavInfo = ({
  application,
  paths,
  intl,
  stepOrdinal,
}) => {
  const path = paths.applicationProfile(application.id);
  return {
    title: intl.formatMessage({
      defaultMessage: "Review your profile",
      id: "aFPUbm",
      description: "Page title for the application profile page",
    }),
    subtitle: intl.formatMessage({
      defaultMessage:
        "Update and review your personal, contact, and preference information.",
      id: "ImTMRk",
      description: "Subtitle for the application profile  page",
    }),
    icon: UserCircleIcon,
    crumbs: [
      {
        url: path,
        label: intl.formatMessage(applicationMessages.numberedStep, {
          stepOrdinal,
        }),
      },
    ],
    link: {
      url: path,
    },
  };
};

export const Application_UserProfileFragment = graphql(/* GraphQL */ `
  fragment Application_UserProfile on User {
    id
    preferredLang
    preferredLanguageForInterview
    preferredLanguageForExam
    currentProvince
    currentCity
    telephone
    firstName
    lastName
    email
    citizenship
    armedForcesStatus
    positionDuration
    acceptedOperationalRequirements
    locationPreferences
    locationExemptions
    indigenousCommunities
    indigenousDeclarationSignature
    isVisibleMinority
    isWoman
    hasDisability
    isGovEmployee
    hasPriorityEntitlement
    priorityNumber
    govEmployeeType
    positionDuration
    acceptedOperationalRequirements
    locationPreferences
    locationExemptions
    currentClassification {
      id
      group
      level
    }
    lookingForEnglish
    lookingForFrench
    lookingForBilingual
    bilingualEvaluation
    comprehensionLevel
    writtenLevel
    verbalLevel
    estimatedLanguageAbility
  }
`);

interface ApplicationProfileProps extends ApplicationPageProps {
  userQuery: FragmentType<typeof Application_UserProfileFragment>;
}

export const ApplicationProfile = ({
  query,
  userQuery,
}: ApplicationProfileProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { currentStepOrdinal } = useApplicationContext();
  const application = getFragment(Application_PoolCandidateFragment, query);
  const user = getFragment(Application_UserProfileFragment, userQuery);
  const pageInfo = getPageInfo({
    intl,
    paths,
    application,
    stepOrdinal: currentStepOrdinal,
  });
  const [{ fetching: isUpdating }, executeUpdateMutation] =
    useUpdateUserAsUserMutation();

  const handleUpdate: SectionProps["onUpdate"] = (userId, userData) => {
    return executeUpdateMutation({
      id: userId,
      user: userData,
    }).then((res) => res.data?.updateUserAsUser);
  };

  const sectionProps = {
    user,
    isUpdating,
    onUpdate: handleUpdate,
    pool: application.pool,
  };

  return (
    <ProfileFormProvider>
      <Heading
        size="h3"
        data-h2-font-weight="base(400)"
        data-h2-margin="base(0, 0, x1, 0)"
      >
        {pageInfo.title}
      </Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "This step includes all of your profile information required for this application. Each section has a series of required fields that must be completed to move on to the next step. Completing this profile information will only happen once, and the information you provide here will auto-populate on applications you submit moving forward.",
          id: "D9Elm9",
          description: "Application step to complete your profile, description",
        })}
      </p>
      <div data-h2-margin="base(x3, 0, 0, 0)">
        <PersonalInformation {...sectionProps} />
      </div>
      <div data-h2-margin="base(x3, 0, 0, 0)">
        <WorkPreferences {...sectionProps} />
      </div>
      <div data-h2-margin="base(x3, 0, 0, 0)">
        <DiversityEquityInclusion {...sectionProps} />
      </div>
      <div data-h2-margin="base(x3, 0, 0, 0)">
        <GovernmentInformation {...sectionProps} />
      </div>
      <div data-h2-margin="base(x2, 0, 0, 0)">
        <LanguageProfile {...sectionProps} application={application} />
      </div>
      <Separator
        orientation="horizontal"
        data-h2-background-color="base(gray)"
        data-h2-margin="base(x2, 0)"
        decorative
      />
      <StepNavigation
        application={application}
        user={user}
        isValid={!stepHasError(user, application.pool)}
      />
    </ProfileFormProvider>
  );
};

export const ApplicationProfilePageQuery = graphql(/* GraphQL */ `
  query ApplicationProfilePage($id: UUID!) {
    poolCandidate(id: $id) {
      ...Application_PoolCandidate
    }
    me {
      id
      email
      ...Application_UserProfile
    }
  }
`);

const ApplicationProfilePage = () => {
  const id = useApplicationId();
  const [{ data, fetching, error, stale }] = useQuery({
    query: ApplicationProfilePageQuery,
    requestPolicy: "cache-first",
    variables: {
      id,
    },
  });

  return (
    <Pending fetching={fetching || stale} error={error}>
      {data?.poolCandidate && data?.me ? (
        <ApplicationProfile query={data.poolCandidate} userQuery={data.me} />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export default ApplicationProfilePage;
