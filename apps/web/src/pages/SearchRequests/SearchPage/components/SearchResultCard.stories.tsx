import React from "react";

import type { Meta, StoryObj } from "@storybook/react";

import { fakePools } from "@gc-digital-talent/fake-data";
import { action } from "@storybook/addon-actions";
import SearchResultCard from "./SearchResultCard";

const meta: Meta<typeof SearchResultCard> = {
  title: "Components/Search Result Card",
  component: SearchResultCard,
};

export default meta;
type Story = StoryObj<typeof SearchResultCard>;

export const Default: Story = {
  render: () => (
    <SearchResultCard
      candidateCount={2}
      pool={fakePools()[0]}
      handleSubmit={async (candidateCount, poolId, selectedClassifications) => {
        action("handleSubmit")({
          candidateCount,
          poolId,
          selectedClassifications,
        });
      }}
    />
  ),
};
