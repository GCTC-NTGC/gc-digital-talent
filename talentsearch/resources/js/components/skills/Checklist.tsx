import React, { ChangeEvent } from "react";
import groupBy from "lodash/groupBy";
import { useIntl } from "react-intl";
import { getLocale } from "@common/helpers/localize";
import { SkillFamily } from "@common/api/generated";
import {
  getSkillCategoryText,
  getSkillCategoryImage,
} from "@common/constants/localizedConstants";

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
        name={index}
        id={family.key}
        onChange={(e) => {
          callback(e);
        }}
      />
      <label htmlFor={family.key}>
        &nbsp;{family.name?.[locale]} (
        {family.skills ? family.skills.length : 0})
      </label>
    </div>
  );
};

interface CategoryProps {
  category: string;
  skillFamilies: SkillFamily[];
  callback: (selected: SkillFamily, added: boolean) => void;
}

const Category: React.FunctionComponent<CategoryProps> = ({
  category,
  skillFamilies,
  callback,
}) => {
  const intl = useIntl();

  // The app currently crashes if no description is specified for the category.
  // Do we want to avoid this?
  let title = intl.formatMessage(getSkillCategoryText(category));

  const image = getSkillCategoryImage(category);

  // Calculate the total number of skills in the SkillCategory
  let total = 0;
  skillFamilies.forEach((family) => {
    total += family.skills ? family.skills.length : 0;
  });
  title += ` (${total})`;

  const [checkedArr, setCheckedArr] = React.useState<string[]>([]);

  const HandleChecked = (event: ChangeEvent<HTMLInputElement>) => {
    const pos = Number(event.target.name);
    if (event.target.checked) {
      setCheckedArr([...checkedArr, skillFamilies[pos].key]);
    } else {
      const temp: string[] = [];
      checkedArr.forEach((elem) => {
        if (elem !== skillFamilies[pos].key) {
          temp.push(elem);
        }
      });
      setCheckedArr(temp);
    }
    callback(skillFamilies[pos], event.target.checked);
  };

  return (
    <div data-h2-flex-item="s(1of2)">
      <p data-h2-font-weight="b(800)">
        &nbsp;
        {image}
        &nbsp;&nbsp;{title}
      </p>
      {skillFamilies.map((family, i) => {
        const index = i.toString();
        const checked = checkedArr.includes(family.key);
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
  callback: (selected: SkillFamily[]) => void;
}

const Checklist: React.FunctionComponent<ChecklistProps> = ({
  skillFamilies,
  callback,
}) => {
  // Divide the list of SkillFamilies by associated SkillCategory
  const skillCategories = groupBy(skillFamilies, "category");

  let selected: SkillFamily[] = [];

  const HandleSelection = (newSelection: SkillFamily, added: boolean) => {
    if (added) {
      selected.push(newSelection);
    } else {
      selected = selected.filter((elem) => elem !== newSelection);
    }

    callback(selected);
  };

  return (
    <div data-h2-flex-grid="b(normal, expanded, flush, m)">
      {Object.keys(skillCategories).map((category) => {
        return (
          <Category
            key={category}
            category={category}
            skillFamilies={skillCategories[category]}
            callback={HandleSelection}
          />
        );
      })}
    </div>
  );
};

export default Checklist;
