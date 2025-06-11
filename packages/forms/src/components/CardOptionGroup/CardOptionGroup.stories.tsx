import { StoryFn } from "@storybook/react-vite";
import { action } from "@storybook/addon-actions";
import SolidHandThumbUpIcon from "@heroicons/react/24/solid/HandThumbUpIcon";
import OutlineHandThumbUpIcon from "@heroicons/react/24/outline/HandThumbUpIcon";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import Form from "../BasicForm";
import Submit from "../Submit";
import CardOptionGroup, { CardOption } from "./CardOptionGroup";

export default {
  component: CardOptionGroup,
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
  },
};

const colors: CardOption["selectedIconColor"][] = [
  "primary",
  "secondary",
  "success",
  "warning",
  "error",
];

const TemplateCardOptionGroup: StoryFn<typeof CardOptionGroup> = (args) => {
  return (
    <Form onSubmit={action("Submit Form")}>
      <CardOptionGroup
        {...args}
        rules={{ required: "This field is required" }}
      />
      <p data-h2-margin-top="base(x1)">
        <Submit />
      </p>
    </Form>
  );
};

export const Default = TemplateCardOptionGroup.bind({});
Default.args = {
  idPrefix: "CardOptionGroup",
  legend: "Which item do you want to check?",
  name: "CardOptionGroup",
  items: colors.map<CardOption>((color) => ({
    value: color,
    label: color,
    unselectedIcon: OutlineHandThumbUpIcon,
    selectedIcon: SolidHandThumbUpIcon,
    selectedIconColor: color,
  })),
};
