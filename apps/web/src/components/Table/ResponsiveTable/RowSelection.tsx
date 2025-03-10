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

/**
 * Layout column for the row selection footer
 *
 * @param DivHTMLProps
 * @returns JSX.Element
 */
const Column = (props: DivHTMLProps) => (
  <div
    data-h2-display="base(flex)"
    data-h2-flex-direction="base(column) l-tablet(row)"
    data-h2-align-items="base(flex-start) l-tablet(center)"
    data-h2-gap="base(x.5 0) l-tablet(0 x.5)"
    {...props}
  />
);

/**
 * Layout section for the row selection footer
 *
 * @param DivHTMLProps
 * @returns JSX.Element
 */
const Section = (props: DivHTMLProps) => (
  <div
    data-h2-display="base(flex)"
    data-h2-align-items="base(center)"
    data-h2-gap="base(0 x.25)"
    {...props}
  />
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
  <span aria-hidden data-h2-display="base(none) l-tablet(block)" {...props}>
    &bull;
  </span>
);

// Simple common props for action buttons
export const actionButtonStyles: Pick<
  ButtonProps,
  "mode" | "color" | "fontSize"
> = {
  mode: "inline",
  color: "whiteFixed",
  fontSize: "caption",
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
        data-h2-font-weight="base(400)"
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
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column) l-tablet(row)"
      data-h2-align-items="base(center) l-tablet(flex-start)"
      data-h2-gap="base(x.5 0) l-tablet(0 x.5)"
      data-h2-padding="base(x.5, x1)"
      data-h2-background-color="base(background.darkest) base:dark(white)"
      data-h2-color="base:all(white)"
      data-h2-position="base(sticky)"
      data-h2-justify-content="base(space-between)"
      data-h2-left="base(0)"
    >
      {rowSelect && (
        <Column>
          {isLoading ? (
            <Loading
              inline
              data-h2-margin="base(0)"
              data-h2-location="base(auto, auto, auto, auto)"
            />
          ) : (
            <Section
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column) l-tablet(row)"
              data-h2-align-items="base(center)"
              data-h2-justify-content="base(space-between)"
              data-h2-gap="base(x.5 0) l-tablet(0 x.5)"
              data-h2-font-size="base(caption)"
            >
              <Section>
                <CheckCircleIcon
                  data-h2-width="base(1em)"
                  data-h2-height="base(1em)"
                />
                <span>
                  {intl.formatMessage(
                    {
                      defaultMessage:
                        "{count, plural, =0 {0 items selected} =1 {1 item selected} other {# items selected}}",
                      id: "450itb",
                      description:
                        "Message displayed for the number of rows selected in a table",
                    },
                    {
                      count,
                    },
                  )}
                </span>
              </Section>
              <span data-h2-display="base(none) l-tablet(block)">
                <Bullet data-h2-display="base(none) l-tablet(block)" />
              </span>
              <span
                data-h2-position="base(relative)"
                data-h2-align-items="base(center)"
              >
                <Button
                  data-h2-font-weight="base(400)"
                  data-h2-position="base(relative)"
                  data-h2-display="base(flex)"
                  data-h2-align-items="base(center)"
                  onClick={onClear}
                  color="whiteFixed"
                  fontSize="caption"
                  mode="inline"
                >
                  {intl.formatMessage({
                    defaultMessage: "Clear<hidden> row selection</hidden>",
                    id: "VHG9Gm",
                    description: "Button text to deselect all table rows",
                  })}
                </Button>
              </span>
              {(download?.csv?.enable || download?.doc?.enable) && (
                <span
                  data-h2-align-items="base(center)"
                  data-h2-display="base(flex)"
                  data-h2-gap="base(0 x.25) l-tablet(0 x.5)"
                >
                  {download?.csv?.enable && (
                    <>
                      <span data-h2-display="base(none) l-tablet(block)">
                        <Bullet data-h2-display="base(none) l-tablet(block)" />
                      </span>
                      {download.csv.component ?? (
                        <Button
                          {...actionButtonStyles}
                          onClick={
                            count > 0
                              ? download.csv.onClick
                              : handleNoRowsSelected
                          }
                          disabled={download.csv.downloading}
                          data-h2-font-weight="base(400)"
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
                      <span data-h2-display="base(none) l-tablet(block)">
                        <Bullet data-h2-display="base(none) l-tablet(block)" />
                      </span>
                      {download.doc.component ?? (
                        <Button
                          {...actionButtonStyles}
                          onClick={
                            count > 0
                              ? download.doc.onClick
                              : handleNoRowsSelected
                          }
                          disabled={download.doc.downloading}
                          data-h2-font-weight="base(400)"
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
