import { useIntl } from "react-intl";
import { useMutation } from "urql";

import { Heading, Separator, ThrowNotFound } from "@gc-digital-talent/ui";
import { graphql, UserProfileFragment } from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import { GetPageNavInfo } from "~/types/applicationStep";
import applicationMessages from "~/messages/applicationMessages";
import { SectionProps } from "~/components/Profile/types";
import ProfileFormProvider from "~/components/Profile/components/ProfileFormContext";
import PersonalInformation from "~/components/Profile/components/PersonalInformation/PersonalInformation";
import WorkPreferences from "~/components/Profile/components/WorkPreferences/WorkPreferences";
import DiversityEquityInclusion from "~/components/Profile/components/DiversityEquityInclusion/DiversityEquityInclusion";
import GovernmentInformation from "~/components/Profile/components/GovernmentInformation/GovernmentInformation";
import LanguageProfile from "~/components/Profile/components/LanguageProfile/LanguageProfile";

import StepNavigation from "./components/StepNavigation";
import { ApplicationPageProps } from "../ApplicationApi";
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
    user: application.user as UserProfileFragment,
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
        <PersonalInformation {...sectionProps} />
        <WorkPreferences {...sectionProps} />
        <div>
          <DiversityEquityInclusion {...sectionProps} />
        </div>
        <GovernmentInformation {...sectionProps} />
        <LanguageProfile
          {...sectionProps}
          application={{
            id: application.id,
            pool: application.pool,
            user: application.user,
          }}
        />
      </div>
      <Separator />
      <StepNavigation
        application={application}
        user={application.user}
        isValid={!stepHasError(application.user, application.pool)}
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
