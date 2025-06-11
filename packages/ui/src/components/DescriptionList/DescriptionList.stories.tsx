import type { StoryFn, Meta } from "@storybook/react-vite";
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

export const Default = {
  render: Template,

  args: {
    children: (
      <>
        <DescriptionList.Item title="Item One">
          {faker.lorem.sentence()}
        </DescriptionList.Item>
        <DescriptionList.Item title="Item Two" color="secondary">
          {faker.lorem.sentence()}
        </DescriptionList.Item>
        <DescriptionList.Item title="Item Three" color="success">
          {faker.lorem.sentence()}
        </DescriptionList.Item>
        <DescriptionList.Item title="Item Three" color="warning">
          {faker.lorem.sentence()}
        </DescriptionList.Item>
        <DescriptionList.Item title="Item Three" color="error">
          {faker.lorem.sentence()}
        </DescriptionList.Item>
      </>
    ),
  },
};

export const WithIcon = {
  render: Template,

  args: {
    children: (
      <>
        <DescriptionList.Item title="Item One" icon={AcademicCapIcon}>
          {faker.lorem.sentence()}
        </DescriptionList.Item>
        <DescriptionList.Item
          title="Item Two"
          icon={BackspaceIcon}
          color="secondary"
        >
          {faker.lorem.sentence()}
        </DescriptionList.Item>
        <DescriptionList.Item
          title="Item Three"
          icon={CakeIcon}
          color="success"
        >
          {faker.lorem.sentence()}
        </DescriptionList.Item>
        <DescriptionList.Item
          title="Item Three"
          icon={DevicePhoneMobileIcon}
          color="warning"
        >
          {faker.lorem.sentence()}
        </DescriptionList.Item>
        <DescriptionList.Item
          title="Item Three"
          icon={EnvelopeIcon}
          color="error"
        >
          {faker.lorem.sentence()}
        </DescriptionList.Item>
      </>
    ),
  },
};
