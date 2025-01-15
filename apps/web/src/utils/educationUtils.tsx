import { IntlShape } from "react-intl";
import uniqueId from "lodash/uniqueId";
import { ReactNode } from "react";

import { Locales } from "@gc-digital-talent/i18n";
import { Link } from "@gc-digital-talent/ui";
import { Radio } from "@gc-digital-talent/forms";
import { EducationRequirementOption } from "@gc-digital-talent/graphql";

import applicationMessages from "~/messages/applicationMessages";

export const foreignDegreeLink = (chunks: ReactNode, locale: Locales) => {
  const href =
    locale === "en"
      ? "https://www.canada.ca/en/public-service-commission/jobs/services/gc-jobs/degree-equivalency.html"
      : "https://www.canada.ca/fr/commission-fonction-publique/emplois/services/emplois-gc/equivalence-diplomes.html";
  return (
    <Link href={href} newTab external>
      {chunks}
    </Link>
  );
};

export const degreeLink = (chunks: ReactNode, locale: Locales) => {
  const href =
    locale === "en"
      ? "https://www.canada.ca/en/treasury-board-secretariat/services/staffing/qualification-standards/core.html#deg"
      : "https://www.canada.ca/fr/secretariat-conseil-tresor/services/dotation/normes-qualification/centrale.html#Dipl";
  return (
    <Link href={href} newTab external>
      {chunks}
    </Link>
  );
};

