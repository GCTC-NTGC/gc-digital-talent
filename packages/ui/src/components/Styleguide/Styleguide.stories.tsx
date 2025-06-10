import type { Meta, StoryObj } from "@storybook/react";
import { ReactNode } from "react";

import Heading from "../Heading";

const meta: Meta = {};

export default meta;

interface GridProps {
  className: string;
  children: ReactNode;
}

const Grid = ({ children, className }: GridProps) => (
  <div className={`grid min-w-full gap-4 ${className}`}>{children}</div>
);

interface SwatchProps {
  className: string;
  level?: string;
}

const Swatch = ({ className, level }: SwatchProps) => (
  <div className={`relative h-0 gap-4 pb-[100%] ${className}`}>
    {level ? (
      <span className="absolute bottom-2 left-2 leading-none">{level}</span>
    ) : null}
  </div>
);

export const Default: StoryObj = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => (
    <div className="text-foreground mx-auto max-w-7xl p-4">
      <Heading level="h2" size="h4">
        Colours
      </Heading>

      <Heading level="h3" size="h6">
        Primary
      </Heading>
      <Grid className="md:max-width-md grid-cols-7">
        <Swatch className="bg-primary-100" />
        <Swatch className="bg-primary-200" />
        <Swatch className="bg-primary-300" />
        <Swatch className="bg-primary-400" />
        <Swatch className="bg-primary-500" />
        <Swatch className="bg-primary-600" />
        <Swatch className="bg-primary-700" />
      </Grid>

      <Heading level="h3" size="h6">
        Secondary
      </Heading>
      <Grid className="md:max-width-md grid-cols-7">
        <Swatch className="bg-secondary-100" />
        <Swatch className="bg-secondary-200" />
        <Swatch className="bg-secondary-300" />
        <Swatch className="bg-secondary-400" />
        <Swatch className="bg-secondary-500" />
        <Swatch className="bg-secondary-600" />
        <Swatch className="bg-secondary-700" />
      </Grid>

      <Heading level="h3" size="h6">
        Success
      </Heading>
      <Grid className="md:max-width-md grid-cols-7">
        <Swatch className="bg-success-100" />
        <Swatch className="bg-success-200" />
        <Swatch className="bg-success-300" />
        <Swatch className="bg-success-400" />
        <Swatch className="bg-success-500" />
        <Swatch className="bg-success-600" />
        <Swatch className="bg-success-700" />
      </Grid>

      <Heading level="h3" size="h6">
        Warning
      </Heading>
      <Grid className="md:max-width-md grid-cols-7">
        <Swatch className="bg-warning-100" />
        <Swatch className="bg-warning-200" />
        <Swatch className="bg-warning-300" />
        <Swatch className="bg-warning-400" />
        <Swatch className="bg-warning-500" />
        <Swatch className="bg-warning-600" />
        <Swatch className="bg-warning-700" />
      </Grid>

      <Heading level="h3" size="h6">
        Error
      </Heading>
      <Grid className="md:max-width-md grid-cols-7">
        <Swatch className="bg-error-100" />
        <Swatch className="bg-error-200" />
        <Swatch className="bg-error-300" />
        <Swatch className="bg-error-400" />
        <Swatch className="bg-error-500" />
        <Swatch className="bg-error-600" />
        <Swatch className="bg-error-700" />
      </Grid>

      <Heading level="h3" size="h6">
        Focus
      </Heading>
      <Grid className="md:max-width-md grid-cols-7">
        <Swatch className="bg-focus-100" />
        <Swatch className="bg-focus-200" />
        <Swatch className="bg-focus-300" />
        <Swatch className="bg-focus-400" />
        <Swatch className="bg-focus-500" />
        <Swatch className="bg-focus-600" />
        <Swatch className="bg-focus-700" />
      </Grid>

      <Heading level="h3" size="h6">
        Gray
      </Heading>
      <Grid className="md:max-width-md grid-cols-7">
        <Swatch className="bg-gray-100" />
        <Swatch className="bg-gray-200" />
        <Swatch className="bg-gray-300" />
        <Swatch className="bg-gray-400" />
        <Swatch className="bg-gray-500" />
        <Swatch className="bg-gray-600" />
        <Swatch className="bg-gray-700" />
      </Grid>

      <Heading level="h3" size="h6">
        Black/White
      </Heading>
      <Grid className="md:max-width-md grid-cols-7">
        <Swatch className="bg-black" />
        <Swatch className="bg-white" />
      </Grid>

      <Heading level="h2" size="h4">
        Shadows
      </Heading>
      <Grid className="md:max-width-md grid-cols-6">
        <Swatch className="inset-shadow" />
        <Swatch className="shadow-sm" />
        <Swatch className="shadow-md" />
        <Swatch className="shadow-lg" />
        <Swatch className="shadow-xl" />
        <Swatch className="shadow-2xl" />
      </Grid>

      <Heading level="h2" size="h4">
        Breakpoints
      </Heading>

      <Grid className="xs:grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
        <Swatch className="bg-gray" />
        <Swatch className="bg-gray" />
        <Swatch className="bg-gray" />
        <Swatch className="bg-gray" />
        <Swatch className="bg-gray" />
        <Swatch className="bg-gray" />
        <Swatch className="bg-gray" />
        <Swatch className="bg-gray" />
        <Swatch className="bg-gray" />
        <Swatch className="bg-gray" />
        <Swatch className="bg-gray" />
        <Swatch className="bg-gray" />
        <Swatch className="bg-gray" />
        <Swatch className="bg-gray" />
        <Swatch className="bg-gray" />
        <Swatch className="bg-gray" />
      </Grid>

      <Heading level="h2" size="h4">
        Hover, focus, etc.
      </Heading>

      <button className="rounded bg-primary px-4 py-2 transition duration-100 ease-in-out outline-none hover:bg-secondary focus-visible:bg-focus focus-visible:ring-4 focus-visible:ring-focus/60">
        Focus me
      </button>

      <Heading level="h2" size="h4">
        Child selectors
      </Heading>

      <Grid className="grid-cols-2">
        <div className="bg-gray-700 p-3 text-gray-100 has-[button]:bg-gray-100 has-[button]:text-gray-700">
          <p>No button</p>
        </div>
        <div className="bg-gray-700 p-3 text-gray-100 has-[button]:bg-gray-100 has-[button]:text-gray-700">
          <button>Button</button>
        </div>
      </Grid>
    </div>
  ),
};
