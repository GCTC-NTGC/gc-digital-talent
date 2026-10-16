import { useIntl } from "react-intl";
import { useMutation } from "urql";

import { Heading, Separator, ThrowNotFound } from "@gc-digital-talent/ui";
import { graphql } from "@gc-digital-talent/graphql";
import { useLocalStorage } from "@gc-digital-talent/storage";

import useRoutes from "~/hooks/useRoutes";
import type { GetPageNavInfo } from "~/types/applicationStep";
import type { SectionProps } from "~/components/Profile/types";
import ProfileFormProvider from "~/components/Profile/components/ProfileFormContext";
import PersonalInformation from "~/components/Profile/components/PersonalInformation/PersonalInformation";
import WorkPreferences from "~/components/Profile/components/WorkPreferences/WorkPreferences";
import DiversityEquityInclusion from "~/components/Profile/components/DiversityEquityInclusion/DiversityEquityInclusion";
import LanguageProfile from "~/components/Profile/components/LanguageProfile/LanguageProfile";
import poolCandidateMessages from "~/messages/poolCandidateMessages";
import CitizenVeteranPriority from "~/components/Profile/components/CitizenVeteranPriority/CitizenVeteranPriority";
import { KEY_NEW_USER_LANGUAGE_PRESET } from "~/constants/storageKeys";

import StepNavigation from "./components/StepNavigation";
import type { ApplicationPageProps } from "../ApplicationApi";
import stepHasError from "../profileStep/profileStepValidation";
import { useApplicationContext } from "../ApplicationContext";
import useApplication from "../useApplication";

const Application_UpdateProfileMutation = graphql(/* GraphQL */ `
  mutation Application_UpdateProfile($id: ID!, $user: UpdateUserAsUserInput!) {
    updateUserAsUser(id: $id, user: $user) {
      id
    }
  }
`);

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
    crumbs: [
      {
        url: path,
        label: intl.formatMessage(poolCandidateMessages.assessmentStepNumber, {
          stepNumber: stepOrdinal,
        }),
      },
    ],
    link: {
      url: path,
    },
  };
};

export const ApplicationProfile = ({ application }: ApplicationPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { currentStepOrdinal } = useApplicationContext();
  const pageInfo = getPageInfo({
    intl,
    paths,
    application,
    stepOrdinal: currentStepOrdinal,
  });

  const [languagePresetNoticeIsVisible, setLanguagePresetNoticeIsVisible] =
    useLocalStorage<boolean>(KEY_NEW_USER_LANGUAGE_PRESET, false);

  const [{ fetching: isUpdating }, executeUpdateMutation] = useMutation(
    Application_UpdateProfileMutation,
  );

  const handleUpdate: SectionProps["onUpdate"] = (userId, userData) => {
    return executeUpdateMutation({
      id: userId,
      user: userData,
    }).then((res) => res.data?.updateUserAsUser);
  };

  const sectionProps = {
    query: application.user,
    isUpdating,
    onUpdate: handleUpdate,
    pool: application.pool,
  };

  return (
    <ProfileFormProvider>
      <Heading size="h3" className="mt-0 mb-6 font-normal">
        {pageInfo.title}
      </Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "This step includes all of your profile information required for this application. Each section has a series of required fields that must be completed to move on to the next step. The information you provide here will auto-populate future applications you submit.",
          id: "8IvjbH",
          description: "Application step to complete your profile, description",
        })}
      </p>
      <div className="mt-18 flex flex-col gap-y-18">
        <PersonalInformation
          {...sectionProps}
          query={application.user}
          isSpecialApplication={application.isSpecialApplication}
        />
        <WorkPreferences {...sectionProps} />
        <div>
          <DiversityEquityInclusion {...sectionProps} />
        </div>
        <CitizenVeteranPriority {...sectionProps} />
        <LanguageProfile
          {...sectionProps}
          application={application}
          languagePresetNoticeIsVisible={languagePresetNoticeIsVisible}
          setLanguagePresetNoticeIsVisible={setLanguagePresetNoticeIsVisible}
        />
      </div>
      <Separator />
      <StepNavigation
        application={application}
        user={application.user}
        isValid={
          !stepHasError(application.user, application.pool, application, {
            languagePresetNoticeIsVisible,
          })
        }
      />
    </ProfileFormProvider>
  );
};

export const Component = () => {
  const { application } = useApplication();

  return application?.pool && application.user ? (
    <ApplicationProfile application={application} />
  ) : (
    <ThrowNotFound />
  );
};

Component.displayName = "ApplicationProfilePage";

export default Component;
