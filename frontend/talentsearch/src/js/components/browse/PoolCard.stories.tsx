import React from "react";
import { Story, Meta } from "@storybook/react";
import { fakePoolAdvertisements } from "@common/fakeData";
import PoolCard from "./PoolCard";
import { PoolAdvertisement } from "../../api/generated";

const fakedPool = fakePoolAdvertisements()[0];
const fakedPool2 = fakePoolAdvertisements()[1];
const fakedPoolNull = fakePoolAdvertisements()[0];

// idea stolen from ProfilePage.stories.tsx
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nullPool: any = {};
Object.keys(fakedPoolNull).forEach((key) => {
  nullPool[key] = null;
});

export default {
  component: PoolCard,
  title: "Components/PoolCard",
  args: {
    pool: fakedPool,
  },
} as Meta;

const TemplatePoolCard: Story<{ pool: PoolAdvertisement }> = () => (
  <div>
    <p data-h2-padding="base(x0.5, 0, x0.5, 0)">First</p>
    <PoolCard pool={fakedPool} />
    <p data-h2-padding="base(x0.50, 0, x0.5, 0)">Second</p>
    <PoolCard pool={fakedPool2} />
    <p data-h2-padding="base(x0.5, 0, x0.5, 0)">Null</p>
    <PoolCard pool={nullPool} />
  </div>
);

export const IndividualPoolCard = TemplatePoolCard.bind({});
