import React from "react";
import { faker } from "@faker-js/faker";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import RequestConfirmationPage from "./RequestConfirmationPage";

faker.seed(0);
const mockId = faker.datatype.uuid();

export default {
  component: RequestConfirmationPage,
  title: "Pages/Request Confirmation Page",
  parameters: {
    defaultPath: {
      path: "/search/request/:requestId",
      initialEntries: [`/search/request/${mockId}`],
    },
  },
} as ComponentMeta<typeof RequestConfirmationPage>;

const Template: ComponentStory<typeof RequestConfirmationPage> = () => {
  return <RequestConfirmationPage />;
};

export const Default = Template.bind({});
