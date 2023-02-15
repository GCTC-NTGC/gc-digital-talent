import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import uniqueId from "lodash/uniqueId";
import React from "react";
import { useIntl } from "react-intl";
import { getLocalizedName } from "../../../helpers/localize";
import { fakeSkillFamilies, fakeSkills } from "../../../fakeData";
import BasicForm from "../BasicForm";
import Submit from "../Submit";
import SelectFieldV2, { Group, Option } from "./SelectFieldV2";

export default {
  component: SelectFieldV2,
  title: "Form/SelectFieldV2",
  decorators: [
    (Story) => {
      return (
        <BasicForm
          onSubmit={action("Submit Form")}
          options={{ defaultValues: { skill: null } }}
        >
          {/* See: https://github.com/storybookjs/storybook/issues/12596#issuecomment-723440097 */}
          {Story() /* Can't use <Story /> for inline decorator. */}
          <Submit />
        </BasicForm>
      );
    },
  ],
} as ComponentMeta<typeof SelectFieldV2>;

const Template: ComponentStory<typeof SelectFieldV2> = (args) => {
  const intl = useIntl();
  const skillFamilies = fakeSkillFamilies(10, fakeSkills(2));
  const fakeOptions: Option[] = skillFamilies.map(({ id, name }) => ({
    value: id,
    label: getLocalizedName(name, intl),
  }));

  return <SelectFieldV2 {...args} options={fakeOptions} />;
};

const TemplateGroup: ComponentStory<typeof SelectFieldV2> = (args) => {
  const intl = useIntl();
  const skillFamilies = fakeSkillFamilies(4, fakeSkills(5));

  const fakeOptions: Group<Option> = skillFamilies.map(
    ({ id, name, skills }) => ({
      id,
      label: getLocalizedName(name, intl),
      options: skills?.map((skill) => ({
        value: skill.id,
        label: getLocalizedName(skill.name, intl),
      })),
    }),
  );

  return <SelectFieldV2 {...args} options={fakeOptions} />;
};

export const Default = Template.bind({});
Default.args = {
  id: uniqueId(),
  label: "Skill",
  name: "skill",
};

export const OptionGroups = TemplateGroup.bind({});
OptionGroups.args = {
  ...Default.args,
};

export const TrackUnsavedFalse = Template.bind({});
TrackUnsavedFalse.args = {
  ...Default.args,
  trackUnsaved: false,
};

export const Required = Template.bind({});
Required.args = {
  ...Default.args,
  rules: { required: true },
};

export const RequiredWithCustomMessage = Template.bind({});
RequiredWithCustomMessage.args = {
  ...Default.args,
  rules: { required: "You must enter a skill to continue." },
};

export const RequiredWithContextInfo = Template.bind({});
RequiredWithContextInfo.args = {
  ...Default.args,
  rules: { required: true },
  context: "We collect skill data for account purposes.",
};
