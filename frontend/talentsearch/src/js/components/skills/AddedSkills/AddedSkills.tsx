import React from "react";
import { useIntl } from "react-intl";
import Chip, { Chips } from "@common/components/Chip";
import { Scalars, Skill } from "@common/api/generated";
import { getLocale } from "@common/helpers/localize";
import { notEmpty } from "@common/helpers/util";

export interface AddedSkillsProps {
  skills: Skill[];
  onRemoveSkill: (id: Scalars["ID"]) => void;
  showHighAlert?: boolean;
}

const strong = (child: HTMLElement) => <strong>{child}</strong>;

const AddedSkills: React.FunctionComponent<AddedSkillsProps> = ({
  skills,
  onRemoveSkill,
  showHighAlert = true,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const filteredSkills = skills.filter((s) => typeof s !== "undefined");

  return (
    <>
      <h3 data-h2-font-size="b(h5)">
        {intl.formatMessage({
          defaultMessage: "Selected skills",
          description: "Section header for a list of skills selected",
        })}
      </h3>
      {notEmpty(filteredSkills) ? (
        <Chips>
          {filteredSkills.map((skill) => {
            const handleDismiss = () => onRemoveSkill(skill.id);
            return (
              <Chip
                key={skill?.id}
                label={skill?.name?.[locale] ?? "Missing Name"}
                color="primary"
                mode="outline"
                onDismiss={handleDismiss}
              />
            );
          })}
        </Chips>
      ) : null}
      {filteredSkills.length === 0 && (
        <p data-h2-font-style="b(italic)">
          {intl.formatMessage({
            defaultMessage:
              "There are no skills selected yet. You can add some using the provided links.",
            description:
              "Invitation to add skills when there aren't any added yet.",
          })}
        </p>
      )}

      {showHighAlert && filteredSkills.length >= 6 && (
        <div
          data-h2-border="b(gold, all, solid, s)"
          data-h2-bg-color="b(gold[.1])"
          data-h2-padding="b(all, s)"
          data-h2-radius="b(s)"
          data-h2-font-color="b([dark]darkgold)"
          role="alert"
        >
          <div data-h2-font-style="b(italic)">
            <p>
              <strong>
                {intl.formatMessage({
                  defaultMessage: "That's a lot of skills!",
                  description:
                    "Title of alert when there are many skills added.",
                })}
              </strong>
            </p>
            <p>
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
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AddedSkills;
