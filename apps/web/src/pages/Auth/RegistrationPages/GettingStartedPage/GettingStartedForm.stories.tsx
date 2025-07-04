import { Meta, StoryFn } from "@storybook/react-vite";
import { action } from "storybook/actions";

import { fakeLocalizedEnum } from "@gc-digital-talent/fake-data";
import { Language, makeFragmentData } from "@gc-digital-talent/graphql";

import {
  GettingStartedForm,
  GettingStarted_QueryFragment,
} from "./GettingStartedPage";

const mockFragmentData = makeFragmentData(
  {
    languages: fakeLocalizedEnum(Language),
  },
  GettingStarted_QueryFragment,
);

export default {
  component: GettingStartedForm,
} as Meta<typeof GettingStartedForm>;

const Template: StoryFn<typeof GettingStartedForm> = () => {
  return (
    <GettingStartedForm
      cacheKey=""
      query={mockFragmentData}
      // NOTE: Needed for function colouring
      // eslint-disable-next-line @typescript-eslint/require-await
      handleSubmit={async (data) => {
        action("submit")(data);
      }}
    />
  );
};

export const Default = Template.bind({});
