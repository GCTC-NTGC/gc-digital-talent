import { faker } from "@faker-js/faker/locale/en";
import { Meta, StoryFn } from "@storybook/react";

import RequestConfirmationPage from "./RequestConfirmationPage";

faker.seed(0);
const mockId = faker.string.uuid();

export default {
  component: RequestConfirmationPage,
  parameters: {
    defaultPath: {
      path: "/search/request/:requestId",
      initialEntries: [`/search/request/${mockId}`],
    },
  },
} as Meta<typeof RequestConfirmationPage>;

const Template: StoryFn<typeof RequestConfirmationPage> = () => {
  return <RequestConfirmationPage />;
};

export const Default = {
  render: Template,
};
