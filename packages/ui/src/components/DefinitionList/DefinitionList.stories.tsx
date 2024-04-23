import React from "react";
import type { StoryFn, Meta } from "@storybook/react";
import AcademicCapIcon from "@heroicons/react/24/solid/AcademicCapIcon";
import BackspaceIcon from "@heroicons/react/24/solid/BackspaceIcon";
import CakeIcon from "@heroicons/react/24/solid/CakeIcon";
import DevicePhoneMobileIcon from "@heroicons/react/24/solid/DevicePhoneMobileIcon";
import EnvelopeIcon from "@heroicons/react/24/solid/EnvelopeIcon";
import { faker } from "@faker-js/faker";

import DefinitionList from "./DefinitionList";

faker.seed(0);

export default {
  component: DefinitionList.Root,
  title: "Components/Definition List",
} as Meta<typeof DefinitionList.Root>;

const Template: StoryFn<typeof DefinitionList.Root> = (args) => {
  const { children } = args;

  return <DefinitionList.Root>{children}</DefinitionList.Root>;
};

export const Default = Template.bind({});
Default.args = {
  children: (
    <>
      <DefinitionList.Item title="Item One">
        {faker.lorem.sentence()}
      </DefinitionList.Item>
      <DefinitionList.Item title="Item Two" color="secondary">
        {faker.lorem.sentence()}
      </DefinitionList.Item>
      <DefinitionList.Item title="Item Three" color="tertiary">
        {faker.lorem.sentence()}
      </DefinitionList.Item>
      <DefinitionList.Item title="Item Three" color="quaternary">
        {faker.lorem.sentence()}
      </DefinitionList.Item>
      <DefinitionList.Item title="Item Three" color="quinary">
        {faker.lorem.sentence()}
      </DefinitionList.Item>
    </>
  ),
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  children: (
    <>
      <DefinitionList.Item title="Item One" Icon={AcademicCapIcon}>
        {faker.lorem.sentence()}
      </DefinitionList.Item>
      <DefinitionList.Item
        title="Item Two"
        Icon={BackspaceIcon}
        color="secondary"
      >
        {faker.lorem.sentence()}
      </DefinitionList.Item>
      <DefinitionList.Item title="Item Three" Icon={CakeIcon} color="tertiary">
        {faker.lorem.sentence()}
      </DefinitionList.Item>
      <DefinitionList.Item
        title="Item Three"
        Icon={DevicePhoneMobileIcon}
        color="quaternary"
      >
        {faker.lorem.sentence()}
      </DefinitionList.Item>
      <DefinitionList.Item
        title="Item Three"
        Icon={EnvelopeIcon}
        color="quinary"
      >
        {faker.lorem.sentence()}
      </DefinitionList.Item>
    </>
  ),
};
