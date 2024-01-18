import React from "react";

import {
  CardRepeaterProvider,
  CardRepeaterProviderProps,
  useCardRepeaterContext,
} from "./CardRepeaterProvider";
import { BaseItem } from "./types";

type AddProps = {
  onClickAdd?: () => void;
};

const Add = ({ onClickAdd }: AddProps) => {
  const { max, total, messages } = useCardRepeaterContext();

  if (total === max || !onClickAdd) return null;

  return (
    <button type="button" onClick={onClickAdd}>
      {messages?.addButton || "Add"}
    </button>
  );
};

type CardProps = {
  index: number;
  children: React.ReactNode;
};

const Card = ({ index, children }: CardProps) => {
  const { move, remove, total, items } = useCardRepeaterContext();
  const item = items?.[index];
  if (!item) return null;

  const up = () => {
    const to = index - 1;
    move(index, to < 0 ? 0 : to);
  };

  const down = () => {
    const to = index + 1;
    move(index, to > total ? total : to);
  };

  return (
    <div>
      {index + 1}
      <button type="button" disabled={index === 0} onClick={up}>
        Up
      </button>
      <button
        type="button"
        disabled={total <= 1 || index >= total - 1}
        onClick={down}
      >
        Down
      </button>
      <button type="button" onClick={() => remove(index)}>
        Remove
      </button>
      {children}
    </div>
  );
};

type RootProps<T extends BaseItem> = CardRepeaterProviderProps<T> & AddProps;

const Root = <T extends BaseItem>({
  children,
  items,
  onClickAdd,
  ...rest
}: RootProps<T>) => (
  <CardRepeaterProvider items={items} {...rest}>
    {children}
    <Add {...{ onClickAdd }} />
  </CardRepeaterProvider>
);

export default {
  Root,
  Card,
};
