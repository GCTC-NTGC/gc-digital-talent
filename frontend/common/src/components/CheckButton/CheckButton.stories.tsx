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
    <div
      data-h2-display="b(flex)"
      data-h2-justify-content="b(space-around)"
      style={{ margin: "-1rem" }}
    >
      <div
        data-h2-display="b(flex)"
        data-h2-flex-direction="b(column)"
        data-h2-align-items="b(center)"
        style={{ padding: "1rem" }}
      >
        <span>Not Checked</span>
        <CheckButton
          checked={false}
          onToggle={() => action("clicked not checked")}
          label="Not Checked"
        />
      </div>
      <div
        data-h2-display="b(flex)"
        data-h2-flex-direction="b(column)"
        data-h2-align-items="b(center)"
        style={{ padding: "1rem" }}
      >
        <span>Checked</span>
        <CheckButton
          checked
          onToggle={() => action("clicked checked")}
          label="Checked"
        />
      </div>
      <div
        data-h2-display="b(flex)"
        data-h2-flex-direction="b(column)"
        data-h2-align-items="b(center)"
        style={{ padding: "1rem" }}
      >
        <span>Indeterminate</span>
        <CheckButton
          checked={false}
          indeterminate
          onToggle={() => action("clicked indeterminate")}
          label="Indeterminate"
        />
      </div>
      <div
        data-h2-display="b(flex)"
        data-h2-flex-direction="b(column)"
        data-h2-align-items="b(center)"
        style={{ padding: "1rem" }}
      >
        <span>Controlled</span>
        <CheckButton checked={isChecked} onToggle={handleCheck} label={label} />
      </div>
    </div>
  );
};

export const BasicCheckButton = Template.bind({});
