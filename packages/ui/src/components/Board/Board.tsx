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
          data-h2-position="base(relative)"
          data-h2-radius="base(s)"
          data-h2-background="base(background)"
          data-h2-width="base(100%)"
          {...rest}
        >
          <div
            id={rootId}
            ref={rootRef}
            data-h2-align-items="base(flex-start)"
            data-h2-display="base(flex)"
            data-h2-gap="base(0 x.5)"
            data-h2-justify-content="base(flex-start)"
            data-h2-overflow-x="base(scroll)"
            data-h2-padding="base(x1)"
            data-h2-position="base(relative)"
            data-h2-z-index="base(1)"
          >
            {children}
          </div>
          <div
            data-h2-position="base(absolute)"
            data-h2-pointer-events="base(none)"
            data-h2-z-index="base(2)"
            data-h2-inset="base(0)"
            data-h2-shadow="base(inside)"
            data-h2-radius="base(s)"
          />
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
        className="Board__Column"
        data-h2-background="base(foreground)"
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-radius="base(s)"
        data-h2-shadow="base(l)"
        data-h2-flex-shrink="base(0)"
        data-h2-min-height="base(x12)"
        // Quick maths to get the board to appear on any viewport height
        data-h2-max-height="base(calc(90vh - x2))"
        data-h2-width="base(100%) p-tablet(x14)"
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
        className="Board__ColumnHeader"
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(0 x.5)"
        data-h2-padding="base(x.5)"
        data-h2-border-bottom="base(thin solid black.lightest)"
        {...rest}
      >
        {prefix && (
          <span
            data-h2-font-size="base(caption)"
            data-h2-color="base(black.light)"
          >
            {prefix}
          </span>
        )}
        <span data-h2-font-size="base(h6)" data-h2-font-weight="base(700)">
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
      data-h2-width="base(100%)"
      data-h2-border-bottom="base(thin solid black.lightest)"
    >
      <Collapsible.Trigger
        data-h2-color="base:children[.Info__Trigger__Title](secondary.darker) base:hover:children[.Info__Trigger__Title](secondary.darker)"
        data-h2-text-decoration="base:children[.Info__Trigger__Title](underline) base:hover:children[.Info__Trigger__Title](none)"
        data-h2-background="base(transparent)"
        data-h2-align-items="base(center)"
        data-h2-display="base(flex)"
        data-h2-gap="base(0 x.25)"
        data-h2-width="base(100%)"
        data-h2-justify-content="base(space-between)"
        data-h2-padding="base(x.5 x.35)"
        data-h2-transform="
          base:children[.Info__Chevron](rotate(0deg))
          base:selectors[[data-state='open']]:children[.Info__Chevron](rotate(90deg))"
      >
        <span
          data-h2-display="base(flex)"
          data-h2-gap="base(0 x.25)"
          data-h2-align-items="base(center)"
        >
          <ChevronRightIcon
            className="Info__Chevron"
            data-h2-height="base(x.75)"
            data-h2-width="base(x.75)"
            data-h2-transition="base(transform 150ms ease)"
            {...getFontColor({ mode: "inline", color: "black" })}
          />
          <span className="Info__Trigger__Title">{title}</span>
        </span>
        {counter && counter >= 0 ? (
          <Counter
            count={counter}
            data-h2-color="base(black)"
            data-h2-radius="base(x.5)"
            data-h2-background="base(gray.lightest)"
            data-h2-padding="base(x.125 x.5)"
          />
        ) : null}
      </Collapsible.Trigger>
      <Collapsible.Content
        data-h2-background="base(background)"
        data-h2-padding="base(x.5)"
        data-h2-shadow="base(inside)"
      >
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
        className="Board__List"
        // Note: Scrollable regions should be tabbable
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        data-h2-outline="base:focus-visible(primary.30 solid x.125)"
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-list-style="base(none)"
        data-h2-flex-grow="base(1)"
        data-h2-flex-shrink="base(1)"
        data-h2-overflow-y="base(scroll)"
        data-h2-margin="base(0)"
        data-h2-padding="base(0 x.5)"
        data-h2-border-bottom="base:selectors[>li:not(:last-child)](thin solid black.lightest)"
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
        className="Board__Item"
        tabIndex={-1}
        onClick={ctx?.handleClickItem}
        data-h2-outline="base(none)"
        data-h2-padding="base(x.5 0)"
        data-h2-background-color="base:focus-visible:children[.Board__Item__Wrapper](primary.30)"
        {...rest}
      >
        <div
          className="Board__Item__Wrapper"
          data-h2-radius="base(s)"
          data-h2-padding="base(x.125)"
        >
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
