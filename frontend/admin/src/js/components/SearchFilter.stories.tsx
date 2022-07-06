import React, { useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Button from "@common/components/Button";
import type { SubmitHandler } from "react-hook-form";
import SearchFilter from "./SearchFilter";
import type { FormValues } from "./SearchFilter";

export default {
  title: "Admin/SearchFilter",
  component: SearchFilter,
} as ComponentMeta<typeof SearchFilter>;

export const Default: ComponentStory<typeof SearchFilter> = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleOpen = () => setIsOpen(true);
  const handleDismiss = () => setIsOpen(false);
  const handleSubmit: SubmitHandler<FormValues> = (data, event) => {
    action("Update filter")(data);
    console.log(event);
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={handleOpen}>Filters</Button>
      <SearchFilter
        isOpen={isOpen}
        onDismiss={handleDismiss}
        onSubmit={handleSubmit}
      />
    </>
  );
};
