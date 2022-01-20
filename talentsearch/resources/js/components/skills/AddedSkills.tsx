import React from "react";
import { useIntl } from "react-intl";
import { Chip } from "@common/components/Chip";
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
            key={skill.id}
            label={skill.name?.[locale] ?? "Missing Name"}
            color="neutral"
            mode="outline"
            onDismiss={handleDismiss}
          />
        );
      })}
      {skills.length === 0 && (
        <div>
          {intl.formatMessage({
            defaultMessage: "Use the lists below to start adding skills.",
            description:
              "Invitation to add skills when there aren't any added yet.",
          })}
        </div>
      )}

      {skills.length >= 6 && (
        <>
          <div>
            <strong>
              {intl.formatMessage({
                defaultMessage: "That's a lot of skills!",
                description: "Title of alert when there are many skills added.",
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
        </>
      )}
    </>
  );
};

export default AddedSkills;

/*
      skills.map(
  (skill) => {
    const handler = () => {doSomethingWithId(skill)}; // id is now part of the function closure
    return <Chip label={skill} color="neutral" mode="outline" onDismiss={handler    } />;
  });
);
*/
