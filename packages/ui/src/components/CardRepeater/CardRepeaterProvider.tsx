import React from "react";

import useControllableState from "../../hooks/useControllableState";
import { BaseItem, CardRepeaterContextProps, ItemWithId } from "./types";

const CardRepeaterContext = React.createContext<
  CardRepeaterContextProps | undefined
>(undefined);

export type CardRepeaterProviderProps<T extends BaseItem = BaseItem> = {
  children: React.ReactNode;
} & CardRepeaterContextProps<T>;

export const CardRepeaterProvider = <T extends BaseItem>({
  children,
  defaultItems,
  items: itemsProp,
  onUpdate: onUpdateProp,
  id,
  disabled,
  moveDisabledIndexes,
  editDisabledIndexes,
  removeDisabledIndexes,
  max,
  hideIndex,
}: CardRepeaterProviderProps<T>) => {
  const [items, setItems] = useControllableState<ItemWithId<T>[]>({
    controlledProp: itemsProp,
    defaultValue: defaultItems,
    onChange: onUpdateProp,
  });

  const value = React.useMemo(
    () => ({
      items: items ?? [],
      onUpdate: (newItems: ItemWithId<T>[]) => setItems(newItems),
      id,
      moveDisabledIndexes,
      editDisabledIndexes,
      removeDisabledIndexes,
      max,
      disabled,
      hideIndex,
    }),
    [
      items,
      id,
      moveDisabledIndexes,
      editDisabledIndexes,
      removeDisabledIndexes,
      max,
      disabled,
      hideIndex,
      setItems,
    ],
  );

  return (
    <CardRepeaterContext.Provider value={value as CardRepeaterContextProps}>
      {children}
    </CardRepeaterContext.Provider>
  );
};

export const useCardRepeaterContext = <T extends BaseItem = BaseItem>() => {
  const ctx = React.useContext(CardRepeaterContext);
  const total = ctx?.items.length ?? 0;

  const append = (newItem: ItemWithId<T>) => {
    const newItems = [...(ctx?.items ?? []), newItem];
    ctx?.onUpdate?.(newItems);
  };

  const prepend = (newItem: ItemWithId<T>) => {
    const newItems = [newItem, ...(ctx?.items ?? [])];
    ctx?.onUpdate?.(newItems);
  };

  const move = (from: number, to: number) => {
    const newItems = [...(ctx?.items ?? [])];
    const newIndex =
      ((to % newItems.length) + newItems.length) % newItems.length;

    newItems.splice(newIndex, 0, newItems.splice(from, 1)[0]);

    ctx?.onUpdate?.(newItems);
  };

  const remove = (index: number) => {
    let newItems = [...(ctx?.items ?? [])];
    newItems = [...newItems.slice(0, index), ...newItems.slice(index + 1)];
    ctx?.onUpdate?.(newItems);
  };

  const update = (index: number, item: Partial<ItemWithId<T>>) => {
    let newItems = [...(ctx?.items ?? [])];
    newItems = [
      ...newItems.slice(0, index),
      {
        ...newItems[index],
        ...item,
      },
      ...newItems.slice(index + 1),
    ];
    ctx?.onUpdate?.(newItems);
  };

  return {
    ...ctx,
    total,
    append,
    prepend,
    move,
    remove,
    update,
  };
};
