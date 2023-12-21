import React from "react";
import { useIntl } from "react-intl";

import { Link, Heading } from "@gc-digital-talent/ui";
import { getLocale } from "@gc-digital-talent/i18n";

import applicationMessages from "~/messages/applicationMessages";
import {
  acceptableLink,
  degreeLink,
  eligibilityLink,
  foreignDegreeLink,
  postSecondaryLink,
} from "~/pages/Applications/ApplicationEducationPage/utils";
import { ClassificationGroup } from "~/utils/poolUtils";

type TextProps = React.HTMLProps<HTMLParagraphElement>;

const Text = (props: TextProps) => (
  <p data-h2-margin="base(x1, 0)" {...props} />
);

const Wrapper = (props: React.HTMLProps<HTMLDivElement>) => (
  <div
    data-h2-display="base(grid)"
    data-h2-grid-template-columns="base(1fr) l-tablet(1fr 1fr)"
    data-h2-gap="base(x.5)"
    data-h2-position="base(relative)"
    {...props}
  />
);
const Card = (props: React.HTMLProps<HTMLDivElement>) => (
  <div
    data-h2-background-color="base(foreground)"
    data-h2-radius="base(rounded)"
    data-h2-padding="base(x1.25)"
    data-h2-shadow="base(s)"
    data-h2-position="base(relative)"
    data-h2-z-index="base(1)"
    {...props}
  />
);

const Or = (props: React.HTMLProps<HTMLDivElement>) => {
  const intl = useIntl();
  return (
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
      {...props}
    >
      {intl.formatMessage({
        defaultMessage: "or",
        id: "l9AK3C",
        description:
          "that appears between different experience requirements for a pool applicant",
      })}
    </span>
  );
};

interface EducationRequirementsProps {
  isIAP: boolean;
  classificationGroup?: ClassificationGroup;
}

const EducationRequirements = ({
  classificationGroup,
  isIAP,
}: EducationRequirementsProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const qualityStandardsLink = (chunks: React.ReactNode) => {
    const href =
      locale === "en"
        ? "https://www.canada.ca/en/treasury-board-secretariat/services/staffing/qualification-standards/core.html#rpsi"
        : "https://www.canada.ca/fr/secretariat-conseil-tresor/services/dotation/normes-qualification/centrale.html#eepr";
    return (
      <Link href={href} color="black" newTab external>
        {chunks}
      </Link>
    );
  };

  switch (classificationGroup) {
    case "EX":
      return (
        <Wrapper data-h2-grid-template-columns="base(1fr) l-tablet(1fr 1fr 1fr)">
          <Card>
            <Heading level="h4" size="h6" data-h2-margin-top="base(0)">
              {intl.formatMessage({
                defaultMessage: "Professional designation",
                id: "KqEyqD",
                description:
                  "Title for the professional designation requirement.",
              })}
            </Heading>
            <Text>
              {intl.formatMessage(applicationMessages.professionalDesignation, {
                link: (msg: React.ReactNode) => eligibilityLink(msg, locale),
              })}
            </Text>
          </Card>
          <Or data-h2-left="l-tablet(33%)" />
          <Card>
            <Heading level="h4" size="h6" data-h2-margin-top="base(0)">
              {intl.formatMessage({
                defaultMessage: "Applied work experience",
                id: "dwYJOo",
                description:
                  "Title for the applied work experience requirements",
              })}
            </Heading>
            <Text>
              {intl.formatMessage(applicationMessages.appliedWorkExpEXGroup, {
                link: (msg: React.ReactNode) => acceptableLink(msg, locale),
              })}
            </Text>
          </Card>
          <Or data-h2-left="l-tablet(67%)" />
          <Card>
            <Heading level="h4" size="h6" data-h2-margin-top="base(0)">
              {intl.formatMessage({
                defaultMessage: "Graduation with degree",
                id: "ijg+sm",
                description:
                  "Title for the EX graduation with degree requirement.",
              })}
            </Heading>
            <Text>
              {intl.formatMessage(applicationMessages.graduationWithDegree, {
                degreeLink: (msg: React.ReactNode) => degreeLink(msg, locale),
                postSecondaryLink: (msg: React.ReactNode) =>
                  postSecondaryLink(msg, locale),
              })}
            </Text>
            <Text>
              {intl.formatMessage(applicationMessages.foreignDegree, {
                foreignDegreeLink: (msg: React.ReactNode) =>
                  foreignDegreeLink(msg, locale),
              })}
            </Text>
          </Card>
        </Wrapper>
      );
    case "PM":
      return (
        <Wrapper>
          <Card>
            <Heading level="h4" size="h6" data-h2-margin-top="base(0)">
              {intl.formatMessage({
                defaultMessage: "Applied work experience",
                id: "dwYJOo",
                description:
                  "Title for the applied work experience requirements",
              })}
            </Heading>
            <Text>
              {intl.formatMessage(applicationMessages.appliedWorkExpPMGroup)}
            </Text>
          </Card>
          <Or />
          <Card>
            <Heading level="h4" size="h6" data-h2-margin-top="base(0)">
              {intl.formatMessage(applicationMessages.secondarySchoolHeading)}
            </Heading>
            <Text>
              {intl.formatMessage(
                applicationMessages.secondarySchoolDescription,
              )}
            </Text>
          </Card>
        </Wrapper>
      );
    default:
      return (
        <Wrapper>
          <Card>
            <Heading level="h4" size="h6" data-h2-margin-top="base(0)">
              {intl.formatMessage({
                defaultMessage: "Applied work experience",
                id: "dwYJOo",
                description:
                  "Title for the applied work experience requirements",
              })}
            </Heading>
            <Text>
              {intl.formatMessage(applicationMessages.appliedWorkExperience)}
            </Text>
            <ul>
              <li>
                {intl.formatMessage(applicationMessages.onTheJobLearning)}
              </li>
              <li>
                {intl.formatMessage(
                  applicationMessages.nonConventionalTraining,
                )}
              </li>
              <li>{intl.formatMessage(applicationMessages.formalEducation)}</li>
              <li>{intl.formatMessage(applicationMessages.otherExperience)}</li>
            </ul>
          </Card>
          <Or />
          <Card>
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
                    id: "TiIkSF",
                    description:
                      "Option for education requirement, 2-year post-secondary",
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
                : intl.formatMessage(
                    applicationMessages.postSecondaryEducation,
                    {
                      link: qualityStandardsLink,
                    },
                  )}
            </Text>
          </Card>
        </Wrapper>
      );
  }
};

export default EducationRequirements;
