import React from "react";
import { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import SolidHandThumbUpIcon from "@heroicons/react/24/solid/HandThumbUpIcon";
import OutlineHandThumbUpIcon from "@heroicons/react/24/outline/HandThumbUpIcon";

import Form from "../BasicForm";
import Submit from "../Submit";
import CardOptionGroup, { CardOption } from "./CardOptionGroup";

export default {
  component: CardOptionGroup,
  title: "Form/CardOptionGroup",
};

const themes = ["light", "dark"];

const colors: Array<CardOption["selectedIconColor"]> = [
  "primary",
  "secondary",
  "tertiary",
  "quaternary",
  "quinary",
  "success",
  "warning",
  "error",
  "black",
];

const TemplateCardOptionGroup: StoryFn<typeof CardOptionGroup> = (args) => {
  return (
    <div
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="base(1fr 1fr)"
    >
      {themes.map((theme) => (
        <div
          data-h2={theme}
          data-h2-background="base(background)"
          data-h2-padding="base(x2)"
          key={theme}
        >
          <Form onSubmit={action("Submit Form")}>
            <CardOptionGroup
              {...args}
              name={theme}
              idPrefix={theme}
              rules={{ required: "This field is required" }}
            />
            <p className="mt-6">
              <Submit />
            </p>
          </Form>
        </div>
      ))}
    </div>
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
