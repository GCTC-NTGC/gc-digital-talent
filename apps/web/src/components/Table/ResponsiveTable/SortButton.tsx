import React from "react";
import { useIntl } from "react-intl";
import type { Column } from "@tanstack/react-table";
import ArrowDownIcon from "@heroicons/react/20/solid/ArrowDownIcon";
import ArrowUpIcon from "@heroicons/react/20/solid/ArrowUpIcon";
import ArrowsUpDownIcon from "@heroicons/react/20/solid/ArrowsUpDownIcon";

import { Button } from "@gc-digital-talent/ui";

type SortButtonProps<T> = {
  column: Column<T, unknown>;
  children: React.ReactNode;
};

const SortButton = <T,>({ column, children }: SortButtonProps<T>) => {
  const intl = useIntl();

  if (!column.getCanSort()) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }

  const sortDirection = column.getIsSorted();

  return (
    <Button
      mode="inline"
      color="white"
      onClick={column.getToggleSortingHandler()}
      data-h2-font-size="base(caption)"
      {...(sortDirection
        ? {
            utilityIcon: sortDirection === "asc" ? ArrowUpIcon : ArrowDownIcon,
          }
        : {
            utilityIcon: ArrowsUpDownIcon,
          })}
    >
      {children}
      {sortDirection && (
        <span data-h2-visually-hidden="base(invisible)">
          {sortDirection === "asc"
            ? intl.formatMessage({
                defaultMessage: " (Ascending)",
                id: "90E1fF",
                description:
                  "Message added to indicate a table column is sorted in ascending order",
              })
            : intl.formatMessage({
                defaultMessage: " (Descending)",
                id: "uKD+km",
                description:
                  "Message added to indicate a table column is sorted in descending order",
              })}
        </span>
      )}
    </Button>
  );
};

export default SortButton;
