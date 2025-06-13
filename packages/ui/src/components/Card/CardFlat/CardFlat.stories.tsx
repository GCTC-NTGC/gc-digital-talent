import { StoryFn, Meta } from "@storybook/react-vite";
import { faker } from "@faker-js/faker/locale/en";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import CardFlat from "./CardFlat";

faker.seed(0);

export default {
  component: CardFlat,
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
  },
} as Meta;

const Template: StoryFn = () => (
  <div className="flex flex-col gap-y-6">
    <CardFlat
      title="Primary"
      color="primary"
      links={[{ href: "#", label: "With link", mode: "inline" }]}
    >
      <p>{faker.lorem.sentences(1)}</p>
    </CardFlat>
    <CardFlat
      title="Secondary"
      color="secondary"
      links={[{ href: "#", label: "With link", mode: "inline" }]}
    >
      <p>{faker.lorem.sentences(1)}</p>
    </CardFlat>
    <CardFlat
      title="Success"
      color="success"
      links={[{ href: "#", label: "With link", mode: "inline" }]}
    >
      <p>{faker.lorem.sentences(1)}</p>
    </CardFlat>
    <CardFlat
      title="Warning"
      color="warning"
      links={[{ href: "#", label: "With link", mode: "inline" }]}
    >
      <p>{faker.lorem.sentences(1)}</p>
    </CardFlat>
    <CardFlat
      title="Error"
      color="error"
      links={[{ href: "#", label: "With link", mode: "inline" }]}
    >
      <p>{faker.lorem.sentences(1)}</p>
    </CardFlat>
    <CardFlat
      title="Black"
      color="black"
      links={[{ href: "#", label: "With link", mode: "inline" }]}
    >
      <p>{faker.lorem.sentences(1)}</p>
    </CardFlat>
  </div>
);

export const Default = Template.bind({});
