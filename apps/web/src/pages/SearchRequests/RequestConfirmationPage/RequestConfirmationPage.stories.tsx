import { faker } from "@faker-js/faker/locale/en";
import { Meta, StoryFn } from "@storybook/react-vite";

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
    a11y: {
      context: {
        // NOTE: We don't only use colour, have an underline
        exclude: [".Hero", "a"],
      },
    },
  },
} as Meta<typeof RequestConfirmationPage>;

const Template: StoryFn<typeof RequestConfirmationPage> = () => {
  return <RequestConfirmationPage />;
};

export const Default = Template.bind({});
