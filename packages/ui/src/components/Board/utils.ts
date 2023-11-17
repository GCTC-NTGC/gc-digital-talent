import { arrowKeys, ArrowKey } from "./constants";
import { BoardColumn } from "./types";

export function isArrowKey(k: React.KeyboardEvent["key"]): k is ArrowKey {
  return arrowKeys.includes(k as ArrowKey);
}

export function incrementItem(
  currentIndex: number,
  totalItems: number,
): number {
  const newIndex = currentIndex + 1;

  return newIndex > totalItems ? totalItems : newIndex;
}

export function decrementItem(currentIndex: number): number {
  const newIndex = currentIndex - 1;

  return newIndex < 0 ? 0 : newIndex;
}

export function findColumns(rootEl: HTMLDivElement | null): BoardColumn[] {
  const colDiv = rootEl?.querySelectorAll<HTMLDivElement>(".Board__Column");
  let cols: BoardColumn[] = [];

  colDiv?.forEach((colEl: HTMLDivElement, colIndex) => {
    const column = colEl;
    const itemNodes = column.querySelectorAll<HTMLLIElement>(".Board__Item");
    const items = Array.from(itemNodes);

    // Note: Added IDs for a11y
    const header = column.querySelector<HTMLElement>(".Board__ColumnHeader");
    const list = column.querySelector<HTMLElement>(".Board__List");
    if (header) {
      const headerId = `${rootEl?.id}-${colIndex}-header`;
      header.id = headerId;
      if (list) {
        list.setAttribute("aria-labelledby", headerId);
      }
    }

    items.forEach((itemEl, index) => {
      const item = itemEl;
      item.id = `${rootEl?.id}-${colIndex}-${index}-item`;
    });

    cols = [
      ...cols,
      {
        element: column,
        items,
      },
    ];
  });

  return cols;
}
