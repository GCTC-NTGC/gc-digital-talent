import React, { useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import Button from "@common/components/Button";
import SearchFilter from "./SearchFilter";

export default {
  title: "Admin/SearchFilter",
  component: SearchFilter,
} as ComponentMeta<typeof SearchFilter>;

export const Default: ComponentStory<typeof SearchFilter> = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleOpen = () => setIsOpen(true);
  const handleDismiss = () => setIsOpen(false);
  return (
    <>
      <Button onClick={handleOpen}>Filters</Button>
      <SearchFilter isOpen={isOpen} onDismiss={handleDismiss} />
    </>
  );
};
