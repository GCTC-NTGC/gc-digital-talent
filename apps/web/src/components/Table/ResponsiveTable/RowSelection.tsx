import { IntlShape, useIntl } from "react-intl";
import {
  Row,
  Table,
  ColumnDef,
  CellContext,
  ColumnDefTemplate,
  RowSelectionState,
  OnChangeFn,
  Updater,
} from "@tanstack/react-table";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import {
  DetailedHTMLProps,
  Dispatch,
  HTMLAttributes,
  MouseEventHandler,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { tv } from "tailwind-variants";

import { CheckButton, CheckButtonProps } from "@gc-digital-talent/forms";
import {
  Button,
  ButtonProps,
  DownloadCsv,
  Loading,
} from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import { toast } from "@gc-digital-talent/toast";

import { DownloadDef, RowSelectDef } from "./types";
import SpinnerIcon from "../../SpinnerIcon/SpinnerIcon";
import tableMessages from "../tableMessages";

type BaseProps = Omit<
  CheckButtonProps,
  "checked" | "onToggle" | "indeterminate"
>;

type HeaderProps<TData> = BaseProps & {
  // Instance of `react-table`
  table: Table<TData>;
};

/**
 * The header cell for row selection column
 *
 * @param HeaderProps
 * @returns JSX.Element
 */
const Header = <TData extends object>({
  table,
  ...props
}: HeaderProps<TData>) => (
  <CheckButton
    checked={table.getIsAllRowsSelected()}
    onToggle={table.toggleAllRowsSelected}
    indeterminate={table.getIsSomeRowsSelected()}
    {...props}
    color="black"
  />
);

type CellProps<TData> = BaseProps & {
  // Instance of a `react-table` Row
  row: Row<TData>;
};

/**
 * The cell cell for row selection column
 *
 * @param CellProps
 * @returns JSX.Element
 */
const Cell = <TData extends object>({ row, ...props }: CellProps<TData>) => (
  <CheckButton
    checked={row.getIsSelected()}
    onToggle={row.toggleSelected}
    {...props}
  />
);

type DivHTMLProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const column = tv({
  base: "flex flex-col items-start gap-3 sm:flex-row sm:items-center",
});

/**
 * Layout column for the row selection footer
 *
 * @param DivHTMLProps
 * @returns JSX.Element
 */
const Column = ({ className, ...rest }: DivHTMLProps) => (
  <div className={column({ class: className })} {...rest} />
);

const section = tv({
  base: "flex items-center gap-x-1.5",
});

/**
 * Layout section for the row selection footer
 *
 * @param DivHTMLProps
 * @returns JSX.Element
 */
const Section = ({ className, ...rest }: DivHTMLProps) => (
  <div className={section({ class: className })} {...rest} />
);

type BulletProps = DetailedHTMLProps<
  HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
>;

/**
 * Simple bullet (used as a separator for actions)
 *
 * @param BulletProps
 * @returns JSX.Element
 */
const Bullet = (props: Omit<BulletProps, "children">) => (
  // eslint-disable-next-line formatjs/no-literal-string-in-jsx
  <span aria-hidden className="hidden sm:block" {...props}>
    &bull;
  </span>
);

// Simple common props for action buttons
export const actionButtonStyles: Pick<
  ButtonProps,
  "mode" | "color" | "size" | "fixedColor"
> = {
  mode: "text",
  color: "white",
  size: "sm",
  fixedColor: true,
};

interface DownloadAllButtonProps {
  download: DownloadDef["all"];
}

const DownloadAllButton = ({ download }: DownloadAllButtonProps) => {
  const intl = useIntl();
  if (!download) return null;

  const label =
    "label" in download && download?.label
      ? download.label
      : intl.formatMessage({
          defaultMessage: "Download full dataset",
          id: "B6XXtf",
          description:
            "Text label for button to download a csv file of all items in a table.",
        });

  if ("csv" in download) {
    return (
      <DownloadCsv {...download.csv} {...actionButtonStyles}>
        {label}
      </DownloadCsv>
    );
  }

  if ("component" in download && download.component) {
    return download.component;
  }

  if ("onClick" in download) {
    return (
      <Button
        {...actionButtonStyles}
        onClick={download.onClick}
        disabled={download.downloading}
        className="font-normal"
        {...(download.downloading && {
          icon: SpinnerIcon,
        })}
      >
        {label}
      </Button>
    );
  }

  return null;
};

interface ActionsProps {
  /** Indicates whether the table actually have selection enabled */
  rowSelect: boolean;
  /** Indicates that the selection is loading (server side) */
  isLoading?: boolean;
  /** Number of rows that are currently selected */
  count: number;
  /** Callback when the clear button is clicked */
  onClear: MouseEventHandler;
  /** Button to trigger an async download */
  download?: DownloadDef;
}

/**
 * Actions for the selected rows
 *
 * @param ActionsProps
 * @returns JSX.Element
 */
const Actions = ({
  rowSelect,
  isLoading,
  count,
  onClear,
  download,
}: ActionsProps) => {
  const intl = useIntl();

  const handleNoRowsSelected = () => {
    toast.warning(intl.formatMessage(tableMessages.noRowsSelected));
  };

  return (
    <div className="sticky left-0 flex flex-col items-center justify-between gap-y-3 bg-gray-700 px-6 py-3 text-white sm:flex-row sm:items-start sm:gap-x-3 sm:gap-y-0">
      {rowSelect && (
        <Column>
          {isLoading ? (
            <Loading inline className="inset-auto m-0" />
          ) : (
            <Section className="flex flex-col items-center justify-between gap-y-3 text-sm sm:flex-row sm:gap-x-3 sm:gap-y-0">
              <Section>
                <CheckCircleIcon className="size-4" />
                <span>
                  {intl.formatMessage(
                    {
                      defaultMessage:
                        "{count, plural, =0 {0 items selected} one {# item selected} other {# items selected}}",
                      id: "AVlXEr",
                      description:
                        "Message displayed for the number of rows selected in a table",
                    },
                    {
                      count,
                    },
                  )}
                </span>
              </Section>
              <Bullet />
              <span className="relative items-center">
                <Button
                  onClick={onClear}
                  color="white"
                  size="sm"
                  mode="text"
                  fixedColor
                >
                  {intl.formatMessage({
                    defaultMessage: "Clear<hidden> row selection</hidden>",
                    id: "VHG9Gm",
                    description: "Button text to deselect all table rows",
                  })}
                </Button>
              </span>
              {(download?.csv?.enable || download?.doc?.enable) && (
                <span className="flex items-center gap-x-1.5 sm:gap-x-3">
                  {download?.csv?.enable && (
                    <>
                      <Bullet />
                      {download.csv.component ?? (
                        <Button
                          {...actionButtonStyles}
                          onClick={
                            count > 0
                              ? download.csv.onClick
                              : handleNoRowsSelected
                          }
                          disabled={download.csv.downloading}
                          {...(download.csv.downloading && {
                            icon: SpinnerIcon,
                          })}
                        >
                          {intl.formatMessage({
                            defaultMessage: "Download CSV",
                            id: "mxOuYK",
                            description:
                              "Text label for button to download a csv file of items in a table.",
                          })}
                        </Button>
                      )}
                    </>
                  )}

                  {download?.doc?.enable && (
                    <>
                      <Bullet />
                      {download.doc.component ?? (
                        <Button
                          {...actionButtonStyles}
                          onClick={
                            count > 0
                              ? download.doc.onClick
                              : handleNoRowsSelected
                          }
                          disabled={download.doc.downloading}
                          {...(download.doc.downloading && {
                            icon: SpinnerIcon,
                          })}
                        >
                          {intl.formatMessage({
                            defaultMessage: "Download document",
                            id: "sIcsTo",
                            description:
                              "Text label for button to download a document file of items in a table.",
                          })}
                        </Button>
                      )}
                    </>
                  )}
                </span>
              )}
            </Section>
          )}
        </Column>
      )}
      {download?.all && (
        <Column>
          {!isLoading && <DownloadAllButton download={download.all} />}
        </Column>
      )}
    </div>
  );
};

export default {
  Header,
  Cell,
  Actions,
};

/**
 * Get row selection column
 *
 * Generates the column definition for
 * the row selection
 *
 * @param cell Instance of `react-table` cell
 * @returns ColumnDef<TData> The `react-table` column definition for a row selection
 */
export const getRowSelectionColumn = <TData extends object>(
  cell: ColumnDefTemplate<CellContext<TData, unknown>>,
  intl: IntlShape,
): ColumnDef<TData> => ({
  id: "rowSelect",
  enableSorting: false,
  enableHiding: false,
  header: ({ table }) => (
    <Header
      table={table}
      color="white"
      label={intl.formatMessage({
        defaultMessage: "Select all",
        id: "Lu5ppY",
        description: "Label for the checkbox to select all rows in a table",
      })}
    />
  ),
  cell,
  meta: {
    isRowSelect: true,
  },
});

interface RowSelectCellArgs<T> {
  /** The specific row definition */
  row: Row<T>;
  /** Label for the button to select the item */
  label: string;
}

/**
 * Generate the cell for row selection
 *
 * @param param0
 * @returns
 */
export const rowSelectCell = <T extends object>({
  row,
  label,
}: RowSelectCellArgs<T>) => <Cell row={row} label={label} />;

type UseRowSelectionReturn = [
  value: RowSelectionState,
  setter: OnChangeFn<RowSelectionState>,
];

export const useRowSelection = <T,>(
  rowSelect?: RowSelectDef<T>,
): UseRowSelectionReturn => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const rowSelectionCallback = useCallback(
    (newRowSelection: RowSelectionState) => {
      if (rowSelect?.onRowSelection) {
        const selectedRows = Object.keys(newRowSelection)
          .map((value) => {
            return newRowSelection[value] ? value : undefined;
          })
          .filter(notEmpty);

        rowSelect.onRowSelection(selectedRows);
      }
    },
    [rowSelect],
  );

  const handleRowSelection = (
    setter: Dispatch<SetStateAction<RowSelectionState>>,
    updater: Updater<RowSelectionState>,
  ) => {
    if (updater instanceof Function) {
      setter((previous) => {
        return updater(previous);
      });
    } else {
      setter(updater);
    }
  };

  const setter = (updater: Updater<RowSelectionState>) =>
    handleRowSelection(setRowSelection, updater);

  useEffect(() => {
    rowSelectionCallback(rowSelection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection]);

  return [rowSelection, setter];
};
