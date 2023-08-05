import React from "react";
import { useWatch } from "react-hook-form";
import { useIntl } from "react-intl";

import { errorMessages } from "@gc-digital-talent/i18n";
import { TextArea } from "@gc-digital-talent/forms";
import { notEmpty } from "@gc-digital-talent/helpers";
import { Heading } from "@gc-digital-talent/ui";

import { ExperienceType } from "~/types/experience";

import { getExperienceFormLabels } from "~/utils/experienceUtils";
import NullExperienceType from "./NullExperienceType";

const TEXT_AREA_ROWS = 3;
const TEXT_AREA_MAX_WORDS = 200;
const FIELD_NAME = "details";

interface AdditionalDetailsProps {
  experienceType?: ExperienceType;
}

const AdditionalDetails = ({ experienceType }: AdditionalDetailsProps) => {
  const intl = useIntl();
  const experienceLabels = getExperienceFormLabels(intl);
  const type = useWatch({ name: "experienceType" });
  const derivedType = type ?? experienceType;

  return (
    <>
      <Heading level="h3" size="h5">
        {intl.formatMessage({
          defaultMessage: "Highlight additional details",
          id: "u+r0gl",
          description: "Heading for the tasks section of the experience form",
        })}
      </Heading>
      <div data-h2-margin="base(0, 0, x2, 0)">
        {notEmpty(derivedType) ? (
          <>
            <p data-h2-margin-bottom="base(x.5)">
              {intl.formatMessage({
                defaultMessage:
                  "Optionally describe <strong>key tasks</strong>, <strong>responsibilities</strong>, or <strong>other information</strong> you feel were crucial in making this experience important.",
                id: "KteuZ5",
                description:
                  "Help text for the experience additional details field",
              })}
            </p>
            <TextArea
              id={FIELD_NAME}
              name={FIELD_NAME}
              rows={TEXT_AREA_ROWS}
              wordLimit={TEXT_AREA_MAX_WORDS}
              label={experienceLabels.details}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
          </>
        ) : (
          <NullExperienceType />
        )}
      </div>
    </>
  );
};

export default AdditionalDetails;
