import React from "react";
import { useIntl } from "react-intl";
import { UserCircleIcon } from "@heroicons/react/20/solid";

import { Heading } from "@gc-digital-talent/ui";
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
import ApplicationApi, { ApplicationPageProps } from "../ApplicationApi";

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

const ApplicationProfile = ({ application }: ApplicationPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const pageInfo = getPageInfo({ intl, paths, application });

  return <Heading data-h2-margin-top="base(0)">{pageInfo.title}</Heading>;
};

const ApplicationProfilePage = () => (
  <ApplicationApi PageComponent={ApplicationProfile} />
);

export default ApplicationProfilePage;
