import { composeStories } from "@storybook/react-vite";
import { ComponentProps } from "react";

import {
  renderWithProviders,
  expectNoAccessibilityErrors,
} from "@gc-digital-talent/vitest-helpers";

import * as stories from "./ResourceBlock.stories";
import { RootProps } from "./Root";

import ResourceBlock from "./";

const { Default } = composeStories(stories);

const renderComponent = (props: ComponentProps<typeof ResourceBlock.Root>) => {
  return renderWithProviders(<ResourceBlock.Root {...props} />);
};

const defaultProps = Default.args as RootProps;

describe("ResourceBlock", () => {
  it("should not have accessibility errors", async () => {
    const { container } = renderComponent(defaultProps);
    await expectNoAccessibilityErrors(container);
  });
});
