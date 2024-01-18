import React from "react";
import type { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { faker } from "@faker-js/faker";

import CardRepeater from "./CardRepeater";

faker.seed(0);

export default {
  component: CardRepeater.Root,
  title: "Components/Card Repeater",
};

type CardItem = {
  id: string;
  value: string;
};

const Template: StoryFn<typeof CardRepeater.Root<CardItem>> = (args) => {
  const { items: itemsArg } = args;
  const [items, setItems] = React.useState<CardItem[]>(itemsArg);

  const handleUpdate = (newItems: CardItem[]) => {
    action("update")(newItems);
    setItems(newItems);
  };

  return (
    <CardRepeater.Root<CardItem> items={items} onUpdate={handleUpdate}>
      {items.map((item, index) => (
        <CardRepeater.Card key={item.id} index={index}>
          {item.value}
        </CardRepeater.Card>
      ))}
    </CardRepeater.Root>
  );
};

export const WithItems = Template.bind({});
WithItems.args = {
  items: [
    {
      id: faker.string.uuid(),
      value: faker.company.name(),
    },
    {
      id: faker.string.uuid(),
      value: faker.company.name(),
    },
    {
      id: faker.string.uuid(),
      value: faker.company.name(),
    },
    {
      id: faker.string.uuid(),
      value: faker.company.name(),
    },
  ],
};
