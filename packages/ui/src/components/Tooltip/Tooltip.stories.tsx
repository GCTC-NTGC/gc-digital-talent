import InformationCircleIcon from "@heroicons/react/20/solid/InformationCircleIcon";
import type { StoryFn, Meta } from "@storybook/react-vite";

import {
  GLOBAL_A11Y_EXCLUDES,
  allModes,
} from "@gc-digital-talent/storybook-helpers";

import Button from "../Button";
import IconButton from "../Button/IconButton";
import Tooltip from "./Tooltip";

export default {
  component: Tooltip.Root,
  decorators: [
    (Story) => (
      <div className="flex justify-center p-16">
        <Story />
      </div>
    ),
  ],
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
    a11y: {
      context: {
        exclude: [...GLOBAL_A11Y_EXCLUDES],
      },
    },
  },
} as Meta;

const Template: StoryFn<typeof Tooltip.Root> = () => (
  <Tooltip.Provider>
    <Tooltip.Root>
      <Tooltip.Trigger aria-label="Administrative Services">
        CS-02
      </Tooltip.Trigger>
      <Tooltip.Popup>Administrative Services</Tooltip.Popup>
    </Tooltip.Root>
  </Tooltip.Provider>
);

export const Default = Template.bind({});

export const OpeningFromTop: StoryFn<typeof Tooltip.Root> = () => (
  <Tooltip.Provider>
    <Tooltip.Root defaultOpen>
      <Tooltip.Trigger aria-label="Administrative Services">
        CS-02
      </Tooltip.Trigger>
      <Tooltip.Popup positionerProps={{ side: "top" }}>
        Administrative Services
      </Tooltip.Popup>
    </Tooltip.Root>
  </Tooltip.Provider>
);

export const OpeningFromBottom: StoryFn<typeof Tooltip.Root> = () => (
  <Tooltip.Provider>
    <Tooltip.Root defaultOpen>
      <Tooltip.Trigger aria-label="Administrative Services">
        CS-02
      </Tooltip.Trigger>
      <Tooltip.Popup positionerProps={{ side: "bottom" }}>
        Administrative Services
      </Tooltip.Popup>
    </Tooltip.Root>
  </Tooltip.Provider>
);

export const OnIcon: StoryFn<typeof Tooltip.Root> = () => (
  <Tooltip.Provider>
    <Tooltip.Root defaultOpen>
      <Tooltip.Trigger
        render={
          <IconButton
            color="black"
            icon={InformationCircleIcon}
            label="More information"
          />
        }
      />
      <Tooltip.Popup>More information</Tooltip.Popup>
    </Tooltip.Root>
  </Tooltip.Provider>
);

export const OnButton: StoryFn<typeof Tooltip.Root> = () => (
  <Tooltip.Provider>
    <Tooltip.Root defaultOpen>
      <Tooltip.Trigger render={<Button color="primary">Submit</Button>} />
      <Tooltip.Popup>Submit the application</Tooltip.Popup>
    </Tooltip.Root>
  </Tooltip.Provider>
);

export const OnText: StoryFn<typeof Tooltip.Root> = () => (
  <Tooltip.Provider>
    <Tooltip.Root defaultOpen>
      <Tooltip.Trigger
        aria-label="Roob, Fisher and Associates"
        className="cursor-default border-0 bg-transparent p-0 underline decoration-dotted underline-offset-4"
      >
        CS-02: Roob
      </Tooltip.Trigger>
      <Tooltip.Popup>Roob, Fisher and Associates</Tooltip.Popup>
    </Tooltip.Root>
  </Tooltip.Provider>
);
