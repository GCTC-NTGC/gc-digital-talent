import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormProvider, useForm } from "react-hook-form";

import { fakePools } from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import SearchResultCard, {
  SearchResultCard_PoolFragment,
} from "./SearchResultCard";

const meta: Meta<typeof SearchResultCard> = {
  component: SearchResultCard,
};

export default meta;
type Story = StoryObj<typeof SearchResultCard>;

const [fakePool] = fakePools();
const poolQuery = makeFragmentData(fakePool, SearchResultCard_PoolFragment);

const Template = () => {
  const methods = useForm();
  return (
    <FormProvider {...methods}>
      <SearchResultCard candidateCount={2} poolQuery={poolQuery} />
    </FormProvider>
  );
};

export const Default: Story = {
  render: () => <Template />,
};
