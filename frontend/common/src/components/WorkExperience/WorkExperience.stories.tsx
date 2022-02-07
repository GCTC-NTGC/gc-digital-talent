import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import { Checkbox } from "../form/Checkbox";
import { Input } from "../form/Input";
import WorkExperience from "./WorkExperience";

export default {
  component: WorkExperience,
  title: "WorkExperience",
} as Meta;

const TemplateWorkExperience = (args) => {
  return (
    <div>
      <Input
        id="pending"
        label="My Role"
        name="role"
        type="text"
        rules={args.required}
      />

      <Input
        id="pending"
        label="Organization"
        name="organization"
        type="text"
        rules={args.required}
      />

      <Input
        id="pending"
        label="Team, Group or Division"
        name="team"
        type="text"
        hideOptional
      />

      <Checkbox id="pending" label="Current Role" name="current-role" />

      <Input
        id="pending"
        label="Start Date"
        name="start-date"
        type="date"
        rules={args.required}
      />

      <Input
        id="pending"
        label="End Date"
        name="end-date"
        type="date"
        rules={args.required}
      />
    </div>
  );
};

export const IndividualWorkExperience = TemplateWorkExperience.bind({});

IndividualWorkExperience.args = {
  required: true,
};
