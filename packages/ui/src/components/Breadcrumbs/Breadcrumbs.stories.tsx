import React from "react";
import { Story, ComponentMeta } from "@storybook/react";

import Breadcrumbs from "./Breadcrumbs";

export default {
  component: Breadcrumbs,
  title: "Components/Breadcrumbs",
} as ComponentMeta<typeof Breadcrumbs>;

const CrumbData = [
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
];

const Standard: Story = () => (
  <>
    <div data-h2="light">
      <div
        data-h2-padding="base(x2)"
        data-h2-background-color="base(background)"
      >
        <Breadcrumbs crumbs={CrumbData} />
      </div>
    </div>
    <div data-h2="dark">
      <div
        data-h2-padding="base(x2)"
        data-h2-background-color="base(background)"
      >
        <Breadcrumbs crumbs={CrumbData} />
      </div>
    </div>
    <div data-h2="iap light">
      <div
        data-h2-padding="base(x2)"
        data-h2-background-color="base(background)"
      >
        <Breadcrumbs crumbs={CrumbData} />
      </div>
    </div>
    <div data-h2="iap dark">
      <div
        data-h2-padding="base(x2)"
        data-h2-background-color="base(background)"
      >
        <Breadcrumbs crumbs={CrumbData} />
      </div>
    </div>
  </>
);

export const Default = Standard.bind({});
