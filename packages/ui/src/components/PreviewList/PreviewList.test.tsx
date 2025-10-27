import { ComponentPropsWithoutRef } from "react";
import { composeStories } from "@storybook/react-vite";

import {
  expectNoAccessibilityErrors,
  renderWithProviders,
} from "@gc-digital-talent/vitest-helpers";

import PreviewList, { RootProps } from "./PreviewList";
import * as stories from "./PreviewList.stories";

const { Default } = composeStories(stories);

const renderPreviewList = (
  props: ComponentPropsWithoutRef<typeof PreviewList.Root>,
) => {
  return renderWithProviders(<PreviewList.Root {...props} />);
};

const defaultProps = Default.args as RootProps;

describe("Preview List", () => {
  it("should not have accessibility errors", async () => {
    const { container } = renderPreviewList(defaultProps);
    await expectNoAccessibilityErrors(container);
  });
});
