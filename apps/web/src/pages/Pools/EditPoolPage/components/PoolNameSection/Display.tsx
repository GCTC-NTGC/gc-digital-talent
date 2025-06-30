import { MessageDescriptor, useIntl } from "react-intl";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";
import { ReactNode } from "react";

import {
  commonMessages,
  getLocale,
  getLocalizedName,
  Locales,
} from "@gc-digital-talent/i18n";
import {
  EditPoolNameFragment,
  PoolAreaOfSelection,
  PoolSelectionLimitation,
} from "@gc-digital-talent/graphql";
import { Link, Well } from "@gc-digital-talent/ui";

import ToggleForm from "~/components/ToggleForm/ToggleForm";
import { getClassificationName } from "~/utils/poolUtils";
import processMessages from "~/messages/processMessages";

import { DisplayProps } from "../../types";
import { SelectionLimitationDefinition } from "./PoolNameSection";

const pseaUrl: Record<Locales, string> = {
  en: "https://laws-lois.justice.gc.ca/eng/acts/p-33.01/",
  fr: "https://laws-lois.justice.gc.ca/fra/lois/p-33.01/",
} as const;

const Display = ({
  pool,
  possibleEmployeeLimitations,
}: DisplayProps<EditPoolNameFragment> & {
  possibleEmployeeLimitations: SelectionLimitationDefinition[];
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const {
    areaOfSelection,
    selectionLimitations: poolSelectionLimitations,
    classification,
    department,
    workStream,
    name,
    processNumber,
    publishingGroup,
    opportunityLength,
  } = pool;

  let selectionLimitationLabelMessage: MessageDescriptor =
    commonMessages.notProvided;
  switch (areaOfSelection?.value) {
    case PoolAreaOfSelection.Employees:
      selectionLimitationLabelMessage =
        processMessages.selectionLimitationsEmployee;
      break;
    case PoolAreaOfSelection.Public:
      selectionLimitationLabelMessage =
        processMessages.selectionLimitationsPublic;
      break;
  }

  const poolSelectionLimitationValues =
    poolSelectionLimitations?.map((l) => l.value) ?? [];

  return (
    <>
      <div className="mb-6 grid gap-6 xs:grid-cols-2">
        <ToggleForm.FieldDisplay
          className="xs:col-span-2"
          hasError={!areaOfSelection}
          label={intl.formatMessage(processMessages.areaOfSelection)}
        >
          {getLocalizedName(areaOfSelection?.label, intl) || notProvided}
        </ToggleForm.FieldDisplay>
        {areaOfSelection ? (
          <ToggleForm.FieldDisplay
            className="xs:col-span-2"
            label={intl.formatMessage(selectionLimitationLabelMessage)}
          >
            <div className="mt-1.5 flex flex-col gap-1.5">
              {possibleEmployeeLimitations?.map((singleSelectionLimitation) => {
                return (
                  <div
                    key={singleSelectionLimitation.value}
                    className="flex items-center gap-1.5"
                  >
                    {poolSelectionLimitationValues.includes(
                      singleSelectionLimitation.value,
                    ) ? (
                      <CheckCircleIcon
                        className="h-4.5 text-success dark:text-success-200"
                        aria-hidden="false"
                        aria-label={intl.formatMessage(commonMessages.selected)}
                      />
                    ) : (
                      <XCircleIcon
                        className="size-4.5 text-gray-600 dark:text-gray-200"
                        aria-hidden="false"
                        aria-label={intl.formatMessage(
                          commonMessages.notSelected,
                        )}
                      />
                    )}
                    {intl.formatMessage(singleSelectionLimitation.label)}
                  </div>
                );
              })}
            </div>
          </ToggleForm.FieldDisplay>
        ) : null}
        {poolSelectionLimitationValues.includes(
          PoolSelectionLimitation.CanadianCitizens,
        ) ? (
          <Well color="warning" className="xs:col-span-2">
            {intl.formatMessage(
              {
                defaultMessage:
                  "By selecting “Only Canadian citizens can apply”, you’re confirming that this job opportunity is with a department or agency that is not subject to the <a><italic>Public Service Employment Act</italic></a>.",
                id: "4f81Y1",
                description:
                  "Warning message when selecting the only-canadian-citizens limitation option",
              },
              {
                a: (chunks: ReactNode) => (
                  <Link href={pseaUrl[locale]} color="warning" newTab external>
                    {chunks}
                  </Link>
                ),
              },
            )}
          </Well>
        ) : null}
        <ToggleForm.FieldDisplay
          hasError={!classification}
          label={intl.formatMessage(processMessages.classification)}
        >
          {classification
            ? getClassificationName(classification, intl)
            : notProvided}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          hasError={!workStream}
          label={intl.formatMessage(processMessages.stream)}
        >
          {getLocalizedName(workStream?.name, intl)}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          hasError={!name?.en}
          label={intl.formatMessage(processMessages.titleEn)}
        >
          {name?.en ?? notProvided}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          hasError={!name?.fr}
          label={intl.formatMessage(processMessages.titleFr)}
        >
          {name?.fr ?? notProvided}
        </ToggleForm.FieldDisplay>
      </div>
      <div className="mb-6 grid gap-6">
        <ToggleForm.FieldDisplay
          hasError={!department}
          label={intl.formatMessage(commonMessages.department)}
        >
          {department ? getLocalizedName(department.name, intl) : notProvided}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          hasError={!opportunityLength}
          label={intl.formatMessage(processMessages.employmentDuration)}
        >
          {getLocalizedName(opportunityLength?.label, intl)}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          hasError={!processNumber}
          label={intl.formatMessage(processMessages.processNumber)}
        >
          {processNumber ?? notProvided}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          hasError={!publishingGroup}
          label={intl.formatMessage(processMessages.publishingGroup)}
        >
          {getLocalizedName(publishingGroup?.label, intl)}
        </ToggleForm.FieldDisplay>
      </div>
    </>
  );
};

export default Display;
