import { Meta, StoryFn } from "@storybook/react-vite";
import { action } from "storybook/actions";

import {
  fakeClassifications,
  fakeDepartments,
} from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import {
  EmployeeInformationForm,
  EmployeeInformation_QueryFragment,
} from "./EmployeeInformationPage";

const departments = fakeDepartments();
const classifications = fakeClassifications();
const mockFragmentData = makeFragmentData(
  {
    departments,
    classifications,
  },
  EmployeeInformation_QueryFragment,
);

export default {
  component: EmployeeInformationForm,
} as Meta<typeof EmployeeInformationForm>;

const Template: StoryFn<typeof EmployeeInformationForm> = () => {
  return (
    <EmployeeInformationForm
      cacheKey=""
      query={mockFragmentData}
      // Note: Needed for function colouring
      // eslint-disable-next-line @typescript-eslint/require-await
      onSubmit={async (data) => {
        action("submit")(data);
      }}
    />
  );
};

export const Default = Template.bind({});
