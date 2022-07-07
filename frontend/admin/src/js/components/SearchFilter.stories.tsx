import React, { useState } from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Button from "@common/components/Button";
import type { SubmitHandler } from "react-hook-form";
import SearchFilter from "./SearchFilter";
import type { FormValues } from "./SearchFilter";
import OverlayOrDialogDecorator from "@common/../.storybook/decorators/OverlayOrDialogDecorator";
import useSearchFilterOptions from "./useSearchFilterOptions";

export default {
  title: "Admin/SearchFilter",
  component: SearchFilter,
  decorators: [OverlayOrDialogDecorator],
} as ComponentMeta<typeof SearchFilter>;

export const Default: ComponentStory<typeof SearchFilter> = () => {
  const { emptyFormValues } = useSearchFilterOptions();
  const [activeFilters, setActiveFilters] =
    useState<FormValues>(emptyFormValues);
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
