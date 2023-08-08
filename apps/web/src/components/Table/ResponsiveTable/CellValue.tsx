import React from "react";
import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";

type CellLabelProps = React.HTMLAttributes<HTMLSpanElement>;

/**
 * Cell Label
 *
 * Used as the small screen, inline label for cells
 */
const CellLabel = ({ children, ...rest }: CellLabelProps) => (
  <span
    data-h2-display="base(block) l-tablet(none)"
    data-h2-font-weight="base(700)"
    data-h2-word-break="base(break-word)"
    {...rest}
  >
    {children}
  </span>
);

interface CellValueProps {
  children: React.ReactNode;
  // Label for the cell, should match `th`
  header?: React.ReactNode;
  // Mark this as the cell header (should be first item that is not row selection)
  isRowTitle?: boolean;
}

/**
 * Cell Value
 *
 * Renders the cell value and optionally the header for mobile screens
 *
 * Note: This should be used in conjunction with
 * the cell attribute when defining columns in react-table
 */
const CellValue = ({ children, header, isRowTitle }: CellValueProps) => {
  const intl = useIntl();
  const showHeader = header && !isRowTitle;
  return (
    <>
      {showHeader && (
        <CellLabel>
          {header}
          {intl.formatMessage(commonMessages.dividingColon)}
        </CellLabel>
      )}
      <span
        data-h2-display="base(inline-block)"
        data-h2-word-break="base(break-word)"
        data-h2-max-width="base(100%)"
        {...(isRowTitle && {
          "data-h2-font-size": "base(h6) l-tablet(inherit)",
          "data-h2-font-weight": "base(800) l-tablet(inherit)",
          "data-h2-color": "base(secondary.darker) l-tablet(inherit)",
        })}
      >
        {children}
      </span>
    </>
  );
};

export default CellValue;
