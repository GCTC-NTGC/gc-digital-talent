import type { StoryFn, Meta } from "@storybook/react-vite";

import { allModes } from "@gc-digital-talent/storybook-helpers";
import { fakeClassifications } from "@gc-digital-talent/fake-data";

import DevelopmentProgramCard from "./DevelopmentProgramCard";
import fakeDevelopmentPrograms from "../../../../../packages/fake-data/src/fakeDevelopmentPrograms";

const developmentPrograms = fakeDevelopmentPrograms();
const classifications = fakeClassifications();

export default {
  component: DevelopmentProgramCard,
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
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
    <div className="bg-white">
      {developmentPrograms.map((d) => (
        <DevelopmentProgramCard
          key={d.id}
          title={d.name.localized ?? "Development Program name"}
          description={
            d.descriptionForProfile.localized ??
            "Description for the development program. Description for the development program. Description for the development program. Description for the development program. Description for the development program."
          }
          iconLabel="Aria label for opening actions"
          classificationRestrictions={classifications}
          edit="Edit button"
          remove="Remove button"
        />
      ))}
    </div>
  );
};

export const Default = Template.bind({});
