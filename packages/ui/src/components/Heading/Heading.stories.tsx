import type { Meta, StoryObj } from "@storybook/react-vite";
import AcademicCapIcon from "@heroicons/react/24/outline/AcademicCapIcon";
import BriefcaseIcon from "@heroicons/react/24/outline/BriefcaseIcon";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import { Container } from "../Container/Container";
import SectionHeading from "./SectionHeading";
import SubHeading from "./SubHeading";

const meta = {
  title: "Components/Heading",
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        "light desktop": allModes["light desktop"],
        dark: allModes.dark,
        "dark desktop": allModes["dark desktop"],
      },
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/guHeIIh8dqFVCks310Wv0G/Component-library?node-id=4327-64516",
    },
  },
} satisfies Meta;

export default meta;

const icons = {
  AcademicCap: AcademicCapIcon,
  Briefcase: BriefcaseIcon,
  UserGroup: UserGroupIcon,
};

const colorArgType = {
  control: { type: "select" as const },
  options: [undefined, "primary", "secondary", "success", "warning", "error"],
};

const centerArgType = {
  control: { type: "select" as const },
  options: [undefined, true, "xs"],
  labels: { undefined: "none", true: "always", xs: "xs" },
};

export const SectionHeadings: StoryObj<typeof SectionHeading> = {
  argTypes: {
    icon: {
      options: Object.keys(icons),
      mapping: icons,
      control: { type: "select" },
    },
    color: colorArgType,
    center: centerArgType,
  },
  args: { icon: AcademicCapIcon },
  render: (args) => (
    <Container>
      <SectionHeading {...args}>Default</SectionHeading>
      <SectionHeading {...args} color="primary">
        Primary
      </SectionHeading>
      <SectionHeading {...args} color="secondary">
        Secondary
      </SectionHeading>
      <SectionHeading {...args} color="success">
        Success
      </SectionHeading>
      <SectionHeading {...args} color="warning">
        Warning
      </SectionHeading>
      <SectionHeading {...args} color="error">
        Error
      </SectionHeading>
    </Container>
  ),
};

export const SubHeadings: StoryObj<typeof SubHeading> = {
  argTypes: {
    icon: {
      options: ["None", ...Object.keys(icons)],
      mapping: { None: undefined, ...icons },
      control: { type: "select" },
    },
    color: colorArgType,
    center: centerArgType,
  },
  args: { icon: AcademicCapIcon },
  render: (args) => (
    <Container>
      <SubHeading {...args} size="lg" level="h3" color="primary">
        Default
      </SubHeading>
      <SubHeading {...args} size="md" level="h4" color="secondary">
        Medium
      </SubHeading>
      <SubHeading {...args} size="sm" level="h5" color="success">
        Small
      </SubHeading>
      <SubHeading {...args} size="xs" level="h6" color="warning">
        Extra small
      </SubHeading>
      <SubHeading {...args} size="xs" level="h6" color="error">
        Extra small
      </SubHeading>
    </Container>
  ),
};
