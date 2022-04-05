import React from "react";
import { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import SearchBar, { SearchBarProps } from "./SearchBar";

export default {
  component: SearchBar,
  title: "Skills/SearchBar",
  args: {
    maxWidth: "30rem",
    handleSearch: action("handleSearch"),
  },
  argTypes: {
    maxWidth: {
      name: "Max Width",
      type: { name: "string", required: true },
      control: {
        type: "text",
      },
    },
  },
} as Meta;

const TemplateSearchBar: Story<SearchBarProps & { maxWidth: string }> = (
  args,
) => {
  const { maxWidth } = args;
  return (
    <div style={{ maxWidth }}>
      <SearchBar {...args} />
    </div>
  );
};

export const SearchBarStory = TemplateSearchBar.bind({});
