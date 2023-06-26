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
    {...rest}
  >
    {children}
  </span>
);

interface CellValueProps {
  children: React.ReactNode;
  header?: React.ReactNode;
}

/**
 * Cell Value
 *
 * Renders the cell value and optionally the header for mobile screens
 *
 * Note: This should be used in conjunction with
 * the cell attribute when defining columns in react-table
 */
export const CellValue = ({ children, header }: CellValueProps) => {
  const intl = useIntl();
  return (
    <>
      {header && (
        <CellLabel>
          {header}
          {intl.formatMessage(commonMessages.dividingColon)}
        </CellLabel>
      )}
      <span>{children}</span>
    </>
  );
};

export default CellValue;
