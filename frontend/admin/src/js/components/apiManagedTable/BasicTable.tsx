import { Button } from "@common/components";
import React, { ReactElement } from "react";
import { useIntl } from "react-intl";
import SortIcon from "../Table/SortIcon";
import {
  Column,
  ColumnsOf,
  IdType,
  RecordWithId,
  SortingRule,
} from "./basicTableHelpers";

export interface BasicTableProps<T extends RecordWithId = RecordWithId> {
  columns: ColumnsOf<T>;
  data: Array<T>;
  labelledBy?: string;
  onSortingRuleChange: (newSortingRule?: SortingRule<T>) => void;
  sortingRule?: SortingRule<T>;
  hiddenColumnIds: Array<IdType<T>>;
}

function BasicTable<T extends RecordWithId>({
  columns,
  data,
  labelledBy,
  onSortingRuleChange,
  sortingRule,
  hiddenColumnIds,
}: BasicTableProps<T>): ReactElement {
  const intl = useIntl();

  // calculate a new sortingRule and emit it to parent
  const handleColumnSelect = (column: Column<T>): void => {
    // some columns are not sortable
    if (!column.sortColumnName) {
      return;
    }
    // no current sorting, sort by this column
    if (!sortingRule) {
      onSortingRuleChange({ column, desc: false });
      return;
    }
    // current sort is not by this column, sort by this column
    if (sortingRule.column.id !== column.id) {
      onSortingRuleChange({ column, desc: false });
      return;
    }
    // current sort is this column, advance the order
    if (sortingRule.column.id === column.id) {
      if (sortingRule.desc === undefined || sortingRule.desc === false) {
        onSortingRuleChange({ column, desc: true });
        return;
      }
      if (sortingRule.desc === true) {
        onSortingRuleChange(undefined);
        // return;
      }
    }
  };

  // add props for table header based on sortingRule
  const calculateTableHeaderProps = (
    column: Column<T>,
  ): Record<string, unknown> => {
    if (sortingRule?.column.id === column.id) {
      return {
        "aria-sort": sortingRule?.desc === true ? "descending" : "ascending",
      };
    }

    return {};
  };

  return (
    <div
      data-h2-radius="base(s, s, 0px, 0px)"
      data-h2-border="base(right-left, 1px, solid, dt-secondary)"
      data-h2-overflow="base(auto, all)"
      data-h2-max-width="base(100%)"
    >
      <table aria-labelledby={labelledBy} data-h2-width="base(100%)">
        <thead>
          <tr>
            {columns
              .filter((column) => !hiddenColumnIds.includes(column.id))
              .map((column) => {
                const label = column.header ? column.header : column.label;
                return (
                  <th
                    key={column.id}
                    data-h2-background-color="base(dt-secondary.light)"
                    data-h2-padding="base(x.5, x1)"
                    role="columnheader"
                    {...calculateTableHeaderProps(column)}
                  >
                    {column.sortColumnName ? (
                      <Button
                        data-h2-display="base(flex)"
                        data-h2-align-items="base(center)"
                        type="button"
                        mode="tableHeader"
                        color="secondary"
                        disabled={
                          !column.sortColumnName && column.id !== "selection"
                        }
                        title={intl.formatMessage({
                          defaultMessage: "Toggle SortBy",
                          id: "6InelL",
                          description:
                            "Title to toggle sorting order of a table",
                        })}
                        onClick={() => handleColumnSelect(column)}
                      >
                        {label}
                        {sortingRule?.column.id === column.id && (
                          <SortIcon isSortedDesc={sortingRule.desc} />
                        )}
                      </Button>
                    ) : (
                      <span
                        data-h2-display="base(block)"
                        data-h2-color="base(dt-white)"
                        data-h2-font-weight="base(700)"
                        data-h2-text-align="base(left)"
                      >
                        {label}
                      </span>
                    )}
                  </th>
                );
              })}
          </tr>
        </thead>
        <tbody>
          {data.map((datum) => {
            return (
              <tr key={JSON.stringify(datum) /* 🤷 */}>
                {columns
                  .filter((column) => !hiddenColumnIds.includes(column.id))
                  .map((column) => {
                    return (
                      <td
                        key={column.id}
                        data-h2-padding="base(x.5, x1)"
                        data-h2-text-align="base(left)"
                      >
                        {column.accessor(datum)}
                      </td>
                    );
                  })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default BasicTable;
