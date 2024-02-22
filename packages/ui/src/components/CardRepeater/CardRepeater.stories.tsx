import React from "react";
import type { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { faker } from "@faker-js/faker";

import CardRepeater from "./CardRepeater";
import { useCardRepeaterContext } from "./CardRepeaterProvider";
import Button from "../Button/Button";
import Dialog from "../Dialog/Dialog";

faker.seed(0);

export default {
  component: CardRepeater.Root,
  title: "Components/Card Repeater",
};

type CardItem = {
  id: string;
  value: string;
};

type EditDialogProps = {
  item: CardItem;
  index: number;
};

const EditDialog = ({ item, index }: EditDialogProps) => {
  const { update } = useCardRepeaterContext();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>(item.value);

  const edit = (event: React.FormEvent) => {
    event.preventDefault();
    const newItem = {
      ...item,
      value,
    };
    action("edit")(newItem);
    update(index, newItem);
    setIsOpen(false);
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setValue(event.currentTarget.value);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <CardRepeater.Edit>Edit {item.value}</CardRepeater.Edit>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>Edit an item</Dialog.Header>
        <Dialog.Body>
          <form onSubmit={edit}>
            <label htmlFor="value">Value</label>
            <input
              id="value"
              type="text"
              name="value"
              value={value}
              onChange={handleChange}
              required
            />
            <Dialog.Footer>
              <Button type="submit">Save</Button>
            </Dialog.Footer>
          </form>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

type RemoveDialogProps = {
  item: CardItem;
  index: number;
};

const RemoveDialog = ({ item, index }: RemoveDialogProps) => {
  const { remove } = useCardRepeaterContext();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const Remove = () => {
    action("Remove")(item);
    remove(index);
    setIsOpen(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <CardRepeater.Remove>Remove {item.value}</CardRepeater.Remove>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>Remove an item</Dialog.Header>
        <Dialog.Body>
          Are you sure?
          <Dialog.Footer>
            <Button type="button" color="error" onClick={Remove}>
              Remove
            </Button>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

const AddDialog = () => {
  const { append } = useCardRepeaterContext();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>("");

  const add = (event: React.FormEvent) => {
    event.preventDefault();
    const item = {
      id: faker.string.uuid(),
      value,
    };
    action("add")(item);
    append(item);
    setValue("");
    setIsOpen(false);
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setValue(event.currentTarget.value);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <CardRepeater.Add />
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>Add an item</Dialog.Header>
        <Dialog.Body>
          <form onSubmit={add}>
            <label htmlFor="value">Value</label>
            <input
              id="value"
              type="text"
              name="value"
              value={value}
              onChange={handleChange}
              required
            />
            <Dialog.Footer>
              <Button type="submit">Add</Button>
            </Dialog.Footer>
          </form>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

const themes = ["light", "dark"];

const Template: StoryFn<typeof CardRepeater.Root<CardItem>> = (args) => {
  const { items: itemsArg } = args;
  const [items, setItems] = React.useState<CardItem[]>(itemsArg ?? []);

  const handleUpdate = (newItems: CardItem[]) => {
    action("update")(newItems);
    setItems(newItems);
  };

  return (
    <div
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="base(100%) l-tablet(50% 50%)"
    >
      {themes.map((theme) => (
        <div data-h2={theme} key={theme}>
          <div data-h2-background="base(background)" data-h2-padding="base(x2)">
            <CardRepeater.Root<CardItem>
              {...args}
              items={items}
              onUpdate={handleUpdate}
              add={<AddDialog />}
            >
              {items.map((item, index) => (
                <CardRepeater.Card
                  key={item.id}
                  index={index}
                  edit={<EditDialog item={item} index={index} />}
                  remove={<RemoveDialog item={item} index={index} />}
                >
                  {item.value}
                </CardRepeater.Card>
              ))}
            </CardRepeater.Root>
          </div>
        </div>
      ))}
    </div>
  );
};

const defaultItems = [
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
  {
    id: faker.string.uuid(),
    value: faker.company.name(),
  },
  {
    id: faker.string.uuid(),
    value: faker.company.name(),
  },
];

export const WithItems = Template.bind({});
WithItems.args = {
  items: defaultItems,
};

export const MaxItems = Template.bind({});
MaxItems.args = {
  ...WithItems.args,
  max: 6,
};

export const HiddenIndex = Template.bind({});
HiddenIndex.args = {
  ...WithItems.args,
  hideIndex: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...WithItems.args,
  disabled: true,
};

export const Locked = Template.bind({});
Locked.args = {
  ...WithItems.args,
  moveDisabledIndexes: [1],
  editDisabledIndexes: [2],
  removeDisabledIndexes: [3],
};
