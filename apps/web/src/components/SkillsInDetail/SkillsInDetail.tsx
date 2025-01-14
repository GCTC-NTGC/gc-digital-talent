import { useIntl } from "react-intl";
import { useForm } from "react-hook-form";
import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";

import { Button, CardBasic } from "@gc-digital-talent/ui";
import { TextArea } from "@gc-digital-talent/forms";
import {
  getLocale,
  errorMessages,
  getLocalizedName,
  Locales,
} from "@gc-digital-talent/i18n";

import type { FormSkills } from "~/types/experience";
import { FRENCH_WORDS_PER_ENGLISH_WORD } from "~/constants/talentSearchConstants";

interface SkillsInDetailProps {
  skills: FormSkills;
  onDelete: (id: string) => void;
}

const TEXT_AREA_MAX_WORDS_EN = 400;

const SkillsInDetail = ({ skills, onDelete }: SkillsInDetailProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const { register } = useForm();

  const wordCountLimits: Record<Locales, number> = {
    en: TEXT_AREA_MAX_WORDS_EN,
    fr: Math.round(TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD),
  } as const;

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x.5 0)"
    >
      {skills.length > 0 &&
        skills.map(({ id, name, skillId }, index) => (
          <CardBasic key={id}>
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
                aria-label={intl.formatMessage(
                  {
                    defaultMessage: "Remove skill {name} from experience",
                    id: "/K8/eG",
                    description:
                      "Aria-label for remove skill button from experience",
                  },
                  { name: name[locale] },
                )}
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
                wordLimit={wordCountLimits[locale]}
                aria-label={intl.formatMessage(
                  {
                    id: "Opn8nz",
                    defaultMessage:
                      "Describe how {skillName} featured in this role",
                    description:
                      "More descriptive label for the textarea in the skills in detail section",
                  },
                  { skillName: getLocalizedName(name, intl, true) },
                )}
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
          </CardBasic>
        ))}
    </div>
  );
};

export default SkillsInDetail;
