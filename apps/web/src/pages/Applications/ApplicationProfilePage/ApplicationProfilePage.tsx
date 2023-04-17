import React from "react";
import { useParams, useNavigate } from "react-router";
import { useIntl } from "react-intl";
import { UserCircleIcon } from "@heroicons/react/20/solid";

import {
  Button,
  Heading,
  Link,
  Pending,
  Separator,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import {
  Applicant,
  ApplicationStep,
  PoolAdvertisement,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import { errorMessages } from "@gc-digital-talent/i18n";
import { useFeatureFlags } from "@gc-digital-talent/env";

import useRoutes from "~/hooks/useRoutes";
import { GetApplicationPageInfo } from "~/types/poolCandidate";
import {
  aboutSectionHasEmptyRequiredFields,
  diversityEquityInclusionSectionHasEmptyRequiredFields,
  governmentInformationSectionHasEmptyRequiredFields,
  languageInformationSectionHasEmptyRequiredFields,
  languageInformationSectionHasUnsatisfiedRequirements,
  workLocationSectionHasEmptyRequiredFields,
  workPreferencesSectionHasEmptyRequiredFields,
} from "~/validators/profile";
import {
  User,
  useGetApplicationQuery,
  useGetMeQuery,
  useUpdateApplicationMutation,
  useUpdateUserAsUserMutation,
} from "~/api/generated";
import { getMissingLanguageRequirements } from "~/utils/languageUtils";

import { ApplicationPageProps } from "../ApplicationApi";
import PersonalInformation from "./components/PersonalInformation/PersonalInformation";
import WorkPreferences from "./components/WorkPreferences/WorkPreferences";
import DiversityEquityInclusion from "./components/DiversityEquityInclusion/DiversityEquityInclusion";
import GovernmentInformation from "./components/GovernmentInformation/GovernmentInformation";
import LanguageProfile from "./components/LanguageProfile/LanguageProfile";
import { SectionProps } from "./types";

export const getPageInfo: GetApplicationPageInfo = ({
  application,
  paths,
  intl,
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
        label: intl.formatMessage({
          defaultMessage: "Step 2",
          id: "IGR8Dw",
          description: "Breadcrumb link text for the application profile page",
        }),
      },
    ],
    link: {
      url: path,
    },
    prerequisites: [ApplicationStep.Welcome],
    stepSubmitted: ApplicationStep.ReviewYourProfile,
    hasError: (applicant: Applicant, poolAdvertisement: PoolAdvertisement) => {
      const hasEmptyRequiredFields =
        aboutSectionHasEmptyRequiredFields(applicant) ||
        workLocationSectionHasEmptyRequiredFields(applicant) ||
        diversityEquityInclusionSectionHasEmptyRequiredFields(applicant) ||
        governmentInformationSectionHasEmptyRequiredFields(applicant) ||
        languageInformationSectionHasEmptyRequiredFields(applicant) ||
        workPreferencesSectionHasEmptyRequiredFields(applicant) ||
        languageInformationSectionHasUnsatisfiedRequirements(
          applicant,
          poolAdvertisement,
        );
      return hasEmptyRequiredFields;
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
  const navigate = useNavigate();
  const { applicantDashboard } = useFeatureFlags();
  const pageInfo = getPageInfo({ intl, paths, application });
  const [{ fetching: submitting }, executeSubmitMutation] =
    useUpdateApplicationMutation();
  const [{ fetching: isUpdating }, executeUpdateMutation] =
    useUpdateUserAsUserMutation();
  const nextStepPath = paths.applicationResumeIntro(application.id);

  const handleNavigation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // We don't want to navigate until we mark the step as complete
    const isValid =
      application?.poolAdvertisement &&
      !pageInfo?.hasError?.(user as Applicant, application?.poolAdvertisement);

    if (isValid) {
      executeSubmitMutation({
        id: application.id,
        application: {
          insertSubmittedStep: ApplicationStep.ReviewYourProfile,
        },
      })
        .then((res) => {
          if (res.data) {
            navigate(nextStepPath);
          }
        })
        .catch(() => {
          toast.error(
            intl.formatMessage(errorMessages.unknownErrorRequestErrorTitle),
          );
        });
    } else {
      toast.error(
        intl.formatMessage({
          defaultMessage:
            "Please complete all required fields before continuing.",
          id: "G1jegJ",
          description:
            "Error message displayed when user attempts to submit incomplete profile",
        }),
      );
      const missingLanguageRequirements = getMissingLanguageRequirements(
        user as Applicant,
        application?.poolAdvertisement,
      );
      if (missingLanguageRequirements.length > 0) {
        const requirements = missingLanguageRequirements.map((requirement) => (
          <li key={requirement.id}>{intl.formatMessage(requirement)}</li>
        ));
        toast.error(
          intl.formatMessage(
            {
              defaultMessage:
                "You are missing the following language requirements: {requirements}",
              id: "CPHTk9",
              description:
                "Error message when a user does not meet a pools language requirements",
            },
            { requirements },
          ),
        );
      }
    }

    return false;
  };

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
  };

  return (
    <>
      <Heading data-h2-margin-top="base(0)">{pageInfo.title}</Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "This step includes all of your profile information required for this application. Each section has a series of required fields that must be completed to move on to the next step. Completing this profile information will only happen once, and the information you provide here will auto-populate on applications you submit moving forward.",
          id: "D9Elm9",
          description: "Application step to complete your profile, description",
        })}
      </p>
      <div
        data-h2-margin="base(x2, 0)"
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1, 0)"
      >
        <PersonalInformation {...sectionProps} />
        <WorkPreferences {...sectionProps} />
        <DiversityEquityInclusion {...sectionProps} />
        <GovernmentInformation {...sectionProps} />
        <LanguageProfile {...sectionProps} application={application} />
      </div>
      <Separator
        orientation="horizontal"
        data-h2-background-color="base(gray.lighter)"
        data-h2-margin="base(x2, 0)"
        decorative
      />
      <div
        data-h2-display="base(flex)"
        data-h2-gap="base(x.25, x.5)"
        data-h2-flex-wrap="base(wrap)"
        data-h2-flex-direction="base(column) l-tablet(row)"
        data-h2-align-items="base(flex-start) l-tablet(center)"
      >
        <form onSubmit={handleNavigation}>
          <Button
            type="submit"
            color="primary"
            mode="solid"
            disabled={submitting}
          >
            {intl.formatMessage({
              defaultMessage: "Let's go!",
              id: "r6z4HM",
              description: "Link text to begin the application process",
            })}
          </Button>
        </form>
        <Link
          type="button"
          mode="inline"
          color="secondary"
          href={applicantDashboard ? paths.dashboard() : paths.myProfile()}
        >
          {intl.formatMessage({
            defaultMessage: "Save and quit for now",
            id: "U86N4g",
            description: "Action button to save and exit an application",
          })}
        </Link>
      </div>
    </>
  );
};

const ApplicationProfilePage = () => {
  const { applicationId } = useParams();
  const [
    {
      data: applicationData,
      fetching: applicationFetching,
      error: applicationError,
    },
  ] = useGetApplicationQuery({
    variables: {
      id: applicationId || "",
    },
  });
  const [{ data: userData, fetching: userFetching, error: userError }] =
    useGetMeQuery();

  const application = applicationData?.poolCandidate;

  return (
    <Pending
      fetching={applicationFetching || userFetching}
      error={applicationError || userError}
    >
      {application?.poolAdvertisement && userData?.me ? (
        <ApplicationProfile application={application} user={userData.me} />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export default ApplicationProfilePage;
