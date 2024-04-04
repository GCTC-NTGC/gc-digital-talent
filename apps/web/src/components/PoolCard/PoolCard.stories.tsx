import React from "react";
import { Story, Meta } from "@storybook/react";

import { fakePools } from "@gc-digital-talent/fake-data";
import { Pool } from "@gc-digital-talent/graphql";

import PoolCard from "./PoolCard";

const fakedPools = fakePools();
const fakedPool = fakedPools[0];
const fakedPool2 = fakedPools[1];
const fakedPool3 = fakedPools[2];
const fakedPool4 = fakedPools[3];
const fakedPoolNull = fakedPools[0];

if (fakedPool3.classification?.minSalary) {
  fakedPool3.classification.minSalary = null;
}

if (fakedPool4.classification?.maxSalary) {
  fakedPool4.classification.maxSalary = null;
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

const TemplatePoolCard: Story<{ pool: Pool }> = () => (
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
