import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import { widthOf, heightOf } from "@common/helpers/storybookUtils";
import { fakePoolAdvertisements } from "@common/fakeData";
import { BrowsePools } from "./BrowsePoolsPage";
import { AdvertisementStatus, PublishingGroup } from "../../api/generated";

const mockAdvertisements = fakePoolAdvertisements(3).map((advert) => ({
  ...advert,
  publishingGroup: PublishingGroup.ItJobs,
  advertisementStatus: AdvertisementStatus.Published,
}));

type Meta = ComponentMeta<typeof BrowsePools>;
type Story = ComponentStory<typeof BrowsePools>;

export default {
  component: BrowsePools,
  title: "Pages/Browse Pools Page",
} as Meta;

const Template: Story = () => (
  <BrowsePools poolAdvertisements={mockAdvertisements} />
);

const VIEWPORTS = [
  widthOf(INITIAL_VIEWPORTS.iphonex), // Modern iPhone
  heightOf(INITIAL_VIEWPORTS.ipad12p), // Most common viewport size that falls within chromatic range
];

export const Default = Template.bind({});
Default.parameters = {
  chromatic: { viewports: VIEWPORTS },
  hasDarkMode: true,
};
