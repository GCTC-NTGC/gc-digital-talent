import React from "react";
import { useIntl } from "react-intl";

import { getLocale } from "@common/helpers/localize";

import type { SkillFamily } from "../../../api/generated";

interface FamilyProps {
  family: SkillFamily;
  checked: boolean;
  callback: (family: SkillFamily) => void;
}

const Family: React.FC<FamilyProps> = ({ family, checked, callback }) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const uncheckedStyle = { "data-h2-font-weight": "b(400)" };
  const checkedStyle = { "data-h2-font-weight": "b(700)" };

  return (
    <div
      {...(checked ? checkedStyle : uncheckedStyle)}
      data-h2-padding="b(all, xxs)"
      data-h2-font-size="b(caption)"
      key={family.key}
    >
      <label>
        <input
          type="radio"
          checked={checked}
          onChange={() => {
            callback(family);
          }}
        />
        &nbsp;
        {family.name?.[locale]} ({family.skills ? family.skills.length : 0})
      </label>
    </div>
  );
};

interface SkillFamiliesRadioListProps {
  skillFamilies: SkillFamily[];
  callback: (selected: SkillFamily | null) => void;
}

const SkillFamiliesRadioList: React.FC<SkillFamiliesRadioListProps> = ({
  skillFamilies,
  callback,
}) => {
  const [selected, setSelected] = React.useState<SkillFamily | null>(null);

  const handleSelection = (newSelection: SkillFamily | null) => {
    setSelected(newSelection);
    callback(newSelection);
  };

  return (
    <div data-h2-flex-grid="b(normal, expanded, flush, xs)">
      {skillFamilies.map((family) => (
        <div data-h2-flex-item="s(1of2)" key={family.key}>
          <Family
            family={family}
            checked={!!(selected && selected.id === family.id)}
            callback={handleSelection}
          />
        </div>
      ))}
    </div>
  );
};

export default SkillFamiliesRadioList;
