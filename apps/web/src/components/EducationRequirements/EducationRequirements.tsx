import { useIntl } from "react-intl";
import { HTMLProps, ReactNode } from "react";

import {
  Link,
  Heading,
  HeadingLevel,
  CardBasic,
  cn,
} from "@gc-digital-talent/ui";
import { getLocale } from "@gc-digital-talent/i18n";

import applicationMessages from "~/messages/applicationMessages";
import {
  acceptableLink,
  degreeLink,
  eligibilityLink,
  foreignDegreeLink,
  postSecondaryLink,
} from "~/pages/Applications/ApplicationEducationPage/utils";

type TextProps = HTMLProps<HTMLParagraphElement>;

const Text = (props: TextProps) => (
  <p data-h2-margin="base(x.5, 0)" {...props} />
);

const Wrapper = (props: HTMLProps<HTMLDivElement>) => (
  <div className="relative grid gap-3 md:grid-cols-2 " {...props} />
);

const Or = (props: HTMLProps<HTMLDivElement>) => {
  const intl = useIntl();
  return (
    <span
      data-h2-background-color="base(secondary)"
      data-h2-color="base:all(black)"
      className={cn(
        "z-20 flex  h-12 w-12 rounded-full shadow-sm",
        "items-center justify-center self-center",
        "font-bold uppercase",
        "md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2",
        "-my-8 mx-auto md:m-0",
      )}
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
  classificationGroup?: string;
  headingAs?: HeadingLevel;
}

const EducationRequirements = ({
  classificationGroup,
  isIAP,
  headingAs = "h3",
}: EducationRequirementsProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const qualityStandardsLink = (chunks: ReactNode) => {
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
          <CardBasic>
            <Heading
              level={headingAs}
              size="h6"
              data-h2-margin="base(0 0 x.5 0)"
            >
              {intl.formatMessage({
                defaultMessage: "Professional designation",
                id: "KqEyqD",
                description:
                  "Title for the professional designation requirement.",
              })}
            </Heading>
            <Text>
              {intl.formatMessage(applicationMessages.professionalDesignation, {
                link: (msg: ReactNode) => eligibilityLink(msg, locale),
              })}
            </Text>
          </CardBasic>
          <Or />
          <CardBasic>
            <Heading
              level={headingAs}
              size="h6"
              data-h2-margin="base(0 0 x.5 0)"
            >
              {intl.formatMessage({
                defaultMessage: "Applied work experience",
                id: "dwYJOo",
                description:
                  "Title for the applied work experience requirements",
              })}
            </Heading>
            <Text>
              {intl.formatMessage(applicationMessages.appliedWorkExpEXGroup, {
                link: (msg: ReactNode) => acceptableLink(msg, locale),
              })}
            </Text>
          </CardBasic>
          <Or data-h2-left="l-tablet(67%)" />
          <CardBasic>
            <Heading
              level={headingAs}
              size="h6"
              data-h2-margin="base(0 0 x.5 0)"
            >
              {intl.formatMessage({
                defaultMessage: "Graduation with degree",
                id: "ijg+sm",
                description:
                  "Title for the EX graduation with degree requirement.",
              })}
            </Heading>
            <Text>
              {intl.formatMessage(applicationMessages.graduationWithDegree, {
                degreeLink: (msg: ReactNode) => degreeLink(msg, locale),
                postSecondaryLink: (msg: ReactNode) =>
                  postSecondaryLink(msg, locale),
              })}
            </Text>
            <Text>
              {intl.formatMessage(applicationMessages.foreignDegree, {
                foreignDegreeLink: (msg: ReactNode) =>
                  foreignDegreeLink(msg, locale),
              })}
            </Text>
          </CardBasic>
        </Wrapper>
      );
    case "AS":
    case "PM":
      return (
        <Wrapper>
          <CardBasic>
            <Heading
              level={headingAs}
              size="h6"
              data-h2-margin="base(0 0 x.5 0)"
            >
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
          </CardBasic>
          <Or />
          <CardBasic>
            <Heading
              level={headingAs}
              size="h6"
              data-h2-margin="base(0 0 x.5 0)"
            >
              {intl.formatMessage(applicationMessages.secondarySchoolHeading)}
            </Heading>
            <Text>
              {intl.formatMessage(
                applicationMessages.secondarySchoolDescription,
              )}
            </Text>
          </CardBasic>
        </Wrapper>
      );
    case "EC":
      return (
        <Wrapper>
          <CardBasic>
            <Heading level={headingAs} size="h6" data-h2-margin-top="base(0)">
              {intl.formatMessage(
                applicationMessages.educationRequirementECJustEducationHeading,
              )}
            </Heading>
            <Text>
              {intl.formatMessage(
                applicationMessages.educationRequirementECJustEducationDescription,
              )}
            </Text>
          </CardBasic>
          <Or />
          <CardBasic>
            <Heading level={headingAs} size="h6" data-h2-margin-top="base(0)">
              {intl.formatMessage(
                applicationMessages.educationRequirementECEducationPlusHeading,
              )}
            </Heading>
            <Text>
              {intl.formatMessage(
                applicationMessages.educationRequirementECEducationPlusDescription,
              )}
            </Text>
          </CardBasic>
        </Wrapper>
      );
    default:
      return (
        <Wrapper>
          <CardBasic>
            <Heading
              level={headingAs}
              size="h6"
              data-h2-margin="base(0 0 x.5 0)"
            >
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
          </CardBasic>
          <Or />
          <CardBasic>
            <Heading
              level={headingAs}
              size="h6"
              data-h2-margin="base(0 0 x.5 0)"
            >
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
          </CardBasic>
        </Wrapper>
      );
  }
};

export default EducationRequirements;
