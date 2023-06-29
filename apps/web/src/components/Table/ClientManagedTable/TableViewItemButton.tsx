import React, { AriaAttributes, HTMLAttributes } from "react";
import { useIntl } from "react-intl";

import { Link, LinkProps } from "@gc-digital-talent/ui";

export interface TableViewItemButtonProps extends LinkProps {
  /** The destination url. */
  viewUrl: string;
  /** Name of the type of object */
  name: string;
  /** Label for link text  */
  hiddenLabel?: string;
}

function TableViewItemButton({
  viewUrl,
  name,
  hiddenLabel,
  ...rest
}: TableViewItemButtonProps): React.ReactElement {
  const intl = useIntl();
  return (
    <Link href={viewUrl} {...rest}>
      {intl.formatMessage(
        {
          defaultMessage: "View {name} <hidden>{hiddenLabel}</hidden>",
          id: "+wG2Ap",
          description: "Title displayed for the View Item column.",
        },
        { name, hiddenLabel },
      )}
    </Link>
  );
}

export default TableViewItemButton;

export function tableViewItemButtonAccessor(
  viewUrl: string,
  name: string,
  hiddenLabel?: string,
  ariaLabel?: AriaAttributes["aria-label"],
) {
  return (
    <TableViewItemButton
      aria-label={ariaLabel}
      viewUrl={viewUrl}
      name={name}
      hiddenLabel={hiddenLabel}
    />
  );
}
