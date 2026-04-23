import type { StoryFn, Meta } from "@storybook/react-vite";
import { faker } from "@faker-js/faker";

import { allModes } from "@gc-digital-talent/storybook-helpers";
import {
  fakeClassifications,
  fakeDevelopmentPrograms,
} from "@gc-digital-talent/fake-data";
import { Ul } from "@gc-digital-talent/ui";

import DevelopmentProgramCard from "./DevelopmentProgramCard";

const developmentPrograms = fakeDevelopmentPrograms(3);
const classifications = fakeClassifications();

export default {
  component: DevelopmentProgramCard,
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        "light mobile": allModes["light mobile"],
        dark: allModes.dark,
        "dark mobile": allModes["dark mobile"],
      },
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/guHeIIh8dqFVCks310Wv0G/Component-library?node-id=11-4252",
    },
  },
} as Meta<typeof DevelopmentProgramCard>;

const Template: StoryFn<typeof DevelopmentProgramCard> = () => {
  return (
    <Ul unStyled className="bg-white">
      {developmentPrograms.map((d) => (
        <DevelopmentProgramCard
          key={d.id}
          title={d.name.localized ?? "Development Program name"}
          description={
            d.descriptionForProfile.localized ?? faker.lorem.paragraph()
          }
          iconLabel="Aria label for opening actions"
          classificationRestrictions={classifications}
          edit="Edit button"
          remove="Remove button"
        />
      ))}
    </Ul>
  );
};

export const Default = Template.bind({});
