import { useIntl } from "react-intl";
import type { Column } from "@tanstack/react-table";
import ArrowDownIcon from "@heroicons/react/20/solid/ArrowDownIcon";
import ArrowUpIcon from "@heroicons/react/20/solid/ArrowUpIcon";
import ArrowsUpDownIcon from "@heroicons/react/20/solid/ArrowsUpDownIcon";
import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon";
import { ReactNode, useId } from "react";
import { tv } from "tailwind-variants";

import { Button } from "@gc-digital-talent/ui";

const sortBtn = tv({
  base: "text-left",
  variants: {
    sortDirection: {
      true: "font-bold",
      false: "font-normal",
    },
  },
});

interface SortButtonProps<T> {
  column: Column<T, unknown>;
  children: ReactNode;
  locked?: boolean;
  tableId: string;
}

const SortButton = <T,>({
  column,
  locked,
  tableId,
  children,
}: SortButtonProps<T>) => {
  const intl = useIntl();
  const id = useId();
  const ariaId = `${column.id}-${id}`;

  if (!column.getCanSort()) {
    return <>{children}</>;
  }

  const sortDirection = column.getIsSorted();
  let icon = ArrowsUpDownIcon;
  if (sortDirection) {
    icon = sortDirection === "asc" ? ArrowUpIcon : ArrowDownIcon;
  }

  return (
    <Button
      id={ariaId}
      aria-labelledby={`${ariaId} sortHint-${tableId}`}
      mode="inline"
      color="white"
      size="sm"
      fixedColor
      onClick={column.getToggleSortingHandler()}
      noUnderline={!!sortDirection}
      className={sortBtn({ sortDirection: !!sortDirection })}
      disabled={locked}
      icon={locked ? LockClosedIcon : icon}
    >
      {sortDirection && (
        <span className="sr-only">
          {sortDirection === "asc"
            ? intl.formatMessage({
                defaultMessage: "Ascending",
                id: "RGHXLW",
                description:
                  "Message added to indicate a table column is sorted in ascending order",
              })
            : intl.formatMessage({
                defaultMessage: "Descending",
                id: "zIv0jm",
                description:
                  "Message added to indicate a table column is sorted in descending order",
              })}
        </span>
      )}
      {children}
    </Button>
  );
};

export default SortButton;
