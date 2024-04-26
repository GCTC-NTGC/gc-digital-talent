import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import { fakePools } from "@gc-digital-talent/fake-data";
import { Pool, makeFragmentData } from "@gc-digital-talent/graphql";

import PoolCard, { PoolCard_Fragment } from "./PoolCard";

const fakedPools = fakePools();
const fakedPool = makeFragmentData(fakedPools[0], PoolCard_Fragment);
const fakedPool2 = makeFragmentData(fakedPools[1], PoolCard_Fragment);
const fakedPool3 = makeFragmentData(
  {
    ...fakedPools[2],
    classification: fakedPools[2].classification
      ? {
          ...fakedPools[2].classification,
          minSalary: null,
        }
      : undefined,
  },
  PoolCard_Fragment,
);
const fakedPool4 = makeFragmentData(
  {
    ...fakedPools[3],
    classification: fakedPools[3].classification
      ? {
          ...fakedPools[3].classification,
          maxSalary: null,
        }
      : undefined,
  },
  PoolCard_Fragment,
);
const fakedPoolNull = makeFragmentData(fakedPools[0], PoolCard_Fragment);

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

const TemplatePoolCard: StoryFn<{ pool: Pool }> = () => (
  <div>
    <p data-h2-padding="base(x0.5, 0, x0.5, 0)">First</p>
    <PoolCard poolQuery={fakedPool} />
    <p data-h2-padding="base(x0.50, 0, x0.5, 0)">Second</p>
    <PoolCard poolQuery={fakedPool2} />
    <p data-h2-padding="base(x0.50, 0, x0.5, 0)">Third - only maxSalary</p>
    <PoolCard poolQuery={fakedPool3} />
    <p data-h2-padding="base(x0.50, 0, x0.5, 0)">Fourth - Only minSalary</p>
    <PoolCard poolQuery={fakedPool4} />
    <p data-h2-padding="base(x0.5, 0, x0.5, 0)">Null</p>
    <PoolCard poolQuery={nullPool} />
  </div>
);

export const IndividualPoolCard = TemplatePoolCard.bind({});
