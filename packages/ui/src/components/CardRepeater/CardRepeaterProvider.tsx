import { useIntl } from "react-intl";
import { createContext, ReactNode, useMemo, useContext } from "react";

import { formMessages } from "@gc-digital-talent/i18n";

import useControllableState from "../../hooks/useControllableState";
import { BaseItem, CardRepeaterContextProps, ItemWithId } from "./types";
import { useAnnouncer } from "../Announcer/Announcer";

const CardRepeaterContext = createContext<CardRepeaterContextProps | undefined>(
  undefined,
);

export type CardRepeaterProviderProps<T extends BaseItem = BaseItem> = {
  children: ReactNode;
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
  // event fired only after items were reordered
  onItemsMoved,
}: CardRepeaterProviderProps<T>) => {
  const [items, setItems] = useControllableState<ItemWithId<T>[]>({
    controlledProp: itemsProp,
    defaultValue: defaultItems,
    onChange: onUpdateProp,
  });

  const value = useMemo(
    () => ({
      items: items ?? ([] as ItemWithId<T>[]),
      onUpdate: (newItems: ItemWithId<T>[]) => setItems(newItems),
      id,
      moveDisabledIndexes,
      editDisabledIndexes,
      removeDisabledIndexes,
      max,
      disabled,
      hideIndex,
      onItemsMoved,
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
      onItemsMoved,
    ],
  );

  return (
    <CardRepeaterContext.Provider value={value as CardRepeaterContextProps}>
      {children}
    </CardRepeaterContext.Provider>
  );
};

export const useCardRepeaterContext = <T extends BaseItem = BaseItem>() => {
  const ctx = useContext(CardRepeaterContext);
  const { announce } = useAnnouncer();
  const intl = useIntl();
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

    ctx?.onItemsMoved?.(newItems);
    ctx?.onUpdate?.(newItems);
    if (announce) {
      announce(
        intl.formatMessage(formMessages.repeaterAnnounceMove, {
          // zero-based index to position
          from: from + 1,
          to: to + 1,
        }),
      );
    }
  };

  const remove = (index: number) => {
    let newItems = [...(ctx?.items ?? [])];
    newItems = [...newItems.slice(0, index), ...newItems.slice(index + 1)];
    ctx?.onUpdate?.(newItems);
    if (announce) {
      announce(
        intl.formatMessage(formMessages.repeaterAnnounceRemove, { index }),
      );
    }
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
