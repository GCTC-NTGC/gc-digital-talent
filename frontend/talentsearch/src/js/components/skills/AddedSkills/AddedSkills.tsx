import React from "react";
import { useIntl } from "react-intl";
import Chip from "@common/components/Chip";
import { Scalars, Skill } from "@common/api/generated";
import { getLocale } from "@common/helpers/localize";

export interface AddedSkillsProps {
  skills: Skill[];
  onRemoveSkill: (id: Scalars["ID"]) => void;
}

const strong = (child: HTMLElement) => <strong>{child}</strong>;

const AddedSkills: React.FunctionComponent<AddedSkillsProps> = ({
  skills,
  onRemoveSkill,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  return (
    <>
      <h5>
        {intl.formatMessage({
          defaultMessage: "Skills attached to this experience",
          description:
            "Section header for a list of skills attached to this experience",
        })}
      </h5>
      {skills.map((skill) => {
        const handleDismiss = () => onRemoveSkill(skill.id);
        return (
          <Chip
            key={skill?.id}
            label={skill?.name?.[locale] ?? "Missing Name"}
            color="neutral"
            mode="outline"
            onDismiss={handleDismiss}
          />
        );
      })}
      {skills.length === 0 && (
        <i>
          {intl.formatMessage({
            defaultMessage:
              "There are no skills attached to this experience yet. You can add some using the links below.",
            description:
              "Invitation to add skills when there aren't any added yet.",
          })}
        </i>
      )}

      {skills.length >= 6 && (
        <div
          data-h2-border="b(gold, all, solid, s)"
          data-h2-bg-color="b(gold[.1])"
          data-h2-padding="b(all, s)"
          data-h2-radius="b(s)"
          data-h2-font-color="b([dark]darkgold)"
          role="alert"
        >
          <i>
            <div>
              <strong>
                {intl.formatMessage({
                  defaultMessage: "That's a lot of skills!",
                  description:
                    "Title of alert when there are many skills added.",
                })}
              </strong>
            </div>
            <div>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "On the next step you will explain how you used each skill. Try to focus on a few of your top skills, we recommend <strong>less than six (6)</strong> skills per experience.",
                  description:
                    "Message of alert when there are many skills added recommending that fewer skills be selected.",
                },
                {
                  strong,
                },
              )}
            </div>
          </i>
        </div>
      )}
    </>
  );
};

export default AddedSkills;
