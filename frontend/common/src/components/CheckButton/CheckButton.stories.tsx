import React from "react";
import { Story, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import CheckButton from "./CheckButton";

export default {
  component: CheckButton,
  title: "Components/Check Button",
  args: {
    label: "Check button label",
  },
} as Meta;

const Template: Story<{ label: string }> = (args) => {
  const [isChecked, setChecked] = React.useState<boolean>(false);
  const { label } = args;

  const handleCheck = () => {
    const newState = !isChecked;
    setChecked(newState);
    action(`Changed state: ${newState}`);
  };

  return (
    <CheckButton checked={isChecked} onToggle={handleCheck} label={label} />
  );
};

export const BasicCheckButton = Template.bind({});
