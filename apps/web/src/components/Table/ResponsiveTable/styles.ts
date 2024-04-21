import { cn } from "@gc-digital-talent/ui";

type GetCellStyleArgs = {
  /** Determine if this cell acts as the "title" for the row */
  isRowTitle?: boolean;
  /** Determine if this cell is the selection cell  */
  isRowSelect?: boolean;
  /** Determine if this cell should shrink below the min width of x8  */
  shouldShrink?: boolean;
};

type CellStyles = {
  /** Styles for the actual `td` element */
  td: string;
  /** Styles for the inner span (mobile layout) */
  value: Record<string, string>;
};

type GetCellStyles = (args: GetCellStyleArgs) => CellStyles;

/**
 * Get cell styles
 *
 * Creates the style attributes for cells changing for
 * row titles (mobile) and row selection columns
 */
export const getCellStyles: GetCellStyles = ({
  isRowTitle,
  isRowSelect,
  shouldShrink,
}) => {
  const shrinkCol = shouldShrink || isRowSelect;

  return {
    td: cn({
      "block md:table-cell order-3 w-full md:w-auto":
        !isRowSelect && !isRowTitle,
      "shrink-0 md:w-auto": shrinkCol,
      "order-2": isRowSelect,
      "order-1 flex-grow": isRowTitle,
    }),
    value: {
      className: cn("inline", {
        "font-bold md:font-normal": isRowTitle,
      }),
      ...(isRowTitle && {
        "data-h2-font-size": "base(h6) l-tablet(inherit)",
        "data-h2-color": "base(secondary.darker) l-tablet(inherit)",
      }),
    },
  };
};

const row = cn(
  "py-4.5 px-6 md:py-0 md:px-3 *:py-1.5 *:md:p-3 first:md:p-3 first:md:pl-6 last:md:p-3 last:md:pr-6",
);

const cell = cn("text-left");

export default {
  cell,
  row,
};
