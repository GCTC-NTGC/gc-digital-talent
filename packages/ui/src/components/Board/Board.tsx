/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import ChevronRightIcon from "@heroicons/react/24/solid/ChevronRightIcon";
import {
  HTMLProps,
  forwardRef,
  useId,
  useRef,
  useState,
  useEffect,
  ReactNode,
  KeyboardEventHandler,
  FocusEventHandler,
} from "react";

import { notEmpty } from "@gc-digital-talent/helpers";

import Collapsible from "../Collapsible";
import Counter from "../Button/Counter";
import useControllableState from "../../hooks/useControllableState";
import { BoardProvider, useBoardContext } from "./BoardProvider";
import { findColumns } from "./utils";
import { BoardColumn } from "./types";
import { ARROW_KEY, isArrowKey } from "../../utils/keyboard";

type RootProps = HTMLProps<HTMLDivElement> & {
  defaultItem?: number;
  item?: number;
  onItemChange?: (newItem: number) => void;
  defaultColumn?: number;
  column?: number;
  onColumnChange?: (newColumn: number) => void;
};

const Root = forwardRef<HTMLDivElement, RootProps>(
  (
    {
      children,
      defaultItem,
      item: itemProp,
      onItemChange,
      defaultColumn,
      column: colProp,
      onColumnChange,
      ...rest
    },
    forwardedRef,
  ) => {
    const id = useId();
    const rootId = `board-${id}`;
    const rootRef = useRef<HTMLDivElement>(null);
    const [columns, setColumns] = useState<BoardColumn[]>([]);
    const [columnIndex = 0, setColumnIndex] = useControllableState<number>({
      controlledProp: colProp,
      defaultValue: defaultColumn,
      onChange: onColumnChange,
    });
    const [itemIndex = 0, setItemIndex] = useControllableState<number>({
      controlledProp: itemProp,
      defaultValue: defaultItem,
      onChange: onItemChange,
    });

    useEffect(() => {
      setColumns(findColumns(rootRef.current));
    }, []);

    /**
     * "Select" an item, focusing it and setting
     * column and item index
     *
     * @param {number} newItem - The new item index
     * @param {number} newColumn - The new column index
     * @param {boolean} preventFocus - If true, select the item but do not focus it
     */
    const selectItem = (
      newItem: number,
      newColumn?: number,
      preventFocus?: boolean,
    ) => {
      const targetColumnIndex = newColumn ?? columnIndex;
      const targetColumn = columns[targetColumnIndex];
      const { items } = targetColumn;
      const targetItem = items[newItem];

      if (targetItem) {
        setColumnIndex(targetColumnIndex);
        setItemIndex(newItem);
        if (!preventFocus) {
          targetItem.focus();
        }
      }
    };

    /**
     * Increment item
     *
     * Increase the item index by 1,
     * if it exists in the current column
     */
    const incrementItem = () => {
      const { items } = columns[columnIndex];
      let targetItem = itemIndex + 1;
      const lastIndex = items.length - 1;
      if (targetItem > lastIndex) targetItem = lastIndex;

      selectItem(targetItem);
    };

    /**
     * Decrement item
     *
     * Decrease the item index by 1,
     * if it exists in the current column
     */
    const decrementItem = () => {
      let targetIndex = itemIndex - 1;
      if (targetIndex < 0) targetIndex = 0;

      selectItem(targetIndex);
    };

    /**
     * Increment column
     *
     * Increase the column index by 1,
     * if it exists in the current column
     */
    const incrementColumn = () => {
      let targetIndex = columnIndex + 1;
      const lastIndex = columns.length - 1;
      // Persist current index, selecting last item if column length less than index
      if (targetIndex > lastIndex) targetIndex = lastIndex;
      const lastItemIndex = columns[targetIndex].items.length - 1;

      selectItem(
        lastItemIndex < itemIndex ? lastItemIndex : itemIndex,
        targetIndex,
      );
    };

    /**
     * Decrement column
     *
     * Decrease the column index by 1,
     * if it exists in the current column
     */
    const decrementColumn = () => {
      let targetColumn = columnIndex - 1;
      if (targetColumn < 0) targetColumn = 0;
      // Persist current index, selecting last item if column length less than index
      const lastItemIndex = columns[targetColumn].items.length - 1;
      const targetItem = lastItemIndex < itemIndex ? lastItemIndex : itemIndex;

      selectItem(targetItem, targetColumn);
    };

    const handleKeyDown: KeyboardEventHandler = (event) => {
      if (isArrowKey(event.key)) {
        switch (event.key) {
          case ARROW_KEY.DOWN:
            incrementItem();
            break;
          case ARROW_KEY.UP:
            decrementItem();
            break;
          case ARROW_KEY.LEFT:
            decrementColumn();
            break;
          case ARROW_KEY.RIGHT:
            incrementColumn();
            break;
          default:
          // Not an arrow key
        }
        event.preventDefault();
        event.stopPropagation();
      }
    };

    /**
     * Handle
     *
     * Update the internal state when the user
     * changes the focus manually
     */
    const handleFocus: FocusEventHandler = (event) => {
      const target = event.target as HTMLElement;
      let targetItem: HTMLElement | null | undefined = target
        .closest<HTMLElement>(".Board__Column")
        ?.querySelector<HTMLElement>(".Board__Item");
      if (target.classList.contains("Board__List")) {
        // If it is a list, get the first item
        targetItem = target.querySelector<HTMLElement>(".Board__Item");
      } else if (target.classList.contains("Board__Item")) {
        // If we focused an item, do nothing
        targetItem = null;
      }

      if (notEmpty(targetItem)) {
        columns.every((column, colIndex) => {
          let continueSearch = true;
          column.items.every((item, index) => {
            if (notEmpty(targetItem) && item.isSameNode(targetItem)) {
              selectItem(index, colIndex, true);
              continueSearch = false;
            }
            return true;
          });

          return continueSearch;
        });
      }
    };

    return (
      <BoardProvider
        id={id}
        selectedColumn={columnIndex}
        selectedItem={itemIndex}
        onColumnChange={setColumnIndex}
        onItemChange={setItemIndex}
        columns={columns}
      >
        <div
          ref={forwardedRef}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          className="relative w-full rounded bg-gray-100 dark:bg-gray-700"
          {...rest}
        >
          <div
            id={rootId}
            ref={rootRef}
            className="relative z-10 flex items-start justify-start gap-x-3 overflow-x-scroll p-6"
          >
            {children}
          </div>
          <div className="pointer-events-none absolute inset-0 z-20 rounded inset-shadow" />
        </div>
      </BoardProvider>
    );
  },
);

