import AcademicCapIcon from "@heroicons/react/24/outline/AcademicCapIcon";
import { StoryObj, Meta } from "@storybook/react";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import CTAButton from "./CTAButton";

const meta = {
  component: CTAButton,
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
  },
} satisfies Meta<typeof CTAButton>;

export default meta;

export const Default: StoryObj<typeof CTAButton> = {
  render: () => (
    <div className="flex flex-col items-start gap-y-3">
      <CTAButton color="primary" icon={AcademicCapIcon}>
        Primary CTA
      </CTAButton>
      <CTAButton color="secondary" icon={AcademicCapIcon}>
        Secondary CTA
      </CTAButton>
      <CTAButton color="success" icon={AcademicCapIcon}>
        Success CTA
      </CTAButton>
      <CTAButton color="warning" icon={AcademicCapIcon}>
        Warning CTA
      </CTAButton>
      <CTAButton color="error" icon={AcademicCapIcon}>
        Error CTA
      </CTAButton>
      <CTAButton color="primary" icon={AcademicCapIcon} block>
        Block CTA
      </CTAButton>
    </div>
  ),
};
