import React, { useState } from "react";
import type { ComponentMeta, ComponentStory, StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Button from "@common/components/Button";
import type { SubmitHandler } from "react-hook-form";
import SearchFilter, { defaultFormValues } from "./SearchFilter";
import type { FormValues } from "./SearchFilter";

// Helps Chromatic detect width for snapshots, as otherwise it just captures
// height of the button that opens dialog.
// See: https://www.chromatic.com/docs/faq#why-isn%E2%80%99t-my-modal-or-dialog-captured
const OverlayOrDialogDecorator = (Story: StoryFn) => (
  <div style={{ width: "100%", height: "100vh" }}>
    <Story />
  </div>
);

export default {
  title: "Admin/SearchFilter",
  component: SearchFilter,
  decorators: [OverlayOrDialogDecorator],
} as ComponentMeta<typeof SearchFilter>;

export const Default: ComponentStory<typeof SearchFilter> = () => {
  const [activeFilters, setActiveFilters] =
    useState<FormValues>(defaultFormValues);
  const [isOpen, setIsOpen] = useState(true);

  const handleOpen = () => setIsOpen(true);
  const handleDismiss = () => setIsOpen(false);
  const handleSubmit: SubmitHandler<FormValues> = (data, event) => {
    action("Update filter")(data);
    setActiveFilters(data);
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={handleOpen}>Filters</Button>
      <SearchFilter
        {...{ isOpen, activeFilters }}
        onDismiss={handleDismiss}
        onSubmit={handleSubmit}
      />
    </>
  );
};