export const postSecondaryLink = (chunks: ReactNode, locale: Locales) => {
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

export const eligibilityLink = (chunks: ReactNode, locale: Locales) => {
  const href =
    locale === "en"
      ? "https://www.canada.ca/en/treasury-board-secretariat/services/staffing/qualification-standards/core.html#elig"
      : "https://www.canada.ca/fr/secretariat-conseil-tresor/services/dotation/normes-qualification/centrale.html#admis";
  return (
    <Link href={href} newTab external>
      {chunks}
    </Link>
  );
};

export const acceptableLink = (chunks: ReactNode, locale: Locales) => {
  const href =
    locale === "en"
      ? "https://www.canada.ca/en/treasury-board-secretariat/services/staffing/qualification-standards/core.html#acce"
      : "https://www.canada.ca/fr/secretariat-conseil-tresor/services/dotation/normes-qualification/centrale.html#acc";
  return (
    <Link href={href} newTab external>
      {chunks}
    </Link>
  );
};

const qualityStandardsLink = (chunks: ReactNode, locale: Locales) => {
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

const appliedWorkListMessages = (isIAP = false) => [
  applicationMessages.onTheJobLearning,
  applicationMessages.nonConventionalTraining,
  applicationMessages.formalEducation,
  isIAP
    ? applicationMessages.otherExperience
    : applicationMessages.otherFieldExperience,
];

export const getEducationRequirementOptions = (
  intl: IntlShape,
  locale: Locales,
  classificationGroup?: string,
  isIAP = false,
): Radio[] => {
  switch (classificationGroup) {
    case "EC":
      return [
        {
          value: EducationRequirementOption.Education,
          label: (
            <strong>
              {intl.formatMessage(
                applicationMessages.educationRequirementECJustEducationHeading,
              )}
            </strong>
          ),
          contentBelow: (
            <p>
              {intl.formatMessage(
                applicationMessages.educationRequirementECJustEducationDescription,
              )}
            </p>
          ),
        },
        {
          value: EducationRequirementOption.AppliedWork,
          label: (
            <strong>
              {intl.formatMessage(
                applicationMessages.educationRequirementECEducationPlusHeading,
              )}
            </strong>
          ),
          contentBelow: (
            <p>
              {intl.formatMessage(
                applicationMessages.educationRequirementECEducationPlusDescription,
              )}
            </p>
          ),
        },
      ];
    case "EX":
      return [
        {
          value: EducationRequirementOption.ProfessionalDesignation,
          label: intl.formatMessage({
            defaultMessage:
              "<strong>I meet the professional designation option</strong>",
            id: "Cf8mWv",
            description:
              "Radio group option for education requirement filter in application education form.",
          }),
          contentBelow: (
            <p>
              {intl.formatMessage(applicationMessages.professionalDesignation, {
                link: (msg: ReactNode) => eligibilityLink(msg, locale),
              })}
            </p>
          ),
        },
        {
          value: EducationRequirementOption.AppliedWork,
          label: intl.formatMessage({
            defaultMessage:
              "<strong>I meet the applied work experience option</strong>",
            id: "SNwPLZ",
            description:
              "Radio group option for education requirement filter in application education form.",
          }),
          contentBelow: (
            <p>
              {intl.formatMessage(applicationMessages.appliedWorkExpEXGroup, {
                link: (msg: ReactNode) => acceptableLink(msg, locale),
              })}
            </p>
          ),
        },
        {
          value: EducationRequirementOption.Education,
          label: intl.formatMessage({
            defaultMessage:
              "<strong>I meet the graduation with degree option</strong>",
            id: "3BLgOa",
            description:
              "Radio group option for education requirement filter in application education form.",
          }),
          contentBelow: (
            <>
              <p>
                {intl.formatMessage(applicationMessages.graduationWithDegree, {
                  degreeLink: (msg: ReactNode) => degreeLink(msg, locale),
                  postSecondaryLink: (msg: ReactNode) =>
                    postSecondaryLink(msg, locale),
                })}
              </p>
              <p>
                {intl.formatMessage(applicationMessages.foreignDegree, {
                  foreignDegreeLink: (msg: ReactNode) =>
                    foreignDegreeLink(msg, locale),
                })}
              </p>
            </>
          ),
        },
      ];
    case "AS":
    case "PM":
      return [
        {
          value: EducationRequirementOption.AppliedWork,
          label: intl.formatMessage({
            defaultMessage:
              "<strong>I meet the applied work experience option</strong>",
            id: "SNwPLZ",
            description:
              "Radio group option for education requirement filter in application education form.",
          }),
          contentBelow: (
            <p>
              {intl.formatMessage(applicationMessages.appliedWorkExpPMGroup)}
            </p>
          ),
        },
        {
          value: EducationRequirementOption.Education,
          label: intl.formatMessage({
            defaultMessage:
              "<strong>I meet the secondary school diploma option</strong>",
            id: "qN9zOb",
            description:
              "Radio group option for education requirement filter in application education form.",
          }),
          contentBelow: (
            <p>
              {intl.formatMessage(
                applicationMessages.secondarySchoolDescription,
              )}
            </p>
          ),
        },
      ];
    case "CR":
      return [
        {
          value: EducationRequirementOption.AppliedWork,
          label: intl.formatMessage({
            defaultMessage:
              "<strong>I meet the applied work experience option</strong>",
            id: "SNwPLZ",
            description:
              "Radio group option for education requirement filter in application education form.",
          }),
          contentBelow: (
            <p data-h2-margin="base(0, 0, x.5, 0)">
              {intl.formatMessage({
                defaultMessage:
                  "Combination of experience, training or education.",
                id: "Ulbls0",
                description: "Applied work experience description for CR group",
              })}
            </p>
          ),
        },
        {
          value: EducationRequirementOption.Education,
          label: intl.formatMessage({
            defaultMessage:
              "<strong>I meet the 2 years of secondary school option</strong>",
            id: "xZr1kv",
            description:
              "Radio group option for education requirement filter in application education form.",
          }),
          contentBelow: (
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Successful completion of 2 years of secondary school.",
                id: "fOP6Ny",
                description:
                  "Descriptive text explaining education requirement for CR group",
              })}
            </p>
          ),
        },
      ];
    default:
      return [
        {
          value: EducationRequirementOption.AppliedWork,
          label: isIAP
            ? intl.formatMessage({
                defaultMessage:
                  "<strong>I meet the applied experience option</strong>",
                id: "kukr/B",
                description:
                  "Radio group option for education requirement filter in application education form - IAP variant.",
              })
            : intl.formatMessage({
                defaultMessage:
                  "<strong>I meet the applied work experience option</strong>",
                id: "SNwPLZ",
                description:
                  "Radio group option for education requirement filter in application education form.",
              }),
          contentBelow: (
            <>
              <p data-h2-margin-bottom="base(x.5)">
                {intl.formatMessage(applicationMessages.appliedWorkExperience)}
              </p>
              <ul>
                {appliedWorkListMessages(isIAP).map((value) => (
                  <li key={uniqueId()} data-h2-margin="base(0, 0, x.25, 0)">
                    {intl.formatMessage(value)}
                  </li>
                ))}
              </ul>
            </>
          ),
        },
        {
          value: EducationRequirementOption.Education,
          label: isIAP
            ? intl.formatMessage({
                defaultMessage:
                  "<strong>I have a high school diploma or equivalent (e.g. GED)</strong>",
                id: "8IIIER",
                description:
                  "Radio group option for education requirement filter in IAP application education form.",
              })
            : intl.formatMessage({
                defaultMessage:
                  "<strong>I meet the 2-year post-secondary option</strong>",
                id: "j+jnML",
                description:
                  "Radio group option for education requirement filter in application education form.",
              }),
          contentBelow: (
            <p>
              {isIAP
                ? intl.formatMessage({
                    defaultMessage:
                      "Successful completion of a standard high school diploma or GED equivalent.",
                    id: "nIJlba",
                    description:
                      "Message under radio button in IAP application education page.",
                  })
                : intl.formatMessage(
                    applicationMessages.postSecondaryEducation,
                    {
                      link: (msg: ReactNode) =>
                        qualityStandardsLink(msg, locale),
                    },
                  )}
            </p>
          ),
        },
      ];
  }
};
