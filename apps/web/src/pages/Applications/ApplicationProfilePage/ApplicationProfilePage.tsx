import React from "react";
import { useParams } from "react-router";
import { useIntl } from "react-intl";
import { UserCircleIcon } from "@heroicons/react/20/solid";

import {
  Heading,
  Pending,
  Separator,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import {
  Applicant,
  ApplicationStep,
  PoolAdvertisement,
} from "@gc-digital-talent/graphql";

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
  useUpdateUserAsUserMutation,
} from "~/api/generated";

import { ApplicationPageProps } from "../ApplicationApi";
import PersonalInformation from "./components/PersonalInformation/PersonalInformation";
import WorkPreferences from "./components/WorkPreferences/WorkPreferences";
import DiversityEquityInclusion from "./components/DiversityEquityInclusion/DiversityEquityInclusion";
import GovernmentInformation from "./components/GovernmentInformation/GovernmentInformation";
import LanguageProfile from "./components/LanguageProfile/LanguageProfile";
import { SectionProps } from "./types";
import ErrorSummary from "./components/ErrorSummary";
import ProfileFormProvider from "./components/ProfileFormContext";
import StepNavigation from "./components/StepNavigation";

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
  const pageInfo = getPageInfo({ intl, paths, application });
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
  };

  return (
    <ProfileFormProvider>
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
        <ErrorSummary user={user} application={application} />
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
      <StepNavigation
        application={application}
        user={user}
        isValid={
          (application?.poolAdvertisement &&
            !pageInfo?.hasError?.(
              user as Applicant,
              application?.poolAdvertisement,
            )) ??
          false
        }
      />
    </ProfileFormProvider>
  );
};

const ApplicationProfilePage = () => {
  const { applicationId } = useParams();
  const [
    {
      data: applicationData,
      fetching: applicationFetching,
      error: applicationError,
      stale: applicationStale,
    },
  ] = useGetApplicationQuery({
    requestPolicy: "cache-first",
    variables: {
      id: applicationId || "",
    },
  });
  const [{ data: userData, fetching: userFetching, error: userError }] =
    useGetMeQuery();

  const application = applicationData?.poolCandidate;

  return (
    <Pending
      fetching={applicationFetching || applicationStale || userFetching}
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
