import React from "react";
import { useIntl } from "react-intl";

import applicationMessages from "~/messages/applicationMessages";
import { Link, Heading } from "@gc-digital-talent/ui";

import { getLocale } from "@gc-digital-talent/i18n";
import Text from "./Text";

const RequirementCard = (props: React.HTMLProps<HTMLDivElement>) => (
  <div
    data-h2-background-color="base(white)"
    data-h2-radius="base(rounded)"
    data-h2-padding="base(x1.25)"
    data-h2-shadow="base(s)"
    data-h2-position="base(relative)"
    data-h2-z-index="base(1)"
    {...props}
  />
);

interface EducationRequirementsProps {
  isIAP: boolean;
}

const EducationRequirements = ({ isIAP }: EducationRequirementsProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const qualityStandardsLink = (chunks: React.ReactNode) => {
    const href =
      locale === "en"
        ? "https://www.canada.ca/en/treasury-board-secretariat/services/staffing/qualification-standards/core.html#rpsi"
        : "https://www.canada.ca/fr/secretariat-conseil-tresor/services/dotation/normes-qualification/centrale.html#eepr";
    return (
      <Link href={href} newTab external>
        {chunks}
      </Link>
    );
  };

  return (
    <div
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="base(1fr) l-tablet(1fr 1fr)"
      data-h2-gap="base(x.5)"
      data-h2-position="base(relative)"
    >
      <RequirementCard>
        <Heading level="h4" size="h6" data-h2-margin-top="base(0)">
          {intl.formatMessage({
            defaultMessage: "Applied work experience",
            id: "dwYJOo",
            description: "Title for the applied work experience requirements",
          })}
        </Heading>
        <Text>
          {intl.formatMessage(applicationMessages.appliedWorkExperience)}
        </Text>
        <ul>
          <li>{intl.formatMessage(applicationMessages.onTheJobLearning)}</li>
          <li>
            {intl.formatMessage(applicationMessages.nonConventionalTraining)}
          </li>
          <li>{intl.formatMessage(applicationMessages.formalEducation)}</li>
          <li>{intl.formatMessage(applicationMessages.otherExperience)}</li>
        </ul>
      </RequirementCard>
      <span
        aria-hidden="true"
        data-h2-background-color="base(white)"
        data-h2-display="base(flex)"
        data-h2-align-items="base(center)"
        data-h2-justify-content="base(center)"
        data-h2-height="base(x2)"
        data-h2-width="base(x2)"
        data-h2-radius="base(x2)"
        data-h2-shadow="base(s)"
        data-h2-font-weight="base(700)"
        data-h2-align-self="base(center)"
        data-h2-text-transform="base(uppercase)"
        data-h2-position="l-tablet(absolute)"
        data-h2-top="l-tablet(50%)"
        data-h2-left="l-tablet(50%)"
        data-h2-transform="l-tablet(translate(-50%, -50%))"
        data-h2-margin="base(-x1.25 auto) l-tablet(0)"
        data-h2-z-index="base(2)"
      >
        {intl.formatMessage({
          defaultMessage: "or",
          id: "l9AK3C",
          description:
            "that appears between different experience requirements for a pool applicant",
        })}
      </span>
      <RequirementCard>
        <Heading level="h4" size="h6" data-h2-margin-top="base(0)">
          {isIAP
            ? intl.formatMessage({
                defaultMessage: "High school diploma or GED",
                id: "CnPVJe",
                description:
                  "Title for the education requirements (IT Apprenticeship Program for Indigenous Peoples)",
              })
            : intl.formatMessage({
                defaultMessage: "2-year post-secondary",
                id: "ZIwaDE",
                description: "Title for the education requirements",
              })}
        </Heading>
        <Text>
          {isIAP
            ? intl.formatMessage({
                defaultMessage:
                  "Successful completion of a standard high school diploma or GED equivalent.",
                id: "nWZiWr",
                description:
                  "Education requirement (IT Apprenticeship Program for Indigenous Peoples)",
              })
            : intl.formatMessage(applicationMessages.postSecondaryEducation, {
                link: qualityStandardsLink,
              })}
        </Text>
      </RequirementCard>
    </div>
  );
};

export default EducationRequirements;
