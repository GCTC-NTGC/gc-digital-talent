import React from "react";
import { useIntl } from "react-intl";

import { getLocalizedName } from "../../../helpers/localize";
import { Maybe, Skill } from "../../../api/generated";

interface SkillListItem {
  name: Skill["name"];
  description: Skill["description"];
  record: Skill["experienceSkillRecord"];
}

const SkillListItem = ({ name, description, record }: SkillListItem) => {
  const intl = useIntl();
  const localizedName = getLocalizedName(name, intl);
  const localizedDesc = getLocalizedName(description, intl);

  return (
    <li>
      {localizedName && (
        <p
          data-h2-color="base(dt-primary)"
          data-h2-font-weight="base(700)"
          data-h2-margin="base(x1, 0, x.25, 0)"
        >
          {localizedName}
        </p>
      )}
      {localizedDesc && (
        <p data-h2-margin="base(0, 0, x.25, 0)">{localizedDesc}</p>
      )}
      {record && record.details && <p>{record.details}</p>}
    </li>
  );
};

interface SkillListProps {
  skills: Maybe<Skill[]>;
}

const SkillList = ({ skills }: SkillListProps) => {
  const intl = useIntl();

  return skills ? (
    <ul data-h2-padding="base(0, 0, 0, x1)">
      {skills.map((skill) => (
        <SkillListItem
          key={skill.id}
          name={skill.name}
          description={skill.description}
          record={skill.experienceSkillRecord}
        />
      ))}
    </ul>
  ) : (
    <p>
      {intl.formatMessage({
        defaultMessage: "No skills have been linked to this experience yet.",
        id: "c4r/Zv",
        description:
          "A message explaining that the experience has no associated skills",
      })}
    </p>
  );
};

export default SkillList;
