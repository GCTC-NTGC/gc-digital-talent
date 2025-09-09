import { Meta, StoryObj } from "@storybook/react-vite";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import Image from "./Image";

const meta = {
  component: Image,
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        "light mobile": allModes["light mobile"],
      },
    },
  },
} satisfies Meta<typeof Image>;

export default meta;

export const Default: StoryObj<typeof Image> = {
  render: () => (
    <Image
      src="https://placehold.co/1920x1080?text=default"
      sources={{
        xs: "https://placehold.co/768x768?text=xs",
        sm: "https://placehold.co/1080x1080?text=sm",
        md: "https://placehold.co/1280x800?text=md",
        lg: "https://placehold.co/1600x1000?text=lg",
      }}
    />
  ),
};
