import React from "react";
import { useIntl } from "react-intl";

import { getLocalizedName } from "@gc-digital-talent/i18n";

import { Maybe, Skill } from "~/api/generated";

interface SkillListItem {
  name: Skill["name"];
  record: Skill["experienceSkillRecord"];
}

const SkillListItem = ({ name, record }: SkillListItem) => {
  const intl = useIntl();
  const localizedName = getLocalizedName(name, intl);

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
      {record && record.details && <p>{record.details}</p>}
    </li>
  );
};

interface SkillListProps {
  skills: Maybe<Skill[]>;
}

const SkillList = ({ skills }: SkillListProps) => {
  const intl = useIntl();

  return skills?.length ? (
    <ul data-h2-padding="base(0, 0, 0, x1)">
      {skills.map((skill) => (
        <SkillListItem
          key={skill.id}
          name={skill.name}
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
