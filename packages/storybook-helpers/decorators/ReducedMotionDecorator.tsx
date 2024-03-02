import React from "react";
import { MotionConfig } from "framer-motion";
import isChromatic from "chromatic/isChromatic";
import { StoryFn } from "@storybook/react";

const ReducedMotionDecorator = (Story: StoryFn) => (
  <MotionConfig reducedMotion={isChromatic() ? "always" : "user"}>
    <Story />
  </MotionConfig>
);

export default ReducedMotionDecorator;
