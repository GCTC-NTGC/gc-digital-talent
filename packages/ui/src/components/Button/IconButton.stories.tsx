import InformationCircleIcon from "@heroicons/react/20/solid/InformationCircleIcon";
import { StoryObj, Meta } from "@storybook/react";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import IconButton from "./IconButton";

const meta = {
  component: IconButton,
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;

export const Default: StoryObj<typeof IconButton> = {
  render: () => (
    <div className="flex flex-col gap-y-3">
      <p className="tex-lg">Size</p>
      <div className="flex flex-wrap items-center gap-3">
        <IconButton
          label="primary sm"
          color="primary"
          size="sm"
          icon={InformationCircleIcon}
        />
        <IconButton
          label="primary"
          color="primary"
          icon={InformationCircleIcon}
        />
        <IconButton
          label="primary lg"
          color="primary"
          size="lg"
          icon={InformationCircleIcon}
        />
      </div>

      <p className="tex-lg">Colour</p>
      <div className="flex flex-wrap items-center gap-3">
        <IconButton
          label="primary"
          color="primary"
          icon={InformationCircleIcon}
        />
        <IconButton
          label="secondary"
          color="secondary"
          icon={InformationCircleIcon}
        />
        <IconButton
          label="success"
          color="success"
          icon={InformationCircleIcon}
        />
        <IconButton
          label="warning"
          color="warning"
          icon={InformationCircleIcon}
        />
        <IconButton label="error" color="error" icon={InformationCircleIcon} />
        <IconButton label="black" color="black" icon={InformationCircleIcon} />
      </div>
      <p className="tex-lg">Disabled</p>
      <div className="flex flex-wrap items-center gap-3">
        <IconButton
          label="primary"
          color="primary"
          disabled
          icon={InformationCircleIcon}
        />
      </div>
    </div>
  ),
};
