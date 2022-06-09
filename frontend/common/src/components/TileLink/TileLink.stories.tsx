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
    color: {
      name: "Colour",
      options: [
        "primary",
        "secondary",
        "cta",
        "white",
        "black",
        "ia-primary",
        "ia-secondary",
      ],
    },
  },
} as Meta;

const TemplateTileLink: Story = (args) => {
  const { label, color } = args;

  return (
    <div style={{ width: 250 }}>
      <TileLink color={color} href="#">
        {label}
      </TileLink>
    </div>
  );
};

export const BasicTileLink = TemplateTileLink.bind({});
