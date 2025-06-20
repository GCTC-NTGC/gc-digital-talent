import { useRef, useEffect } from "react";
import { useIntl } from "react-intl";
import { Table } from "@tanstack/react-table";
import TableCellsIcon from "@heroicons/react/20/solid/TableCellsIcon";

import { Button, Dialog } from "@gc-digital-talent/ui";
import { Field } from "@gc-digital-talent/forms";

import adminMessages from "~/messages/adminMessages";

import { getColumnHeader } from "./utils";

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
 * @returns React.JSX.Element
 */
const ColumnDialog = <T extends object>({ table }: ColumnDialogProps<T>) => {
  const intl = useIntl();
  const allColumnsRef = useRef<HTMLInputElement>(null);
  const indeterminate =
    table.getIsSomeColumnsVisible() && !table.getIsAllColumnsVisible();

  useEffect(() => {
    if (allColumnsRef.current) {
      allColumnsRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate, allColumnsRef]);

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button icon={TableCellsIcon} color="warning" type="button" block>
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
              <div className="my-0.75">
                <Field.Label className="flex items-start gap-x-1.5 font-normal">
                  <input
                    ref={allColumnsRef}
                    {...{
                      type: "checkbox",
                      checked: table.getIsAllColumnsVisible(),
                      onChange: table.getToggleAllColumnsVisibilityHandler(),
                    }}
                    // eslint-disable-next-line formatjs/no-literal-string-in-jsx
                  />{" "}
                  {intl.formatMessage(adminMessages.toggleAll)}
                </Field.Label>
              </div>
              {table
                .getAllLeafColumns()
                .filter((c) => c.getCanHide())
                .map((column) => {
                  const header = getColumnHeader(column, "columnDialogHeader");
                  return (
                    <div key={column.id} className="my-0.75">
                      <label>
                        <input
                          {...{
                            type: "checkbox",
                            checked: column.getIsVisible(),
                            onChange: column.getToggleVisibilityHandler(),
                          }}
                          // eslint-disable-next-line formatjs/no-literal-string-in-jsx
                        />{" "}
                        {header}
                      </label>
                    </div>
                  );
                })}
            </Field.BoundingBox>
          </Field.Fieldset>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ColumnDialog;
