import React from "react";
import { useIntl } from "react-intl";

import {
  commonMessages,
  getPoolStream,
  getPublishingGroup,
} from "@gc-digital-talent/i18n";

import ToggleForm from "~/components/ToggleForm/ToggleForm";
import { getClassificationName } from "~/utils/poolUtils";
import processMessages from "~/messages/processMessages";

import { DisplayProps } from "../../types";

const Display = ({ pool }: DisplayProps) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const { classifications, stream, name, processNumber, publishingGroup } =
    pool;

  return (
    <div
      data-h2-display="base(grid)"
      data-h2-gap="base(x1)"
      data-h2-grid-template-columns="p-tablet(repeat(2, 1fr))"
    >
      <ToggleForm.FieldDisplay
        hasError={!classifications?.length}
        label={intl.formatMessage(processMessages.classification)}
      >
        {classifications && classifications[0]
          ? getClassificationName(classifications[0], intl)
          : notProvided}
      </ToggleForm.FieldDisplay>
      <ToggleForm.FieldDisplay
        hasError={!stream}
        label={intl.formatMessage(processMessages.stream)}
      >
        {stream ? intl.formatMessage(getPoolStream(stream)) : notProvided}
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
      <div
        data-h2-display="base(grid)"
        data-h2-gap="base(x1)"
        data-h2-margin-bottom="base(x1)"
      >
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
          {publishingGroup
            ? intl.formatMessage(getPublishingGroup(publishingGroup))
            : notProvided}
        </ToggleForm.FieldDisplay>
      </div>
    </div>
  );
};

export default Display;
