import React from "react";
import { useIntl } from "react-intl";

import { formMessages } from "@gc-digital-talent/i18n";

import useControllableState from "../../hooks/useControllableState";
import { BaseItem, CardRepeaterContextProps, ItemWithId } from "./types";
import { useAnnouncer } from "../Announcer/Announcer";

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
  const { announce } = useAnnouncer();
  const intl = useIntl();
  const total = ctx?.items.length ?? 0;

  const append = (newItem: ItemWithId<T>): Promise<void> => {
    const newItems = [...(ctx?.items ?? []), newItem];
    if (ctx?.onUpdate) {
      return ctx.onUpdate(newItems);
    }
    return Promise.reject();
  };

  const prepend = (newItem: ItemWithId<T>): Promise<void> => {
    const newItems = [newItem, ...(ctx?.items ?? [])];
    if (ctx?.onUpdate) {
      return ctx.onUpdate(newItems);
    }
    return Promise.reject();
  };

  const move = (from: number, to: number): Promise<void> => {
    console.debug("-> CardRepeaterProvider.move");
    if (!ctx?.onUpdate) return Promise.reject();

    const newItems = [...(ctx?.items ?? [])];
    const newIndex =
      ((to % newItems.length) + newItems.length) % newItems.length;

    newItems.splice(newIndex, 0, newItems.splice(from, 1)[0]);

    const updatePromise = ctx.onUpdate(newItems);
    console.debug("updatePromise", updatePromise);
    updatePromise.then(() => {
      if (announce) {
        announce(
          intl.formatMessage(formMessages.repeaterAnnounceMove, {
            // zero-based index to position
            from: from + 1,
            to: to + 1,
          }),
        );
      }
    });
    return updatePromise;
  };

  const remove = (index: number): Promise<void> => {
    let newItems = [...(ctx?.items ?? [])];
    newItems = [...newItems.slice(0, index), ...newItems.slice(index + 1)];
    if (ctx?.onUpdate) {
      const updatePromise = ctx.onUpdate(newItems);
      updatePromise.then(() => {
        if (announce) {
          announce(
            intl.formatMessage(formMessages.repeaterAnnounceRemove, { index }),
          );
        }
      });
      return updatePromise;
    }
    return Promise.reject();
  };

  const update = (
    index: number,
    item: Partial<ItemWithId<T>>,
  ): Promise<void> => {
    let newItems = [...(ctx?.items ?? [])];
    newItems = [
      ...newItems.slice(0, index),
      {
        ...newItems[index],
        ...item,
      },
      ...newItems.slice(index + 1),
    ];
    if (ctx?.onUpdate) {
      return ctx.onUpdate(newItems);
    }
    return Promise.reject();
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
