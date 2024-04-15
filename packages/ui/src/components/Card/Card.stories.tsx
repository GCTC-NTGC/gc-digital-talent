import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { faker } from "@faker-js/faker";

import Card from "./Card";

export default {
  component: Card,
  title: "Components/Card",
} as Meta;

const Template: StoryFn = () => {
  faker.seed(0);
  const Cards = (
    <div>
      <Card title="Primary" subtitle={faker.lorem.words(5)} bold>
        <p>{faker.lorem.sentences(2)}</p>
      </Card>
      <Card
        title="Secondary"
        color="secondary"
        subtitle={faker.lorem.words(5)}
        bold
      >
        <p>{faker.lorem.sentences(2)}</p>
      </Card>
      <Card
        title="Tertiary"
        color="tertiary"
        subtitle={faker.lorem.words(5)}
        bold
      >
        <p>{faker.lorem.sentences(2)}</p>
      </Card>
      <Card
        title="Quaternary"
        color="quaternary"
        subtitle={faker.lorem.words(5)}
        bold
      >
        <p>{faker.lorem.sentences(2)}</p>
      </Card>
      <Card
        title="Quinary"
        color="quinary"
        subtitle={faker.lorem.words(5)}
        bold
      >
        <p>{faker.lorem.sentences(2)}</p>
      </Card>
      <Card title="Black" color="black" subtitle={faker.lorem.words(5)} bold>
        <p>{faker.lorem.sentences(2)}</p>
      </Card>
      <Card title="White" color="white" subtitle={faker.lorem.words(5)} bold>
        <p>{faker.lorem.sentences(2)}</p>
      </Card>
    </div>
  );
  return (
    <div>
      <div
        data-h2-display="base(grid) base:children[>div>div](grid)"
        data-h2-grid-template-columns="base(1fr) base:children[>div>div](repeat(7, minmax(0, 1fr)))"
        data-h2-height="base:children[>div>div](100%)"
        data-h2-padding="base:children[>div>div](x2)"
        data-h2-gap="base:children[>div>div](x1)"
        data-h2-background-color="base:children[>div>div](background)"
      >
        <div data-h2="light">{Cards}</div>
        <div data-h2="dark">{Cards}</div>
        <div data-h2="iap light">{Cards}</div>
        <div data-h2="iap dark">{Cards}</div>
      </div>
    </div>
  );
};

export const CardStory = Template.bind({});
