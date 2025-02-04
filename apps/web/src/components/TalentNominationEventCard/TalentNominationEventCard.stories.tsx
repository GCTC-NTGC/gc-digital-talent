import { StoryFn, Meta } from "@storybook/react";
import { faker } from "@faker-js/faker/locale/en";

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
} as Meta;

const Template: StoryFn<typeof TalentNominationEventCard> = (args) => (
  <TalentNominationEventCard {...args} />
);

export const Default = Template.bind({});
