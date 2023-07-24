import * as React from "react";
import { useIntl } from "react-intl";
import { useForm } from "react-hook-form";

import { Button, Card } from "@gc-digital-talent/ui";
import { TextArea } from "@gc-digital-talent/forms";
import { getLocale, errorMessages } from "@gc-digital-talent/i18n";

import type { FormSkills } from "~/types/experience";
import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";

export interface SkillsInDetailProps {
  skills: FormSkills;
  onDelete: (id: string) => void;
}

const MAX_WORDS = 160;

const SkillsInDetail = ({ skills, onDelete }: SkillsInDetailProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const { register } = useForm();

  return (
    <section>
      {skills.length > 0 &&
        skills.map(({ id, name, skillId }, index) => (
          <Card
            key={id}
            title=""
            color="white"
            bold
            data-h2-padding-bottom="base(x1)"
          >
            <div
              data-h2-display="base(flex)"
              data-h2-justify-content="base(space-between)"
            >
              <p data-h2-font-weight="base(700)">
                {index + 1}. {name[locale]}
              </p>
              <Button
                color="error"
                mode="inline"
                data-h2-text-decoration="base(underline)"
                onClick={() => {
                  onDelete(skillId);
                }}
              >
                <XCircleIcon
                  style={{ width: "1rem" }}
                  data-h2-vertical-align="base(middle)"
                />
                <span data-h2-padding="base(0, 0, 0, x.25)">
                  {intl.formatMessage({
                    defaultMessage: "Remove skill",
                    id: "M051tF",
                    description:
                      "Message in skills in details section to remove skill from the experience.",
                  })}
                </span>
              </Button>
            </div>
            <div data-h2-margin="base(x.5 0)">
              <input
                type="hidden"
                {...register(`skills.${index}.skillId` as const, {
                  required: true,
                })}
              />
              <TextArea
                id={`skill-in-detail-${id}`}
                name={`skills.${index}.details`}
                wordLimit={MAX_WORDS}
                label={intl.formatMessage({
                  defaultMessage:
                    "Describe how this skill featured in this role",
                  id: "8kMPLB",
                  description:
                    "Label for the textarea in the skills in detail section.",
                })}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
            </div>
          </Card>
        ))}
    </section>
  );
};

export default SkillsInDetail;
