import React, { useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Button from "@common/components/Button";
import type { SubmitHandler } from "react-hook-form";
import SearchFilter, { defaultFormValues } from "./SearchFilter";
import type { FormValues } from "./SearchFilter";

export default {
  title: "Admin/SearchFilter",
  component: SearchFilter,
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
    console.log(event);
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
