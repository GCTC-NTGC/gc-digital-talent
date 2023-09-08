import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { getStaticSkills } from "@gc-digital-talent/fake-data";
import { BasicForm, Submit } from "@gc-digital-talent/forms";
import {
  PersonnelLanguage,
  PersonnelScreeningLevel,
  PersonnelTeleworkOption,
  SkillLevel,
} from "@gc-digital-talent/graphql";

import PersonnelRequirementFieldset, {
  PersonnelRequirementFieldsetProps,
} from "./PersonnelRequirementFieldset";
import { PersonnelRequirementFormValues } from "../formValues";

const mockSkills = getStaticSkills();

const meta: Meta<typeof PersonnelRequirementFieldset> = {
  component: PersonnelRequirementFieldset,
  args: {
    skills: mockSkills,
    fieldsetName: "fakeField",
  },
};
export default meta;

type Story = StoryObj<typeof PersonnelRequirementFieldset>;

interface FormShape {
  fakeField: Partial<PersonnelRequirementFormValues>;
}

const ComponentWithBasicForm = ({
  args,
  initialValues,
}: {
  args: PersonnelRequirementFieldsetProps;
  initialValues?: FormShape["fakeField"];
}) => {
  const handleSave = async (values: FormShape) => {
    await new Promise<void>((resolve) => {
      action("onSave")(values);
      resolve();
    });
  };

  return (
    <BasicForm
      onSubmit={handleSave}
      options={{
        defaultValues: {
          fakeField: {
            ...initialValues,
          },
        },
      }}
    >
      <PersonnelRequirementFieldset {...args} />
      <Submit data-h2-margin-top="base(x2)" />
    </BasicForm>
  );
};

export const Empty: Story = {
  render: (args) => <ComponentWithBasicForm args={args} />,
};

export const WithValues: Story = {
  render: (args) => (
    <ComponentWithBasicForm
      args={args}
      initialValues={{
        resourceType: "Programmer",
        skillRequirements: [
          {
            skillId: mockSkills[0].id,
            level: SkillLevel.Beginner,
          },
          {
            skillId: mockSkills[1].id,
            level: SkillLevel.Advanced,
          },
        ],
        language: PersonnelLanguage.BilingualAdvanced,
        security: PersonnelScreeningLevel.Other,
        securityOther: "Need-to-know Basis",
        telework: PersonnelTeleworkOption.PartTime,
        quantity: "100",
      }}
    />
  ),
};
