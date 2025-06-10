import { useIntl } from "react-intl";
import { HTMLProps, ReactNode } from "react";
import { tv } from "tailwind-variants";

import { Link, Heading, HeadingLevel, Card, Ul } from "@gc-digital-talent/ui";
import { getLocale } from "@gc-digital-talent/i18n";
import { assertUnreachable } from "@gc-digital-talent/helpers";

import applicationMessages from "~/messages/applicationMessages";
import {
  acceptableLink,
  degreeLink,
  eligibilityLink,
  foreignDegreeLink,
  postSecondaryLink,
} from "~/utils/educationUtils";
import { ClassificationGroup } from "~/types/classificationGroup";

type TextProps = HTMLProps<HTMLParagraphElement>;

const Text = (props: TextProps) => <p className="my-3" {...props} />;

const wrapper = tv({
  base: "relative grid grid-cols-1 gap-3",
  variants: {
    cols: {
      2: "sm:grid-cols-2",
      3: "sm:grid-cols-3",
    },
  },
  defaultVariants: {
    cols: 2,
  },
});

interface WrapperProps extends HTMLProps<HTMLDivElement> {
  cols?: 2 | 3;
}

const Wrapper = ({ className, cols, ...rest }: WrapperProps) => (
  <div className={wrapper({ cols, class: className })} {...rest} />
);

const orStyles = tv({
  base: "z-[2] mx-auto -my-6 grid size-12 place-items-center self-center rounded-full bg-primary font-bold text-black uppercase shadow shadow-sm sm:absolute sm:top-1/2 sm:left-1/2 sm:m-0 sm:-translate-1/2",
});

const Or = ({ className, ...rest }: HTMLProps<HTMLDivElement>) => {
  const intl = useIntl();
  return (
    <span className={orStyles({ class: className })} {...rest}>
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
  classificationGroup: ClassificationGroup;
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
        <Wrapper cols={3}>
          <Card>
            <Heading level={headingAs} size="h6" className="mt-0 mb-3">
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
          </Card>
          <Or className="sm:left-1/3" />
          <Card>
            <Heading level={headingAs} size="h6" className="mt-0 mb-3">
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
          </Card>
          <Or className="sm:left-2/3" />
          <Card>
            <Heading level={headingAs} size="h6" className="mt-0 mb-3">
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
          </Card>
        </Wrapper>
      );
    case "AS":
    case "PM":
      return (
        <Wrapper>
          <Card>
            <Heading level={headingAs} size="h6" className="mt-0 mb-3">
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
            <Heading level={headingAs} size="h6" className="mt-0 mb-6">
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
    case "EC":
      return (
        <Wrapper>
          <Card>
            <Heading level={headingAs} size="h6" className="mt-0 mb-3">
              {intl.formatMessage(
                applicationMessages.educationRequirementECJustEducationHeading,
              )}
            </Heading>
            <Text>
              {intl.formatMessage(
                applicationMessages.educationRequirementECJustEducationDescription,
              )}
            </Text>
          </Card>
          <Or />
          <Card>
            <Heading level={headingAs} size="h6" className="mt-0 mb-3">
              {intl.formatMessage(
                applicationMessages.educationRequirementECEducationPlusHeading,
              )}
            </Heading>
            <Text>
              {intl.formatMessage(
                applicationMessages.educationRequirementECEducationPlusDescription,
              )}
            </Text>
          </Card>
        </Wrapper>
      );
    case "CR":
      return (
        <Wrapper>
          <Card>
            <Heading level={headingAs} size="h6" className="mt-0 mb-3">
              {intl.formatMessage({
                defaultMessage: "Applied work experience",
                id: "dwYJOo",
                description:
                  "Title for the applied work experience requirements",
              })}
            </Heading>
            <Text>
              {intl.formatMessage({
                defaultMessage:
                  "Combination of experience, training or education.",
                id: "gp+7iZ",
                description:
                  "Applied work experience for CR classification group",
              })}
            </Text>
          </Card>
          <Or />
          <Card>
            <Heading level={headingAs} size="h6" className="mt-0 mb-3">
              {intl.formatMessage({
                defaultMessage: "Two years of secondary school",
                id: "23YiFr",
                description: "Title for the secondary school requirements",
              })}
            </Heading>
            <Text>
              {intl.formatMessage({
                defaultMessage:
                  "Successful completion of two years of secondary school.",
                id: "3c2YZs",
                description: "Secondary school education requirements",
              })}
            </Text>
          </Card>
        </Wrapper>
      );
    case "IT":
      return (
        <Wrapper>
          <Card>
            <Heading level={headingAs} size="h6" className="mt-0 mb-3">
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
            <Ul>
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
            </Ul>
          </Card>
          <Or />
          <Card>
            <Heading level={headingAs} size="h6" className="mt-0 mb-3">
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
    default:
      return assertUnreachable(classificationGroup); // exhaustive switch
  }
};

export default EducationRequirements;
