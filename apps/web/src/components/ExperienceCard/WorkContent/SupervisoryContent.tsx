import { useIntl } from "react-intl";

import { CSuiteRoleTitle, WorkExperience } from "@gc-digital-talent/graphql";
import { Separator } from "@gc-digital-talent/ui";
import {
  commonMessages,
  getLocale,
  localizeCurrency,
} from "@gc-digital-talent/i18n";

import { getExperienceFormLabels } from "~/utils/experienceUtils";

import ContentSection from "../ContentSection";
import { ContentProps } from "../types";

const SupervisoryContent = ({
  experience: {
    supervisoryPosition,
    supervisedEmployees,
    supervisedEmployeesNumber,
    budgetManagement,
    annualBudgetAllocation,
    seniorManagementStatus,
    cSuiteRoleTitle,
    otherCSuiteRoleTitle,
  },
  headingLevel,
}: ContentProps<Omit<WorkExperience, "user">>) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const experienceFormLabels = getExperienceFormLabels(intl);

  return (
    <>
      <ContentSection
        title={experienceFormLabels.supervisoryPosition}
        headingLevel={headingLevel}
      >
        {supervisoryPosition
          ? intl.formatMessage({
              defaultMessage:
                "This role was a management or supervisory position.",
              id: "N/1OYS",
              description: "Label displayed for supervisory position",
            })
          : intl.formatMessage({
              defaultMessage:
                "This role was not a management or supervisory position.",
              id: "zpIBVf",
              description: "Label displayed for supervisory position false",
            })}
      </ContentSection>
      {supervisoryPosition && (
        <>
          <Separator space="sm" decorative />
          <ContentSection
            title={experienceFormLabels.supervisedEmployees}
            headingLevel={headingLevel}
          >
            {supervisedEmployees
              ? intl.formatMessage({
                  defaultMessage: "I supervised employees in this role.",
                  id: "6RGluQ",
                  description: "Label displayed for supervised employees",
                })
              : intl.formatMessage({
                  defaultMessage: "I did not supervise employees in this role.",
                  id: "ay7kkl",
                  description: "Label displayed for supervised employees false",
                })}
          </ContentSection>
          <Separator space="sm" decorative />
          {supervisedEmployees && (
            <>
              <ContentSection
                title={experienceFormLabels.supervisedEmployeesNumber}
                headingLevel={headingLevel}
              >
                {supervisedEmployeesNumber ??
                  intl.formatMessage(commonMessages.notApplicable)}
              </ContentSection>
              <Separator space="sm" decorative />
            </>
          )}
          <ContentSection
            title={experienceFormLabels.budgetManagement}
            headingLevel={headingLevel}
          >
            {budgetManagement
              ? intl.formatMessage({
                  defaultMessage:
                    "This role required that I managed a dedicated budget or had delegated signing authority for a budget.",
                  id: "144l3L",
                  description: "Label displayed for budget management",
                })
              : intl.formatMessage({
                  defaultMessage:
                    "This role did not require that I managed a dedicated budget or had delegated signing authority for a budget.",
                  id: "YNP0uJ",
                  description: "Label displayed for budget management false",
                })}
          </ContentSection>
          <Separator space="sm" decorative />
          {budgetManagement && (
            <>
              <ContentSection
                title={experienceFormLabels.annualBudgetAllocation}
                headingLevel={headingLevel}
              >
                {annualBudgetAllocation
                  ? localizeCurrency(annualBudgetAllocation, locale)
                  : intl.formatMessage(commonMessages.notApplicable)}
              </ContentSection>
              <Separator space="sm" decorative />
            </>
          )}
          <ContentSection
            title={experienceFormLabels.seniorManagementStatus}
            headingLevel={headingLevel}
          >
            {seniorManagementStatus
              ? intl.formatMessage({
                  defaultMessage:
                    "This was a chief or deputy chief (C-suite) role.",
                  id: "ZOKEiB",
                  description: "Label displayed for senior management",
                })
              : intl.formatMessage({
                  defaultMessage:
                    "This was not a chief or deputy chief (C-suite) role.",
                  id: "fsTqku",
                  description: "Label displayed for senior management false",
                })}
          </ContentSection>
          {seniorManagementStatus && (
            <>
              <Separator space="sm" decorative />
              <ContentSection
                title={experienceFormLabels.cSuiteRoleTitle}
                headingLevel={headingLevel}
              >
                {cSuiteRoleTitle
                  ? cSuiteRoleTitle?.label.localized
                  : intl.formatMessage(commonMessages.notApplicable)}
              </ContentSection>
              {cSuiteRoleTitle?.value === CSuiteRoleTitle.Other && (
                <>
                  <Separator space="sm" decorative />
                  <ContentSection
                    title={experienceFormLabels.otherCSuiteRoleTitle}
                    headingLevel={headingLevel}
                  >
                    {otherCSuiteRoleTitle ??
                      intl.formatMessage(commonMessages.notApplicable)}
                  </ContentSection>
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default SupervisoryContent;
