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

  return (
    <div key={family.key}>
      <label data-h2-font-size="base(copy)">
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
    <div data-h2-flex-grid="base(flex-start, 0, x.25)">
      <div data-h2-flex-item="base(1of1)">
        <h4
          data-h2-font-size="base(copy, 1)"
          data-h2-font-weight="base(700)"
          data-h2-margin="base(0, 0, x.5, 0)"
        >
          Filter by
        </h4>
      </div>
      {skillFamilies.map((family) => (
        <div data-h2-flex-item="base(1of1)" key={family.key}>
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
