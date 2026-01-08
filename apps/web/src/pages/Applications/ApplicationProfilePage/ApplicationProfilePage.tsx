import { useIntl } from "react-intl";
import { useMutation } from "urql";

import {
  Heading,
  Notice,
  Separator,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import {
  graphql,
  PoolAreaOfSelection,
  UserProfileFragment,
} from "@gc-digital-talent/graphql";
import { useFeatureFlags } from "@gc-digital-talent/env";

import useRoutes from "~/hooks/useRoutes";
import { GetPageNavInfo } from "~/types/applicationStep";
import { SectionProps } from "~/components/Profile/types";
import ProfileFormProvider from "~/components/Profile/components/ProfileFormContext";
import PersonalInformation from "~/components/Profile/components/PersonalInformation/PersonalInformation";
import WorkPreferences from "~/components/Profile/components/WorkPreferences/WorkPreferences";
import DiversityEquityInclusion from "~/components/Profile/components/DiversityEquityInclusion/DiversityEquityInclusion";
import GovernmentInformation from "~/components/Profile/components/GovernmentInformation/GovernmentInformation";
import LanguageProfile from "~/components/Profile/components/LanguageProfile/LanguageProfile";
import poolCandidateMessages from "~/messages/poolCandidateMessages";
import ContactEmailCard from "~/components/ContactEmailCard/ContactEmailCard";
import WorkEmailCard from "~/components/WorkEmailCard.tsx/WorkEmailCard";
import PriorityEntitlements from "~/components/Profile/components/PriorityEntitlements/PriorityEntitlements";

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
  const { applicationEmailVerification } = useFeatureFlags();
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
    query: application.user as UserProfileFragment,
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
        <div className="grid grid-cols-1 gap-1.5 xs:grid-cols-2">
          <div className="col-span-2">
            <PersonalInformation {...sectionProps} query={application.user} />
          </div>
          {/* Refactor after feature flag is turned on #15052 */}
          {applicationEmailVerification && (
            <>
              {!application.user.isEmailVerified && (
                <Notice.Root color="error" className="col-span-2">
                  <Notice.Content>
                    <p>
                      {intl.formatMessage({
                        defaultMessage: "A verified contact email is required",
                        id: "O7ubAh",
                        description:
                          "Error message displayed during application when missing a verified email",
                      })}
                    </p>
                  </Notice.Content>
                </Notice.Root>
              )}
              {application.pool.areaOfSelection?.value ===
                PoolAreaOfSelection.Employees && (
                <>
                  {(!application.user.isWorkEmailVerified ||
                    !application.user.workEmail) && (
                    <Notice.Root color="error" className="col-span-2">
                      <Notice.Content>
                        <p>
                          {intl.formatMessage({
                            defaultMessage:
                              "This job opportunity is reserved for existing employees. A verified Government of Canada work email is required.",
                            id: "KWgx7f",
                            description:
                              "Body for a message informing the user that a contact email is required.",
                          })}
                        </p>
                      </Notice.Content>
                    </Notice.Root>
                  )}
                </>
              )}
            </>
          )}
          <ContactEmailCard query={application.user} />
          <WorkEmailCard query={application.user} />
        </div>
        <WorkPreferences {...sectionProps} />
        <div>
          <DiversityEquityInclusion {...sectionProps} />
        </div>
        <PriorityEntitlements {...sectionProps} />
        <GovernmentInformation
          query={application.user as UserProfileFragment}
        />
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

export default Component;
