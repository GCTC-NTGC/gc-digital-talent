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
      <div data-h2="light" data-h2-background="base(background)">
        <Form onSubmit={action("Submit Form")}>
          <CardOptionGroup
            {...args}
            name="light"
            idPrefix="light"
            rules={{ required: "This field is required" }}
          />
          <p data-h2-margin-top="base(x1)">
            <Submit />
          </p>
        </Form>
      </div>
      <div data-h2="dark" data-h2-background="base(background)">
        <Form onSubmit={action("Submit Form")}>
          <CardOptionGroup
            {...args}
            name="dark"
            idPrefix="dark"
            rules={{ required: "This field is also required" }}
          />
          <p data-h2-margin-top="base(x1)">
            <Submit />
          </p>
        </Form>
      </div>
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
