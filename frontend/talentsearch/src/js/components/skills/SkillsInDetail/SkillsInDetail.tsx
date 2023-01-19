import * as React from "react";
import { useIntl } from "react-intl";
import { useForm, useWatch } from "react-hook-form";
import { TrashIcon } from "@heroicons/react/24/solid";

import { Button } from "@common/components";
import { TextArea } from "@common/components/form";
import Well from "@common/components/Well";
import WordCounter from "@common/components/WordCounter/WordCounter";
import { countNumberOfWords } from "@common/helpers/formUtils";
import { getLocale } from "@common/helpers/localize";
import { errorMessages } from "@common/messages";

import type { FormSkills } from "../../experienceForm/types";

type FormValues = {
  skills: { [id: string]: { details: string } };
};

export interface SkillsInDetailProps {
  skills: FormSkills;
  required?: boolean;
  onDelete: (id: string) => void;
}

const SkillsInDetail: React.FunctionComponent<SkillsInDetailProps> = ({
  skills,
  required,
  onDelete,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const { register } = useForm();
  const watchSkills: FormValues["skills"] = useWatch({ name: "skills" });
  const MAX_WORDS = 160;

  return (
    <section>
      <h2 data-h2-font-size="base(h3, 1)" data-h2-margin="base(x2, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage: "3. Skills in detail",
          id: "AtZhfR",
          description:
            "Heading for skills in detail section of experience form.",
        })}
      </h2>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "After adding some skills please explain how you used them, try answering one or more of these questions:",
          id: "dTMBj9",
          description:
            "Description for skills in detail section of experience form.",
        })}
      </p>
      <ul
        data-h2-margin="base(x.5, 0, x1, 0)"
        data-h2-padding="base(0, 0, 0, x1)"
        data-h2-color="base(dt-gray.dark)"
        data-h2-font-style="base(italic)"
      >
        <li>
          {intl.formatMessage({
            defaultMessage:
              "What did you accomplish, create or deliver using this skill?",
            id: "Dy5kjx",
            description:
              "Question for user in skills in detail section of experience form.",
          })}
        </li>
        <li>
          {intl.formatMessage({
            defaultMessage:
              "What tasks or activities did you do that relate to this skill?",
            id: "d0qGas",
            description:
              "Question for user in skills in detail section of experience form.",
          })}
        </li>
        <li>
          {intl.formatMessage({
            defaultMessage:
              "Were there any special techniques or approaches that you used?",
            id: "PH8qp2",
            description:
              "Question for user in skills in detail section of experience form.",
          })}
        </li>
        <li>
          {intl.formatMessage({
            defaultMessage:
              "How much responsibility did you have in this role?",
            id: "b9/MXQ",
            description:
              "Question for user in skills in detail section of experience form.",
          })}
        </li>
      </ul>
      <Well>
        {skills.length > 0 ? (
          skills.map(({ id, name, skillId }, index) => (
            <React.Fragment key={id}>
              <div
                data-h2-display="base(flex)"
                data-h2-justify-content="base(space-between)"
              >
                <p data-h2-font-weight="base(700)">
                  {index + 1}. {name[locale]}
                </p>
                <Button
                  color="secondary"
                  mode="inline"
                  data-h2-padding="base(0)"
                  data-h2-text-decoration="base(underline)"
                  data-h2-display="base(flex)"
                  data-h2-align-items="base(center)"
                  onClick={() => {
                    onDelete(skillId);
                  }}
                >
                  <TrashIcon style={{ width: "1rem" }} />
                  <span
                    data-h2-padding="base(0, 0, 0, x.25)"
                    data-h2-visually-hidden="base(invisible) p-tablet(revealed)"
                  >
                    {intl.formatMessage({
                      defaultMessage: "Remove from experience",
                      id: "70bx4O",
                      description:
                        "Message in skills in details section to remove skill from the experience.",
                    })}
                  </span>
                </Button>
              </div>
              <div data-h2-margin="base(-x.5, 0, 0, 0)">
                <input
                  type="hidden"
                  {...register(`skills.${index}.skillId` as const, {
                    required: true,
                  })}
                />
                <TextArea
                  id={`skill-in-detail-${id}`}
                  label={intl.formatMessage({
                    defaultMessage: "Skill in detail",
                    id: "J5oMC8",
                    description:
                      "Label for the textarea in the skills in detail section.",
                  })}
                  placeholder={intl.formatMessage({
                    defaultMessage: "How I used this skill...",
                    id: "i99arX",
                    description:
                      "Placeholder message for textarea in the skills in detail section.",
                  })}
                  name={`skills.${index}.details`}
                  rules={{
                    required: required
                      ? intl.formatMessage(errorMessages.required)
                      : undefined,
                    validate: {
                      wordCount: (value: string) =>
                        countNumberOfWords(value) <= MAX_WORDS ||
                        intl.formatMessage(errorMessages.overWordLimit, {
                          value: MAX_WORDS,
                        }),
                    },
                  }}
                >
                  <div data-h2-align-self="base(flex-end)">
                    <WordCounter
                      text={
                        watchSkills && watchSkills[index]
                          ? watchSkills[index].details
                          : ""
                      }
                      wordLimit={MAX_WORDS}
                    />
                  </div>
                </TextArea>
              </div>
            </React.Fragment>
          ))
        ) : (
          <p data-h2-font-style="base(italic)">
            {intl.formatMessage({
              defaultMessage:
                "There are no skills attached to this experience yet. You can add some on the step above.",
              id: "H05wXr",
              description:
                "Message to user when no skills have been attached to experience.",
            })}
          </p>
        )}
      </Well>
    </section>
  );
};

export default SkillsInDetail;
