import { useIntl } from "react-intl";
import { useMutation } from "urql";

import { Heading, Separator, ThrowNotFound } from "@gc-digital-talent/ui";
import { graphql, User } from "@gc-digital-talent/graphql";

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

interface ApplicationProfileProps extends ApplicationPageProps {
  user: User;
}

export const ApplicationProfile = ({
  application,
  user,
}: ApplicationProfileProps) => {
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
        <LanguageProfile
          {...sectionProps}
          application={{ id: application.id, pool: application.pool }}
        />
      </div>
      <Separator />
      <StepNavigation
        application={application}
        user={user}
        isValid={!stepHasError(user, application.pool)}
      />
    </ProfileFormProvider>
  );
};

export const Component = () => {
  const { application } = useApplication();

  return application?.pool && application.user ? (
    <ApplicationProfile application={application} user={application.user} />
  ) : (
    <ThrowNotFound />
  );
};

Component.displayName = "ApplicationProfilePage";
