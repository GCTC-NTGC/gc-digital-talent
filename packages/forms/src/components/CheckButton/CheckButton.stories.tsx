import { useState } from "react";
import { StoryFn, Meta } from "@storybook/react";
import { action } from "storybook/actions";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import CheckButton from "./CheckButton";

export default {
  component: CheckButton,
  args: {
    label: "Check button label",
  },
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
  },
} as Meta;

const Template: StoryFn<{ label: string }> = (args) => {
  const [isChecked, setChecked] = useState<boolean>(false);
  const { label } = args;

  const handleCheck = () => {
    const newState = !isChecked;
    setChecked(newState);
    action(`Changed state: ${newState}`);
  };

  return (
    <>
      <div>
        <span>Not Checked</span>
        <CheckButton
          checked={false}
          onToggle={() => action("clicked not checked")}
          label="Not Checked"
        />
      </div>
      <div>
        <span>Checked</span>
        <CheckButton
          checked
          onToggle={() => action("clicked checked")}
          label="Checked"
        />
      </div>
      <div>
        <span>Indeterminate</span>
        <CheckButton
          checked={false}
          indeterminate
          onToggle={() => action("clicked indeterminate")}
          label="Indeterminate"
        />
      </div>
      <div>
        <span>Controlled</span>
        <CheckButton checked={isChecked} onToggle={handleCheck} label={label} />
      </div>
    </>
  );
};

export const Default = Template.bind({});
