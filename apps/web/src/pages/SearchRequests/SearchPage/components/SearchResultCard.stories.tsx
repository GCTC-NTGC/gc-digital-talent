import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { fakePools } from "@gc-digital-talent/fake-data";

import SearchResultCard from "./SearchResultCard";

const meta: Meta<typeof SearchResultCard> = {
  title: "Components/Search Result Card",
  component: SearchResultCard,
};

export default meta;
type Story = StoryObj<typeof SearchResultCard>;

export const Default: Story = {
  render: () => <SearchResultCard candidateCount={2} pool={fakePools()[0]} />,
};
