import React from "react";
import { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import SolidTrashIcon from "@heroicons/react/24/solid/TrashIcon";
import OutlineTrashIcon from "@heroicons/react/24/outline/TrashIcon";

import Form from "../BasicForm";
import Submit from "../Submit";
import CardOptionGroup from "./CardOptionGroup";

export default {
  component: CardOptionGroup,
  title: "Form/CardOptionGroup",
};

const TemplateCardOptionGroup: StoryFn<typeof CardOptionGroup> = (args) => {
  return (
    <Form onSubmit={action("Submit Form")}>
      <CardOptionGroup {...args} />
      <p data-h2-margin-top="base(x1)">
        <Submit />
      </p>
    </Form>
  );
};

export const BasicCardOptionGroup = TemplateCardOptionGroup.bind({});
BasicCardOptionGroup.args = {
  idPrefix: "CardOptiongroup",
  legend: "Which item do you want to check?",
  name: "CardOptiongroup",
  items: [
    {
      value: "one",
      label: "Box One",
      unselectedIcon: OutlineTrashIcon,
      selectedIcon: SolidTrashIcon,
      selectedIconColor: "warning",
    },
    {
      value: "two",
      label: "Box Two",
      unselectedIcon: OutlineTrashIcon,
      selectedIcon: SolidTrashIcon,
      selectedIconColor: "error",
    },
    // { value: "three", label: "Box Three" },
  ],
};
