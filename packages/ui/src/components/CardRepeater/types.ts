// This is just a default value
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BaseItem = Record<string, any>;

export type ItemWithId<T> = T & { id: string };

export interface CardRepeaterContextProps<T extends BaseItem = BaseItem> {
  id?: string;
  defaultItems?: ItemWithId<T>[];
  items: ItemWithId<T>[];
  disabled?: boolean;
  moveDisabledIndexes?: number[];
  editDisabledIndexes?: number[];
  removeDisabledIndexes?: number[];
  max?: number;
  hideIndex?: boolean;
  onUpdate?: (newItems: ItemWithId<T>[]) => void;
  onItemsMoved?: (newItems: ItemWithId<T>[]) => void;
}
