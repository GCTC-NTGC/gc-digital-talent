import { StoryFn, Meta } from "@storybook/react";

import Breadcrumbs from "./Breadcrumbs";

export default {
  component: Breadcrumbs,
} as Meta<typeof Breadcrumbs>;

const Template: StoryFn = () => (
  <Breadcrumbs
    crumbs={[
      {
        label: "Home",
        url: "#home",
      },
      {
        label: "One",
        url: "#one",
      },
      {
        label: "Two",
        url: "#two",
      },
      {
        label: "Three",
        url: "#three",
      },
    ]}
  />
);

export const Default = Template.bind({});
