import React from "react";
import { Story, Meta } from "@storybook/react";
import { fakePoolAdvertisements } from "@gc-digital-talent/fake-data";
import { PoolAdvertisement } from "~/api/generated";
import PoolCard from "./PoolCard";

const fakedPool = fakePoolAdvertisements()[0];
const fakedPool2 = fakePoolAdvertisements()[1];
const fakedPool3 = fakePoolAdvertisements()[2];
const fakedPool4 = fakePoolAdvertisements()[3];
const fakedPoolNull = fakePoolAdvertisements()[0];

if (
  fakedPool3.classifications &&
  fakedPool3.classifications[0] &&
  fakedPool3.classifications[0].minSalary
) {
  fakedPool3.classifications[0].minSalary = null;
}

if (
  fakedPool4.classifications &&
  fakedPool4.classifications[0] &&
  fakedPool4.classifications[0].maxSalary
) {
  fakedPool4.classifications[0].maxSalary = null;
}

// idea stolen from ProfilePage.stories.tsx
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nullPool: any = {};
Object.keys(fakedPoolNull).forEach((key) => {
  nullPool[key] = null;
});

export default {
  component: PoolCard,
  title: "Components/Pool Card",
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
    <p data-h2-padding="base(x0.50, 0, x0.5, 0)">Third - only maxSalary</p>
    <PoolCard pool={fakedPool3} />
    <p data-h2-padding="base(x0.50, 0, x0.5, 0)">Fourth - Only minSalary</p>
    <PoolCard pool={fakedPool4} />
    <p data-h2-padding="base(x0.5, 0, x0.5, 0)">Null</p>
    <PoolCard pool={nullPool} />
  </div>
);

export const IndividualPoolCard = TemplatePoolCard.bind({});
