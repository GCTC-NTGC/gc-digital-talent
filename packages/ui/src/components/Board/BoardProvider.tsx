import {
  MouseEventHandler,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";

import { BoardColumn } from "./types";

interface ControlledContext {
  id: string;
  selectedItem: number;
  selectedColumn: number;
  onItemChange?: (newItem: number) => void;
  onColumnChange?: (newColumn: number) => void;
  columns: BoardColumn[];
}

interface ContextEvents {
  handleClickItem: MouseEventHandler;
}

type BoardContextValue = ControlledContext & ContextEvents;

const BoardContext = createContext<BoardContextValue | undefined>(undefined);

type BoardProviderProps = {
  children: ReactNode;
} & ControlledContext;

export const BoardProvider = ({ children, ...context }: BoardProviderProps) => {
  const {
    id,
    selectedItem,
    selectedColumn,
    onItemChange,
    onColumnChange,
    columns,
  } = context;

  const selectItem = useCallback(
    (newItem: number, newColumn: number) => {
      const targetColumn = columns[newColumn];
      const { items } = targetColumn;
      const targetItem = items[newItem];

      if (newColumn) {
        onColumnChange?.(newColumn);
      }

      if (targetItem) {
        onItemChange?.(newItem);
        targetItem.focus();
      }
    },
    [columns, onColumnChange, onItemChange],
  );

  const handleClickItem: MouseEventHandler = useCallback(
    (event) => {
      const target = event.currentTarget as HTMLElement;

      columns.every((column, colIndex) => {
        const newItem = column.items.findIndex((item) => {
          return item.id === target.id;
        });

        if (newItem >= 0) {
          selectItem(newItem, colIndex);
          return false;
        }

        return true;
      });
    },
    [columns, selectItem],
  );

  const value = useMemo(
    () => ({
      id,
      selectedItem,
      selectedColumn,
      onItemChange,
      onColumnChange,
      columns,
      handleClickItem,
    }),
    [
      id,
      selectedItem,
      selectedColumn,
      onItemChange,
      onColumnChange,
      columns,
      handleClickItem,
    ],
  );

  return (
    <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
  );
};

export const useBoardContext = () => {
  const context = useContext(BoardContext);

  return context;
};
