import type { StoryObj, Meta } from "@storybook/react-vite";

import TalentRequestMatchesTable from "./TalentRequestMatchesTable";

const meta = {
  component: TalentRequestMatchesTable,
} satisfies Meta<typeof TalentRequestMatchesTable>;

export default meta;

export const Default: StoryObj<typeof TalentRequestMatchesTable> = {};
