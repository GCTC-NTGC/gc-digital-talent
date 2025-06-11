import { StoryFn, Meta } from "@storybook/react-vite";
import { faker } from "@faker-js/faker/locale/en";

import { allModes } from "@gc-digital-talent/storybook-helpers";
import { makeFragmentData } from "@gc-digital-talent/graphql";
import { fakeCommunities } from "@gc-digital-talent/fake-data";
import {
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
  PAST_DATE,
} from "@gc-digital-talent/date-helpers";

import TalentNominationEventCard, {
  TalentNominationEventCard_Fragment,
} from "./TalentNominationEventCard";

faker.seed(0);

export default {
  component: TalentNominationEventCard,
  args: {
    talentNominationEventQuery: makeFragmentData(
      {
        id: faker.string.uuid(),
        community: fakeCommunities(1)[0],
        name: { localized: faker.lorem.words(3) },
        openDate: faker.date
          .between({ from: FAR_PAST_DATE, to: PAST_DATE })
          .toISOString(),
        closeDate: faker.date
          .between({ from: PAST_DATE, to: FAR_FUTURE_DATE })
          .toISOString(),
        description: { localized: faker.lorem.paragraphs(1) },
        learnMoreUrl: { localized: "#" },
      },
      TalentNominationEventCard_Fragment,
    ),
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
