import { useIntl } from "react-intl";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { EditPoolNameFragment } from "@gc-digital-talent/graphql";

import ToggleForm from "~/components/ToggleForm/ToggleForm";
import { getClassificationName } from "~/utils/poolUtils";
import processMessages from "~/messages/processMessages";

import { DisplayProps } from "../../types";

const Display = ({ pool }: DisplayProps<EditPoolNameFragment>) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const {
    classification,
    department,
    stream,
    name,
    processNumber,
    publishingGroup,
    opportunityLength,
  } = pool;

  return (
    <>
      <div
        data-h2-display="base(grid)"
        data-h2-gap="base(x1)"
        data-h2-grid-template-columns="p-tablet(repeat(2, 1fr))"
        data-h2-margin-bottom="base(x1)"
      >
        <ToggleForm.FieldDisplay
          hasError={!classification}
          label={intl.formatMessage(processMessages.classification)}
        >
          {classification
            ? getClassificationName(classification, intl)
            : notProvided}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          hasError={!stream}
          label={intl.formatMessage(processMessages.stream)}
        >
          {getLocalizedName(stream?.label, intl)}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          hasError={!name?.en}
          label={intl.formatMessage(processMessages.titleEn)}
        >
          {name?.en || notProvided}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          hasError={!name?.fr}
          label={intl.formatMessage(processMessages.titleFr)}
        >
          {name?.fr || notProvided}
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
          label={intl.formatMessage(processMessages.opportunityLength)}
        >
          {getLocalizedName(opportunityLength?.label, intl)}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          hasError={!processNumber}
          label={intl.formatMessage(processMessages.processNumber)}
        >
          {processNumber || notProvided}
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
