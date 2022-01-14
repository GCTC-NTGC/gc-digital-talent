import React, { ChangeEvent } from "react";
import { QuestionMarkCircleIcon, XCircleIcon } from "@heroicons/react/solid";
import groupBy from "lodash/groupBy";
import { useIntl } from "react-intl";
import { getLocale } from "@common/helpers/localize";
import { SkillFamily } from "@common/api/generated";
import { getSkillCategory } from "@common/constants/localizedConstants";

interface FamilyProps {
  family: SkillFamily;
  index: string;
  checked: boolean;
  callback: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Family: React.FunctionComponent<FamilyProps> = ({
  family,
  index,
  checked,
  callback,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const uncheckedStyle = "data-h2-font-weight='b(400)'";
  const checkedStyle = "data-h2-font-weight='b(700)'";

  return (
    <div
      data-h2-font-weight={checked ? checkedStyle : uncheckedStyle}
      data-h2-padding="b(all, xxs)"
      key={family.key}
    >
      <input
        type="checkbox"
        id={family.key + index}
        onChange={(e) => {
          callback(e);
        }}
      />
      <label htmlFor={family.key + index}>
        &nbsp;{family.name?.[locale]} (
        {family.skills ? family.skills.length : 0})
      </label>
    </div>
  );
};

interface CategoryProps {
  category: string;
  skillFamilies: SkillFamily[];
  callback: (selected: SkillFamily[]) => void;
}

const Category: React.FunctionComponent<CategoryProps> = ({
  category,
  skillFamilies,
  callback,
}) => {
  const intl = useIntl();

  // The app currently crashes if no description is specified for the category.
  // Do we want to avoid this?
  let title = intl.formatMessage(getSkillCategory(category));

  // Calculate the total number of skills in the SkillCategory
  let total = 0;
  skillFamilies.forEach((family) => {
    total += family.skills ? family.skills.length : 0;
  });
  title += ` (${total})`;

  const [checkedArr, setCheckedArr] = React.useState<SkillFamily[]>([]);

  const HandleChecked = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setCheckedArr([...checkedArr, skillFamilies[Number(event.target.id)]]);
    } else {
      const temp: SkillFamily[] = [];
      checkedArr.forEach((elem) => {
        if (elem !== skillFamilies[Number(event.target.id)]) {
          temp.push(elem);
        }
      });
      setCheckedArr(temp);
    }

    callback(checkedArr);
  };

  return (
    <div data-h2-flex-item="s(1of2)">
      <p data-h2-font-weight="b(800)">
        &nbsp;
        <XCircleIcon style={{ width: "calc(1rem*1.25)" }} />
        &nbsp;&nbsp;{title}
      </p>
      {skillFamilies.map((family, i) => {
        const index = i.toString();
        const checked = checkedArr.includes(family);
        return (
          <Family
            key={family.key}
            family={family}
            index={index}
            checked={checked}
            callback={HandleChecked}
          />
        );
      })}
    </div>
  );
};

export interface ChecklistProps {
  skillFamilies: SkillFamily;
  handleCheckedCallback: (selected: SkillFamily[]) => void;
}

const Checklist: React.FunctionComponent<ChecklistProps> = ({
  skillFamilies,
  handleCheckedCallback,
}) => {
  // Divide the list of SkillFamilies by associated SkillCategory
  const skillCategories = groupBy(skillFamilies, "category");

  return (
    <div data-h2-flex-grid="b(normal, expanded, flush, m)">
      {Object.keys(skillCategories).map((category) => {
        return (
          <Category
            key={category}
            category={category}
            skillFamilies={skillCategories[category]}
            callback={handleCheckedCallback}
          />
        );
      })}
    </div>
  );
};

export default Checklist;
