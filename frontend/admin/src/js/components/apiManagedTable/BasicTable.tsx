import React, { ReactElement } from "react";
import { useIntl } from "react-intl";
import SortIcon from "../Table/SortIcon";
import { Column, ColumnsOf, IdType, SortingRule } from "./basicTableHelpers";

export interface BasicTableProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  columns: ColumnsOf<T>;
  data: Array<T>;
  labelledBy?: string;
  onSortingRuleChange: (newSortingRule?: SortingRule<T>) => void;
  sortingRule?: SortingRule<T>;
  hiddenColumnIds: Array<IdType<T>>;
}

function BasicTable<T extends Record<string, unknown>>({
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

  // add props for making column headers clickable if there is a sortColumnName
  const calculateSortProps = (column: Column<T>): Record<string, unknown> => {
    if (column.sortColumnName) {
      return {
        title: intl.formatMessage({
          defaultMessage: "Toggle SortBy",
          description: "Title to toggle sorting order of a table",
        }),
        style: { cursor: "pointer" },
        onClick: () => handleColumnSelect(column),
      };
    }

    return {};
  };

  return (
    <div
      data-h2-overflow="b(all, auto)"
      style={{ maxWidth: "100%" }}
      data-h2-shadow="b(s)"
    >
      <table aria-labelledby={labelledBy} data-h2-width="b(100)">
        <thead>
          <tr>
            {columns
              .filter((column) => !hiddenColumnIds.includes(column.id))
              .map((column) => (
                <th
                  key={column.id}
                  data-h2-bg-color="b(lightnavy)"
                  data-h2-font-color="b(white)"
                  data-h2-font-weight="b(800)"
                  data-h2-padding="b(right-left, m) b(top-bottom, s)"
                  data-h2-text-align="b(left)"
                  data-h2-font-size="b(caption)"
                  role="columnheader"
                  {...calculateSortProps(column)}
                >
                  <span
                    data-h2-display="b(flex)"
                    data-h2-align-items="b(center)"
                  >
                    {column.label}
                    {sortingRule?.column.id === column.id && (
                      <SortIcon isSortedDesc={sortingRule.desc} />
                    )}
                  </span>
                </th>
              ))}
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
                        data-h2-padding="b(all, s)"
                        data-h2-text-align="b(left)"
                        data-h2-font-size="b(caption)"
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
