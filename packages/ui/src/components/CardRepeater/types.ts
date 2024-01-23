// This is just a default value
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BaseItem = Record<string, any>;

export type ItemWithId<T> = T & { id: string };

export type CardRepeaterContextProps<T extends BaseItem = BaseItem> = {
  id?: string;
  defaultItems?: ItemWithId<T>[];
  items: ItemWithId<T>[];
  disabled?: boolean;
  moveDisabledIndexes: number[];
  editDisabledIndexes: number[];
  removeDisabledIndexes: number[];
  max?: number;
  hideIndex?: boolean;
  onUpdate?: (newItems: ItemWithId<T>[]) => void;
  messages?: {
    approachingLimit?: React.ReactNode;
    error?: React.ReactNode;
    null?: React.ReactNode;
    max?: React.ReactNode;
    addButton?: React.ReactNode;
  };
};
