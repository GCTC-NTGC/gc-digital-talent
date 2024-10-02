interface GetCellStyleArgs {
  /** Determine if this cell acts as the "title" for the row */
  isRowTitle?: boolean;
  /** Determine if this cell is the selection cell  */
  isRowSelect?: boolean;
  /** Determine if this cell should shrink below the min width of x8  */
  shouldShrink?: boolean;
}

interface CellStyles {
  /** Styles for the actual `td` element */
  td: Record<string, string>;
  /** Styles for the inner span (mobile layout) */
  value: Record<string, string>;
}

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
  const shrinkCol = shouldShrink ?? isRowSelect;
  return {
    td: {
      ...(!isRowTitle &&
        !isRowSelect && {
          // Not a title or selection
          "data-h2-display": "base(block) l-tablet(table-cell)",
          "data-h2-order": "base(3)",
          "data-h2-width": "base(100%) l-tablet(auto)",
        }),

      ...(shrinkCol && {
        "data-h2-flex-shrink": "base(0)",
        "data-h2-width": "l-tablet(auto)",
      }),

      // Custom styles for row selection cell
      ...(isRowSelect && {
        "data-h2-order": "base(2)",
      }),

      // Custom styles for the row title
      ...(isRowTitle && {
        "data-h2-order": "base(1)",
        "data-h2-flex-grow": "base(1)",
      }),
    },
    value: {
      "data-h2-display": "base(inline)",
      ...(isRowTitle && {
        "data-h2-font-size": "base(h6) l-tablet(inherit)",
        "data-h2-font-weight": "base(700) l-tablet(inherit)",
        "data-h2-color": "base(secondary.darker) l-tablet(inherit)",
      }),
    },
  };
};

const row = {
  "data-h2-padding": `
    base(x.75, x1) l-tablet(0 x.5)
    base:selectors[>*](x.25 0)
    l-tablet:selectors[>*](x.5)
    l-tablet:selectors[>*:first-child](x.5 x.5 x.5 x1)
    l-tablet:selectors[>*:last-child](x.5 x1 x.5 x.5)
  `,
};

const cell = {
  "data-h2-text-align": "base(left)",
};

export default {
  cell,
  row,
};
