import React from "react";
import type { ComponentStory, ComponentMeta } from "@storybook/react";

import SwitchDocs from "./Switch.docs.mdx";
import Switch from ".";

export default {
  component: Switch.Root,
  name: "Components/Switch",
  subComponents: [Switch.Root, Switch.Thumb],
  parameters: {
    docs: {
      page: SwitchDocs,
    },
  },
} as ComponentMeta<typeof Switch.Root>;

const Template: ComponentStory<typeof Switch.Root> = () => (
  <div
    data-h2-display="base(flex)"
    data-h2-flex-direction="base(column)"
    data-h2-gap="base(x.5, 0)"
  >
    <div
      data-h2-align-items="base(center)"
      data-h2-display="base(flex)"
      data-h2-gap="base(0, x.25)"
    >
      <label htmlFor="checked">Default Checked</label>
      <Switch.Root defaultChecked id="checked">
        <Switch.Thumb />
      </Switch.Root>
    </div>
    <div
      data-h2-align-items="base(center)"
      data-h2-display="base(flex)"
      data-h2-gap="base(0, x.25)"
    >
      <label htmlFor="checked">Default Not Checked</label>
      <Switch.Root id="unchecked">
        <Switch.Thumb />
      </Switch.Root>
    </div>
  </div>
);

export const Default = Template.bind({});
