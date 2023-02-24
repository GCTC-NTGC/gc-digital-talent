import React from "react";
import { Story, Meta } from "@storybook/react";

import TileLink from "./TileLink";

export default {
  component: TileLink,
  title: "Components/Tile Link",
  args: {
    label: "Tile Link Label",
    color: "primary",
  },
  argTypes: {
    label: {
      name: "Label",
      type: { name: "string", required: true },
    },
  },
} as Meta;

const TemplateTileLink: Story = (args) => {
  const { label } = args;

  return (
    <div
      data-h2-display="base(grid)"
      data-h2-padding="base(x2)"
      data-h2-grid-template-columns="base(repeat(5, minmax(0, 1fr)))"
      data-h2-gap="base(x2)"
    >
      <TileLink color="primary" href="#">
        {label}
      </TileLink>
      <TileLink color="secondary" href="#">
        {label}
      </TileLink>
      <TileLink color="tertiary" href="#">
        {label}
      </TileLink>
      <TileLink color="quaternary" href="#">
        {label}
      </TileLink>
      <TileLink color="quinary" href="#">
        {label}
      </TileLink>
    </div>
  );
};

export const BasicTileLink = TemplateTileLink.bind({});