const Column = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
  ({ children, ...rest }, forwardedRef) => {
    return (
      <div
        ref={forwardedRef}
        className="Board__Column flex max-h-[calc(90vh-var(--spacing)*12)] min-h-72 w-full shrink-0 flex-col rounded bg-white shadow-lg xs:w-84 dark:bg-gray-600"
        {...rest}
      >
        {children}
      </div>
    );
  },
);

type ColumnHeaderProps = HTMLProps<HTMLDivElement> & {
  prefix?: string;
};

const ColumnHeader = forwardRef<HTMLDivElement, ColumnHeaderProps>(
  ({ prefix, children, ...rest }, forwardedRef) => {
    return (
      <div
        ref={forwardedRef}
        className="Board__ColumnHeader flex flex-col gap-x-3 border-b border-b-gray-100 p-3 dark:border-b-gray-600"
        {...rest}
      >
        {prefix && (
          <span className="text-sm text-gray-500 dark:text-gray-200">
            {prefix}
          </span>
        )}
        <span className="text-lg/[1.1] font-bold lg:text-xl/[1.1]">
          {children}
        </span>
      </div>
    );
  },
);

interface InfoProps {
  title: string;
  counter?: number;
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (newOpen: boolean) => void;
}

const Info = ({
  title,
  counter,
  children,
  defaultOpen = true,
  onOpenChange,
  open,
}: InfoProps) => {
  const [isOpen, setIsOpen] = useControllableState<boolean>({
    controlledProp: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  return (
    <Collapsible.Root
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full border-b border-b-gray-100 dark:border-b-gray-600"
    >
      <Collapsible.Trigger className="group/trigger flex w-full items-center justify-between gap-x-1.5 bg-transparent px-2 py-3">
        <span className="flex items-center gap-x-3">
          <ChevronRightIcon className="ease size-4 rotate-0 transform text-gray-700 underline transition-transform duration-150 group-hover/trigger:text-primary-600 group-focus-visible/trigger:text-black group-data-[state=open]/trigger:rotate-90 dark:text-gray-100 dark:group-hover/trigger:text-primary-200" />
          <span className="text-primary-600 underline group-hover/trigger:no-underline dark:text-primary-200">
            {title}
          </span>
        </span>
        {counter && counter >= 0 ? (
          <Counter
            count={counter}
            className="rounded-full bg-gray-100 px-2 py-1 text-black dark:bg-gray-700 dark:text-white"
          />
        ) : null}
      </Collapsible.Trigger>
      <Collapsible.Content className="bg-gray-100/20 p-3 inset-shadow dark:bg-gray-700/20">
        {children}
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

const List = forwardRef<HTMLUListElement, HTMLProps<HTMLUListElement>>(
  ({ children, ...rest }, forwardedRef) => {
    return (
      <ul
        ref={forwardedRef}
        // Note: Scrollable regions should be tabbable
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        className="Board__List m-0 flex shrink grow list-none flex-col overflow-y-scroll px-3 focus-visible:outline-offset-2 focus-visible:outline-secondary/30 [li]:not-last:border-b [li]:not-last:border-b-gray-100"
        {...rest}
      >
        {children}
      </ul>
    );
  },
);

const ListItem = forwardRef<HTMLLIElement, HTMLProps<HTMLLIElement>>(
  ({ children, ...rest }, forwardedRef) => {
    const ctx = useBoardContext();

    return (
      <li
        ref={forwardedRef}
        className="Board__Item group/item py-3 outline-none not-last:border-b not-last:border-b-gray-100 dark:not-last:border-b-gray-500"
        tabIndex={-1}
        onClick={ctx?.handleClickItem}
        {...rest}
      >
        <div className="Board__Item__Wrapper rounded p-1 group-focus-visible/item:bg-secondary/30">
          {children}
        </div>
      </li>
    );
  },
);

export default {
  Root,
  Column,
  ColumnHeader,
  Info,
  List,
  ListItem,
};
