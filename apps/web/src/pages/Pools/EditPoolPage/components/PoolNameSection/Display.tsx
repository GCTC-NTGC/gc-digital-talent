import { MessageDescriptor, useIntl } from "react-intl";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import {
  EditPoolNameFragment,
  PoolAreaOfSelection,
} from "@gc-digital-talent/graphql";

import ToggleForm from "~/components/ToggleForm/ToggleForm";
import { getClassificationName } from "~/utils/poolUtils";
import processMessages from "~/messages/processMessages";

import { DisplayProps } from "../../types";
import { SelectionLimitationDefinition } from "./PoolNameSection";

const Display = ({
  pool,
  possibleEmployeeLimitations,
}: DisplayProps<EditPoolNameFragment> & {
  possibleEmployeeLimitations: SelectionLimitationDefinition[];
}) => {
  const intl = useIntl();
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

  return (
    <>
      <div
        data-h2-display="base(grid)"
        data-h2-gap="base(x1)"
        data-h2-grid-template-columns="p-tablet(repeat(2, 1fr))"
        data-h2-margin-bottom="base(x1)"
      >
        <ToggleForm.FieldDisplay
          data-h2-grid-column="p-tablet(1 / span 2)"
          hasError={!areaOfSelection}
          label={intl.formatMessage(processMessages.areaOfSelection)}
        >
          {getLocalizedName(areaOfSelection?.label, intl) || notProvided}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          data-h2-grid-column="p-tablet(1 / span 2)"
          label={intl.formatMessage(selectionLimitationLabelMessage)}
        >
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
            data-h2-gap="base(x0.25)"
            data-h2-margin-top="base(x0.25)"
          >
            {possibleEmployeeLimitations?.map((singleSelectionLimitation) => {
              return (
                <div
                  key={singleSelectionLimitation.value}
                  data-h2-display="base(flex)"
                  data-h2-gap="base(x0.25)"
                  data-h2-align-items="base(center)"
                >
                  {poolSelectionLimitations
                    ?.map((l) => l.value)
                    .includes(singleSelectionLimitation.value) ? (
                    <CheckCircleIcon
                      data-h2-height="base(x0.75)"
                      data-h2-color="base(success) base:dark(success.lighter)"
                      aria-hidden="false"
                      aria-label={intl.formatMessage(commonMessages.selected)}
                    />
                  ) : (
                    <XCircleIcon
                      data-h2-height="base(x0.75)"
                      data-h2-color="base(background.darker)"
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
      <div
        data-h2-display="base(grid)"
        data-h2-gap="base(x1)"
        data-h2-margin-bottom="base(x1)"
      >
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
