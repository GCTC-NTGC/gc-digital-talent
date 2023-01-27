import React from "react";
import { Story, Meta } from "@storybook/react";
import { fakePoolAdvertisements } from "@common/fakeData";
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
} as Meta;

const TemplatePoolAdvertisementPoster: Story = (...args) => (
  <PoolAdvertisementPoster poolAdvertisement={args[0].poolAdvertisement} />
);

export const CompletedPoolPoster = TemplatePoolAdvertisementPoster.bind({});
CompletedPoolPoster.args = { poolAdvertisement: fakeAdvertisement };

export const NullPoolPoster = TemplatePoolAdvertisementPoster.bind({});
NullPoolPoster.args = { poolAdvertisement: nullAdvertisement };
