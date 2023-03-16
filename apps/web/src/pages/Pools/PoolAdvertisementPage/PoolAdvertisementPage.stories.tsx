import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { fakePoolAdvertisements } from "@gc-digital-talent/fake-data";
import { PoolAdvertisementPoster } from "./PoolAdvertisementPage";

const fakeAdvertisement = fakePoolAdvertisements()[0];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nullAdvertisement: any = {};
Object.keys(fakeAdvertisement).forEach((key) => {
  nullAdvertisement[key] = null;
});
nullAdvertisement.id = fakeAdvertisement.id; // advertisement will never have a null id

export default {
  component: PoolAdvertisementPoster,
  title: "Pages/Pool Advertisement Poster",
} as ComponentMeta<typeof PoolAdvertisementPoster>;

const Template: ComponentStory<typeof PoolAdvertisementPoster> = (args) => {
  const { poolAdvertisement } = args;
  return <PoolAdvertisementPoster poolAdvertisement={poolAdvertisement} />;
};

export const CompletedPoolPoster = Template.bind({});
CompletedPoolPoster.args = { poolAdvertisement: fakeAdvertisement };

export const NullPoolPoster = Template.bind({});
NullPoolPoster.args = { poolAdvertisement: nullAdvertisement };
