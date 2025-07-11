import { faker } from "@faker-js/faker/locale/en";
import { action } from "@storybook/addon-actions";
import { StoryFn } from "@storybook/react";
import { ComponentProps } from "react";

import { getStaticSkills } from "@gc-digital-talent/fake-data";
import { BasicForm } from "@gc-digital-talent/forms";
import {
  makeFragmentData,
  SkillCategory,
  SkillLevel,
} from "@gc-digital-talent/graphql";

import SkillProficiencyList, { Options_Fragment } from "./SkillProficiencyList";

const allSkills = getStaticSkills();
const optionsQuery = makeFragmentData({ skills: allSkills }, Options_Fragment);

const items = allSkills.slice(0, 5).map((skill) => ({
  skillId: skill.id,
  skillName: skill.name.en ?? null,
  skillLevel: faker.helpers.arrayElement<SkillLevel>(Object.values(SkillLevel)),
  skillDefinition: skill.description?.en ?? null,
  skillCategory: skill.category.value,
})) satisfies ComponentProps<typeof SkillProficiencyList>["listItems"]; // trust the fake data for Storybook :-)

export default {
  component: SkillProficiencyList,
  args: {
    optionsQuery: optionsQuery,
    onCreate: action("onCreate"),
    onUpdate: action("onUpdate"),
    onRemove: action("onRemove"),
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/sXw00jqMvgLePDwkDhO0v2/Admin---CRUD-job-templates?node-id=9-8856",
    },
  },
};

const Template: StoryFn<typeof SkillProficiencyList> = (args) => {
  return (
    <BasicForm onSubmit={action("submit")}>
      <SkillProficiencyList {...args} />
    </BasicForm>
  );
};

export const Empty = Template.bind({});
Empty.args = {
  listItems: [],
};

export const WithItems = Template.bind({});
WithItems.args = {
  listItems: items,
  filterOptionsSkillCategory: SkillCategory.Technical,
};
