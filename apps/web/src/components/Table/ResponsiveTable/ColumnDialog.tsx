import React from "react";
import { useIntl } from "react-intl";
import isEqual from "lodash/isEqual";
import { useSearchParams } from "react-router-dom";
import { Table } from "@tanstack/react-table";
import TableCellsIcon from "@heroicons/react/20/solid/TableCellsIcon";

import { Button, Dialog } from "@gc-digital-talent/ui";
import { Field } from "@gc-digital-talent/forms";
import { notEmpty } from "@gc-digital-talent/helpers";

import adminMessages from "~/messages/adminMessages";

import { SEARCH_PARAM_KEY } from "./constants";

interface ColumnDialogProps<TData> {
  /** Instance of the `react-table` */
  table: Table<TData>;
  initialState?: string[];
}

/**
 * Column Dialog
 *
 * Controls the display of specific columns
 *
 * @param ColumnDialogProps
 * @returns JSX.Element
 */
const ColumnDialog = <T extends object>({
  table,
  initialState = [],
}: ColumnDialogProps<T>) => {
  const intl = useIntl();
  const [, setSearchParams] = useSearchParams();
  const allColumnsRef = React.useRef<HTMLInputElement>(null);
  const indeterminate =
    table.getIsSomeColumnsVisible() && !table.getIsAllColumnsVisible();
  const { columnVisibility } = table.getState();

  React.useEffect(() => {
    if (allColumnsRef.current) {
      allColumnsRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate, allColumnsRef]);

  React.useEffect(() => {
    const newHiddenIds = Object.keys(columnVisibility)
      .map((id) => (columnVisibility[id] ? undefined : id))
      .filter(notEmpty);

    setSearchParams((previous) => {
      const newParams = new URLSearchParams(previous);

      if (isEqual(initialState, newHiddenIds)) {
        newParams.delete(SEARCH_PARAM_KEY.HIDDEN_COLUMNS);
      } else {
        newParams.set(SEARCH_PARAM_KEY.HIDDEN_COLUMNS, newHiddenIds.join(","));
      }

      return newParams;
    });
  }, [columnVisibility, initialState, setSearchParams]);

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button icon={TableCellsIcon} color="quaternary" type="button" block>
          {intl.formatMessage(adminMessages.showHideColumns)}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage(adminMessages.showHideColumns)}
        </Dialog.Header>
        <Dialog.Body>
          <Field.Fieldset boundingBox>
            <Field.Legend>
              {intl.formatMessage(adminMessages.showHideTableColumns)}
            </Field.Legend>
            <div data-h2-margin="base(x.125, 0)">
              <label>
                <input
                  ref={allColumnsRef}
                  {...{
                    type: "checkbox",
                    checked: table.getIsAllColumnsVisible(),
                    onChange: table.getToggleAllColumnsVisibilityHandler(),
                  }}
                />{" "}
                {intl.formatMessage(adminMessages.toggleAll)}
              </label>
            </div>
            {table
              .getAllLeafColumns()
              .filter((c) => c.getCanHide())
              .map((column) => (
                <div key={column.id} data-h2-margin="base(x.125, 0)">
                  <label>
                    <input
                      {...{
                        type: "checkbox",
                        checked: column.getIsVisible(),
                        onChange: column.getToggleVisibilityHandler(),
                      }}
                    />{" "}
                    {column.columnDef.header?.toString() || ""}
                  </label>
                </div>
              ))}
          </Field.Fieldset>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ColumnDialog;
