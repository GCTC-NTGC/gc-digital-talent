import React from "react";
import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import {
  TextArea,
  WordCounter,
  countNumberOfWords,
} from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";
import { Heading } from "@gc-digital-talent/ui";

import NullExperienceType from "./NullExperienceType";

const TEXT_AREA_ROWS = 3;
const TEXT_AREA_MAX_WORDS = 200;
const FIELD_NAME = "details";

const TasksAndResponsibilities = () => {
  const intl = useIntl();
  const { watch } = useFormContext();
  const [currentValue, type] = watch([FIELD_NAME, "type"]);

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
        {notEmpty(type) ? (
          <>
            <p>
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
              label={intl.formatMessage({
                defaultMessage: "Your tasks and responsibilities",
                id: "ETNZUJ",
                description:
                  "Label for the experience task and responsibilities field",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
                validate: {
                  wordCount: (value: string) =>
                    countNumberOfWords(value) <= TEXT_AREA_MAX_WORDS ||
                    intl.formatMessage(errorMessages.overWordLimit, {
                      value: TEXT_AREA_MAX_WORDS,
                    }),
                },
              }}
            />
            <div
              data-h2-margin="base(-x.5, 0, 0, 0)"
              data-h2-text-align="base(right)"
            >
              <WordCounter
                text={currentValue}
                wordLimit={TEXT_AREA_MAX_WORDS}
              />
            </div>
          </>
        ) : (
          <NullExperienceType />
        )}
      </div>
    </>
  );
};

export default TasksAndResponsibilities;
