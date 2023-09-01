import React from "react";
import { useIntl } from "react-intl";
import { Table } from "@tanstack/react-table";
import TableCellsIcon from "@heroicons/react/20/solid/TableCellsIcon";

import { Button, Dialog } from "@gc-digital-talent/ui";
import { Field } from "@gc-digital-talent/forms";

import adminMessages from "~/messages/adminMessages";

interface ColumnDialogProps<TData> {
  /** Instance of the `react-table` */
  table: Table<TData>;
}

/**
 * Column Dialog
 *
 * Controls the display of specific columns
 *
 * @param ColumnDialogProps
 * @returns JSX.Element
 */
const ColumnDialog = <T extends object>({ table }: ColumnDialogProps<T>) => {
  const intl = useIntl();
  const allColumnsRef = React.useRef<HTMLInputElement>(null);
  const indeterminate =
    table.getIsSomeColumnsVisible() && !table.getIsAllColumnsVisible();

  React.useEffect(() => {
    if (allColumnsRef.current) {
      allColumnsRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate, allColumnsRef]);

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
          <Field.Fieldset>
            <Field.Legend>
              {intl.formatMessage(adminMessages.showHideTableColumns)}
            </Field.Legend>
            <Field.BoundingBox>
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
            </Field.BoundingBox>
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
