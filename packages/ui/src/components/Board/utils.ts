import { BoardColumn } from "./types";

/**
 * Find columns
 *
 * Traverse the board DOM, finding all the columns and their items
 * for internal focus tracking
 *
 * Also, assigns a11y attributes to each column/item
 *
 * @param rootEl
 * @returns
 */
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
