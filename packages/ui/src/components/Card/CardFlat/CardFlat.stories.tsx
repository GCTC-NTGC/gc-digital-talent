import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { faker } from "@faker-js/faker";

import CardFlat from "./CardFlat";

export default {
  component: CardFlat,
  title: "Components/Card Flat",
} as Meta;

const Template: StoryFn = () => {
  faker.seed(0);

  const Cards = (
    <div>
      <CardFlat
        title="Primary"
        color="primary"
        links={[{ href: "#", label: "With link", mode: "inline" }]}
      >
        <p>{faker.lorem.sentences(1)}</p>
      </CardFlat>
      <CardFlat
        title="Secondary"
        color="secondary"
        links={[{ href: "#", label: "With link", mode: "inline" }]}
      >
        <p>{faker.lorem.sentences(1)}</p>
      </CardFlat>
      <CardFlat
        title="Tertiary"
        color="tertiary"
        links={[{ href: "#", label: "With link", mode: "inline" }]}
      >
        <p>{faker.lorem.sentences(1)}</p>
      </CardFlat>
      <CardFlat
        title="Quaternary"
        color="quaternary"
        links={[{ href: "#", label: "With link", mode: "inline" }]}
      >
        <p>{faker.lorem.sentences(1)}</p>
      </CardFlat>
      <CardFlat
        title="Quinary"
        color="quinary"
        links={[{ href: "#", label: "With link", mode: "inline" }]}
      >
        <p>{faker.lorem.sentences(1)}</p>
      </CardFlat>
      <CardFlat
        title="Black"
        color="black"
        links={[{ href: "#", label: "With link", mode: "inline" }]}
      >
        <p>{faker.lorem.sentences(1)}</p>
      </CardFlat>
    </div>
  );
  return (
    <div>
      <div
        data-h2-display="base(grid) base:children[>div>div>div](grid)"
        data-h2-grid-template-columns="base(1fr) base:children[>div>div>div](repeat(6, minmax(0, 1fr)))"
        data-h2-height="base:children[>div>div>div](100%)"
        data-h2-padding="base:children[>div>div>div](x2)"
        data-h2-gap="base:children[>div>div>div](x1)"
        data-h2-background-color="base:children[>div>div>div](background)"
      >
        <div data-h2="light">
          <div>{Cards}</div>
        </div>
        <div data-h2="dark">
          <div>{Cards}</div>
        </div>
        <div data-h2="iap light">
          <div>{Cards}</div>
        </div>
        <div data-h2="iap dark">
          <div>{Cards}</div>
        </div>
      </div>
    </div>
  );
};

export const CardFlatStory = Template.bind({});
