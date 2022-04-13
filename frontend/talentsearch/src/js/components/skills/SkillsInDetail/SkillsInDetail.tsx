import { Button } from "@common/components";
import { TextArea } from "@common/components/form";
import WordCounter from "@common/components/WordCounter/WordCounter";
import { countNumberOfWords } from "@common/helpers/formUtils";
import { getLocale } from "@common/helpers/localize";
import { errorMessages } from "@common/messages";
import { TrashIcon } from "@heroicons/react/solid";
import * as React from "react";
import { useWatch } from "react-hook-form";
import { useIntl } from "react-intl";
import { Skill } from "../../../api/generated";

type FormValues = {
  skills: { [id: string]: { details: string } };
};

export interface SkillsInDetailProps {
  skills: Skill[];
  onDelete: (id: string) => void;
}

const SkillsInDetail: React.FunctionComponent<SkillsInDetailProps> = ({
  skills,
  onDelete,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const watchSkills: FormValues["skills"] = useWatch({ name: "skills" });
  const MAX_WORDS = 5;

  return (
    <section data-h2-margin="b(bottom, l)">
      <h2 data-h2-font-size="b(h3)">
        {intl.formatMessage({
          defaultMessage: "3. Skills in detail",
          description:
            "Heading for skills in detail section of experience form.",
        })}
      </h2>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "After adding some skills please explain how you used them, try answering one or more of these questions:",
          description:
            "Description for skills in detail section of experience form.",
        })}
      </p>
      <ul
        data-h2-margin="b(bottom, m)"
        data-h2-font-color="b(darkgray)"
        data-h2-font-style="b(italic)"
      >
        <li>
          {intl.formatMessage({
            defaultMessage:
              "What did you accomplish, create or deliver using this skill?",
            description:
              "Question for user in skills in detail section of experience form.",
          })}
        </li>
        <li>
          {intl.formatMessage({
            defaultMessage:
              "What tasks or activities did you do that relate to this skill?",
            description:
              "Question for user in skills in detail section of experience form.",
          })}
        </li>
        <li>
          {intl.formatMessage({
            defaultMessage:
              "Were there any special techniques or approaches that you used?",
            description:
              "Question for user in skills in detail section of experience form.",
          })}
        </li>
        <li>
          {intl.formatMessage({
            defaultMessage:
              "How much responsibility did you have in this role?",
            description:
              "Question for user in skills in detail section of experience form.",
          })}
        </li>
      </ul>
      <div
        data-h2-padding="b(all, m)"
        data-h2-bg-color="b(lightgray)"
        data-h2-radius="b(s)"
      >
        {skills.length > 0 ? (
          skills.map(({ id, name, key }, index) => (
            <React.Fragment key={key}>
              <div
                data-h2-display="b(flex)"
                data-h2-justify-content="b(space-between)"
              >
                <p data-h2-font-weight="b(700)">
                  {index + 1}. {name[locale]}
                </p>
                <Button
                  color="secondary"
                  mode="inline"
                  data-h2-padding="b(top-bottom, s) b(right-left, none)"
                  data-h2-font-style="b(underline)"
                  data-h2-display="b(flex)"
                  data-h2-align-items="b(center)"
                  onClick={() => {
                    onDelete(id);
                  }}
                >
                  <TrashIcon style={{ width: "1rem" }} />
                  <span
                    data-h2-padding="b(left, xs)"
                    data-h2-visibility="b(invisible) s(visible)"
                  >
                    {intl.formatMessage({
                      defaultMessage: "Remove from experience",
                      description:
                        "Message in skills in details section to remove skill from the experience.",
                    })}
                  </span>
                </Button>
              </div>
              <div>
                <TextArea
                  id={`skill-in-detail-${key}`}
                  label={intl.formatMessage({
                    defaultMessage: "Skill in detail",
                    description:
                      "Label for the textarea in the skills in detail section.",
                  })}
                  placeholder={intl.formatMessage({
                    defaultMessage: "How I used this skill...",
                    description:
                      "Placeholder message for textarea in the skills in detail section.",
                  })}
                  name={`skills.${id}.details`}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                    validate: {
                      wordCount: (value: string) =>
                        countNumberOfWords(value) <= MAX_WORDS ||
                        intl.formatMessage(errorMessages.overWordLimit, {
                          value: MAX_WORDS,
                        }),
                    },
                  }}
                >
                  <div data-h2-align-self="b(flex-end)">
                    <WordCounter
                      text={watchSkills[id] ? watchSkills[id].details : ""}
                      wordLimit={MAX_WORDS}
                    />
                  </div>
                </TextArea>
              </div>
            </React.Fragment>
          ))
        ) : (
          <p data-h2-font-style="b(italic)">
            {intl.formatMessage({
              defaultMessage:
                "There are no skills attached to this experience yet. You can add some on the step above.",
              description:
                "Message to user when no skills have been attached to experience.",
            })}
          </p>
        )}
      </div>
    </section>
  );
};

export default SkillsInDetail;
