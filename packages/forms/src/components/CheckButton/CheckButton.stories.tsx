import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import CheckButton from "./CheckButton";

export default {
  component: CheckButton,
  title: "Form/Check Button",
  args: {
    label: "Check button label",
  },
} as Meta;

const themes = ["light", "dark"];

const Template: StoryFn<{ label: string }> = (args) => {
  const [isChecked, setChecked] = React.useState<boolean>(false);
  const { label } = args;

  const handleCheck = () => {
    const newState = !isChecked;
    setChecked(newState);
    action(`Changed state: ${newState}`);
  };

  return (
    <div
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="base(100%)"
    >
      {themes.map((theme) => (
        <div data-h2={theme} key={theme}>
          <div data-h2-background="base(background)" data-h2-padding="base(x2)">
            <div
              data-h2-display="base(flex)"
              data-h2-justify-content="base(space-around)"
              data-h2-margin="base(-x1)"
              data-h2-color="base(black)"
            >
              <div
                data-h2-display="base(flex)"
                data-h2-flex-direction="base(column)"
                data-h2-align-items="base(center)"
                data-h2-padding="base(x1)"
              >
                <span>Not Checked</span>
                <CheckButton
                  checked={false}
                  onToggle={() => action("clicked not checked")}
                  label="Not Checked"
                />
              </div>
              <div
                data-h2-display="base(flex)"
                data-h2-flex-direction="base(column)"
                data-h2-align-items="base(center)"
                data-h2-padding="base(x1)"
              >
                <span>Checked</span>
                <CheckButton
                  checked
                  onToggle={() => action("clicked checked")}
                  label="Checked"
                />
              </div>
              <div
                data-h2-display="base(flex)"
                data-h2-flex-direction="base(column)"
                data-h2-align-items="base(center)"
                data-h2-padding="base(x1)"
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
                data-h2-display="base(flex)"
                data-h2-flex-direction="base(column)"
                data-h2-align-items="base(center)"
                data-h2-padding="base(x1)"
              >
                <span>Controlled</span>
                <CheckButton
                  checked={isChecked}
                  onToggle={handleCheck}
                  label={label}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const BasicCheckButton = Template.bind({});
