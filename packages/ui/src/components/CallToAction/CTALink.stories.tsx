import AcademicCapIcon from "@heroicons/react/24/outline/AcademicCapIcon";
import { StoryObj, Meta } from "@storybook/react";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import CTALink from "./CTALink";

const meta = {
  component: CTALink,
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
  },
} satisfies Meta<typeof CTALink>;

export default meta;

export const Default: StoryObj<typeof CTALink> = {
  render: () => (
    <div className="flex flex-col items-start gap-y-3">
      <CTALink href="#" color="primary" icon={AcademicCapIcon}>
        Primary CTA
      </CTALink>
      <CTALink href="#" color="secondary" icon={AcademicCapIcon}>
        Secondary CTA
      </CTALink>
      <CTALink href="#" color="success" icon={AcademicCapIcon}>
        Success CTA
      </CTALink>
      <CTALink href="#" color="warning" icon={AcademicCapIcon}>
        Warning CTA
      </CTALink>
      <CTALink href="#" color="error" icon={AcademicCapIcon}>
        Error CTA
      </CTALink>
      <CTALink href="#" color="primary" icon={AcademicCapIcon} newTab>
        New tab CTA
      </CTALink>
      <CTALink href="#" color="primary" icon={AcademicCapIcon} block>
        Block CTA
      </CTALink>
    </div>
  ),
};
