import { useIntl } from "react-intl";
import { useForm } from "react-hook-form";
import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";

import { Button, Card } from "@gc-digital-talent/ui";
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
    <div className="flex flex-col gap-y-3">
      {skills.length > 0 &&
        skills.map(({ id, name, skillId }, index) => (
          <Card key={id}>
            <div className="flex justify-between">
              <p className="font-bold">
                {intl.formatMessage(
                  {
                    defaultMessage: "{ordinal}. {label}",
                    id: "fPGs32",
                    description: "Formatted ordinal and label",
                  },
                  {
                    ordinal: index + 1,
                    label: name[locale],
                  },
                )}
              </p>
              <Button
                color="error"
                mode="inline"
                icon={XCircleIcon}
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
                {intl.formatMessage({
                  defaultMessage: "Remove skill",
                  id: "M051tF",
                  description:
                    "Message in skills in details section to remove skill from the experience.",
                })}
              </Button>
            </div>
            <div className="my-3">
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
          </Card>
        ))}
    </div>
  );
};

export default SkillsInDetail;
