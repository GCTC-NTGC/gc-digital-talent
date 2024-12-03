import type { StoryFn, Meta } from "@storybook/react";
import AcademicCapIcon from "@heroicons/react/24/solid/AcademicCapIcon";
import BackspaceIcon from "@heroicons/react/24/solid/BackspaceIcon";
import CakeIcon from "@heroicons/react/24/solid/CakeIcon";
import DevicePhoneMobileIcon from "@heroicons/react/24/solid/DevicePhoneMobileIcon";
import EnvelopeIcon from "@heroicons/react/24/solid/EnvelopeIcon";
import { faker } from "@faker-js/faker/locale/en";

import DescriptionList from "./DescriptionList";

faker.seed(0);

export default {
  component: DescriptionList.Root,
} as Meta<typeof DescriptionList.Root>;

const Template: StoryFn<typeof DescriptionList.Root> = (args) => {
  const { children } = args;

  return <DescriptionList.Root>{children}</DescriptionList.Root>;
};

export const Default = Template.bind({});
Default.args = {
  children: (
    <>
      <DescriptionList.Item title="Item One">
        {faker.lorem.sentence()}
      </DescriptionList.Item>
      <DescriptionList.Item title="Item Two" color="secondary">
        {faker.lorem.sentence()}
      </DescriptionList.Item>
      <DescriptionList.Item title="Item Three" color="tertiary">
        {faker.lorem.sentence()}
      </DescriptionList.Item>
      <DescriptionList.Item title="Item Three" color="quaternary">
        {faker.lorem.sentence()}
      </DescriptionList.Item>
      <DescriptionList.Item title="Item Three" color="quinary">
        {faker.lorem.sentence()}
      </DescriptionList.Item>
    </>
  ),
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  children: (
    <>
      <DescriptionList.Item title="Item One" Icon={AcademicCapIcon}>
        {faker.lorem.sentence()}
      </DescriptionList.Item>
      <DescriptionList.Item
        title="Item Two"
        Icon={BackspaceIcon}
        color="secondary"
      >
        {faker.lorem.sentence()}
      </DescriptionList.Item>
      <DescriptionList.Item title="Item Three" Icon={CakeIcon} color="tertiary">
        {faker.lorem.sentence()}
      </DescriptionList.Item>
      <DescriptionList.Item
        title="Item Three"
        Icon={DevicePhoneMobileIcon}
        color="quaternary"
      >
        {faker.lorem.sentence()}
      </DescriptionList.Item>
      <DescriptionList.Item
        title="Item Three"
        Icon={EnvelopeIcon}
        color="quinary"
      >
        {faker.lorem.sentence()}
      </DescriptionList.Item>
    </>
  ),
};
