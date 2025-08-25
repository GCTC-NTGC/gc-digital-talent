import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormProvider, useForm } from "react-hook-form";

import { fakePools } from "@gc-digital-talent/fake-data";

import SearchResultCard from "./SearchResultCard";

const meta: Meta<typeof SearchResultCard> = {
  component: SearchResultCard,
};

export default meta;
type Story = StoryObj<typeof SearchResultCard>;

const Template = () => {
  const methods = useForm();
  return (
    <FormProvider {...methods}>
      <SearchResultCard candidateCount={2} pool={fakePools()[0]} />
    </FormProvider>
  );
};

export const Default: Story = {
  render: () => <Template />,
};
