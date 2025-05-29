import type { StoryFn } from "@storybook/react";
import { action } from "storybook/actions";
import { faker } from "@faker-js/faker/locale/en";
import { useState, FormEvent, ChangeEventHandler } from "react";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import CardRepeater from "./CardRepeater";
import { useCardRepeaterContext } from "./CardRepeaterProvider";
import Button from "../Button/Button";
import Dialog from "../Dialog/Dialog";

faker.seed(0);

export default {
  component: CardRepeater.Root,
};

interface CardItem {
  id: string;
  value: string;
}

interface EditDialogProps {
  item: CardItem;
  index: number;
}

const EditDialog = ({ item, index }: EditDialogProps) => {
  const { update } = useCardRepeaterContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>(item.value);

  const edit = (event: FormEvent) => {
    event.preventDefault();
    const newItem = {
      ...item,
      value,
    };
    action("edit")(newItem);
    update(index, newItem);
    setIsOpen(false);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
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

interface RemoveDialogProps {
  item: CardItem;
  index: number;
}

const RemoveDialog = ({ item, index }: RemoveDialogProps) => {
  const { remove } = useCardRepeaterContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  const add = (event: FormEvent) => {
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

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
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

const Template: StoryFn<typeof CardRepeater.Root<CardItem>> = (args) => {
  const { items: itemsArg } = args;
  const [items, setItems] = useState<CardItem[]>(itemsArg ?? []);

  const handleUpdate = (newItems: CardItem[]) => {
    action("update")(newItems);
    setItems(newItems);
  };

  return (
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

export const Default = {
  render: Template,

  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
  },

  args: {
    items: defaultItems,
  },
};

export const MaxItems = {
  render: Template,

  args: {
    ...Default.args,
    max: 6,
  },
};

export const HiddenIndex = {
  render: Template,

  args: {
    ...Default.args,
    hideIndex: true,
  },
};

export const Disabled = {
  render: Template,

  args: {
    ...Default.args,
    disabled: true,
  },
};

export const Locked = {
  render: Template,

  args: {
    ...Default.args,
    moveDisabledIndexes: [1],
    editDisabledIndexes: [2],
    removeDisabledIndexes: [3],
  },
};
