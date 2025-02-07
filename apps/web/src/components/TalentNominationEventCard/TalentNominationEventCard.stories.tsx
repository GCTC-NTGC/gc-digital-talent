import { StoryFn, Meta } from "@storybook/react";
import { faker } from "@faker-js/faker/locale/en";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import TalentNominationEventCard from "./TalentNominationEventCard";

faker.seed(0);

export default {
  component: TalentNominationEventCard,
  args: {
    mode: "Current",
    communityName: faker.lorem.words(8),
    title: faker.lorem.words(3),
    openDate: new Date(2025, 0, 5),
    closeDate: new Date(2025, 1, 1),
    description: faker.lorem.paragraphs(1),
    startUrl: "#",
    learnMoreUrl: "#",
  },
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        "light mobile": allModes["light mobile"],
        dark: allModes.dark,
      },
    },
  },
} as Meta;

const Template: StoryFn<typeof TalentNominationEventCard> = (args) => (
  <TalentNominationEventCard {...args} />
);

export const Default = Template.bind({});
