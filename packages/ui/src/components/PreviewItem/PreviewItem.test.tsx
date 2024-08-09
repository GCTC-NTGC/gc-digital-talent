/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { ComponentPropsWithoutRef } from "react";

import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";

import PreviewItem from "./PreviewItem";
import { previewDetails } from "./PreviewItem.stories";

const renderPreviewItem = (
  props: ComponentPropsWithoutRef<typeof PreviewItem>,
) => {
  return renderWithProviders(<PreviewItem {...props} />);
};

const defaultProps = {
  title: "Preview Item",
  details: previewDetails,
};

describe("Tabs", () => {
  it("should not have accessibility errors", async () => {
    const { container } = renderPreviewItem(defaultProps);
    await axeTest(container);
  });
});
