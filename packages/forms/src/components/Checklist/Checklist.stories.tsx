import { StoryFn } from "@storybook/react-vite";
import { action } from "@storybook/addon-actions";
import { faker } from "@faker-js/faker/locale/en";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import Form from "../BasicForm";
import Submit from "../Submit";
import Checklist from "./Checklist";

export default {
  component: Checklist,
};

faker.seed(0);

const Template: StoryFn<typeof Checklist> = (args) => (
  <Form onSubmit={action("Submit Form")}>
    <Checklist {...args} />
    <Submit className="mt-6" />
  </Form>
);

export const Default = Template.bind({});
Default.args = {
  idPrefix: "checklist",
  legend: "Which items do you want to check?",
  name: "checklist",
  items: [
    { value: "one", label: "Box One" },
    { value: "two", label: "Box Two" },
    { value: "three", label: "Box Three" },
  ],
  rules: { required: "All items must be checked!" },
};

Default.parameters = {
  chromatic: {
    modes: {
      light: allModes.light,
      dark: allModes.dark,
    },
  },
};

export const DisabledChecklist = Template.bind({});
DisabledChecklist.args = {
  ...Default.args,
  disabled: true,
};

export const ContentBelow = Template.bind({});
ContentBelow.args = {
  ...Default.args,
  items: Default.args.items?.map((item) => ({
    ...item,
    contentBelow: faker.lorem.lines(6),
  })),
};
