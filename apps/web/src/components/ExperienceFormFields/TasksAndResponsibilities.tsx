import React from "react";
import { useWatch } from "react-hook-form";
import { useIntl } from "react-intl";

import { errorMessages } from "@gc-digital-talent/i18n";
import { TextArea } from "@gc-digital-talent/forms";
import { notEmpty } from "@gc-digital-talent/helpers";
import { Heading } from "@gc-digital-talent/ui";

import { ExperienceType } from "~/types/experience";

import NullExperienceType from "./NullExperienceType";

const TEXT_AREA_ROWS = 3;
const TEXT_AREA_MAX_WORDS = 200;
const FIELD_NAME = "details";

interface TaskAndResponsibilitiesProps {
  experienceType?: ExperienceType;
}

const TasksAndResponsibilities = ({
  experienceType,
}: TaskAndResponsibilitiesProps) => {
  const intl = useIntl();
  const type = useWatch({ name: "experienceType" });
  const derivedType = type ?? experienceType;

  return (
    <>
      <Heading level="h3" size="h5">
        {intl.formatMessage({
          defaultMessage: "Tasks and responsibilities",
          id: "jDvu8u",
          description: "Heading for the tasks section of the experience form",
        })}
      </Heading>
      <div data-h2-margin="base(0, 0, x2, 0)">
        {notEmpty(derivedType) ? (
          <>
            <p data-h2-margin-bottom="base(x.5)">
              {intl.formatMessage({
                defaultMessage:
                  "Describe the key tasks and responsibilities you were responsible for during this role.",
                id: "4x7seT",
                description:
                  "Help text for the experience tasks and responsibilities field",
              })}
            </p>
            <TextArea
              id={FIELD_NAME}
              name={FIELD_NAME}
              rows={TEXT_AREA_ROWS}
              wordLimit={TEXT_AREA_MAX_WORDS}
              label={intl.formatMessage({
                defaultMessage: "Your tasks and responsibilities",
                id: "ETNZUJ",
                description:
                  "Label for the experience task and responsibilities field",
              })}
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

export default TasksAndResponsibilities;
