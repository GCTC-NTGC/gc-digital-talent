import React from "react";
import { useIntl } from "react-intl";
import {
  Row,
  Table,
  ColumnDef,
  CellContext,
  ColumnDefTemplate,
} from "@tanstack/react-table";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";

import { CheckButton, CheckButtonProps } from "@gc-digital-talent/forms";
import {
  Button,
  ButtonProps,
  DownloadCsv,
  Loading,
} from "@gc-digital-talent/ui";

import { ButtonClickEvent, DatasetDownload, DatasetPrint } from "./types";

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
    color="white"
    checked={table.getIsAllRowsSelected()}
    onToggle={table.toggleAllRowsSelected}
    indeterminate={table.getIsSomeRowsSelected()}
    {...props}
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

type DivHTMLProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
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

type BulletProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
>;

/**
 * Simple bullet (used as a separator for actions)
 *
 * @param BulletProps
 * @returns JSX.Element
 */
const Bullet = (props: Omit<BulletProps, "children">) => (
  <span aria-hidden data-h2-display="base(none) l-tablet(block)" {...props}>
    &bull;
  </span>
);

// Simple common props for action buttons
const actionButtonStyles: Pick<ButtonProps, "mode" | "color"> = {
  mode: "inline",
  color: "white",
};

interface ActionsProps {
  /** Indicates that the selection is loading (server side) */
  isLoading?: boolean;
  /** Number of rows that are currently selected */
  count: number;
  /** Callback when the clear button is clicked */
  onClear: ButtonClickEvent;
  /** Enable print and pass the callback */
  print?: DatasetPrint;
  /** Enable the one or both (selection, all) download buttons */
  download?: DatasetDownload;
}

/**
 * Actions for the selected rows
 *
 * @param ActionsProps
 * @returns JSX.Element
 */
const Actions = ({
  isLoading,
  count,
  onClear,
  print,
  download,
}: ActionsProps) => {
  const intl = useIntl();

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column) l-tablet(row)"
      data-h2-gap="base(x.5 0) l-tablet(0 x.5)"
      data-h2-padding="base(x.5)"
      data-h2-background-color="base(black)"
      data-h2-color="base(white)"
      data-h2-position="base(relative)"
    >
      <Column>
        {isLoading ? (
          <Loading
            inline
            data-h2-margin="base(0)"
            data-h2-location="base(auto, auto, auto, auto)"
          />
        ) : (
          <Section>
            <Section>
              <CheckCircleIcon
                data-h2-width="base(1em)"
                data-h2-height="base(1em)"
              />
              <span>
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "{count, plural, =0 {0 items} =1 {1 item} other {# items}} selected",
                    id: "84v1nY",
                    description:
                      "Message displayed for the number of rows selected in a table",
                  },
                  {
                    count,
                  },
                )}
              </span>
            </Section>
            <Bullet data-h2-display="base(block)" />
            <Button onClick={onClear} color="white" mode="inline">
              {intl.formatMessage({
                defaultMessage: "Clear<hidden> row selection</hidden>",
                id: "VHG9Gm",
                description: "Button text to deselect all table rows",
              })}
            </Button>
            {download?.selection && (
              <>
                <Bullet />
                <DownloadCsv
                  {...download.selection.csv}
                  {...actionButtonStyles}
                >
                  {download.selection.label ||
                    intl.formatMessage({
                      defaultMessage: "Download CSV",
                      id: "mxOuYK",
                      description:
                        "Text label for button to download a csv file of items in a table.",
                    })}
                </DownloadCsv>
              </>
            )}
            {print?.onPrint && (
              <>
                <Bullet />
                <Button onClick={print.onPrint} {...actionButtonStyles}>
                  {print.label ||
                    intl.formatMessage({
                      defaultMessage: "Print selection",
                      id: "KrrW7D",
                      description:
                        "Text label for button to print items in a table.",
                    })}
                </Button>
              </>
            )}
          </Section>
        )}
      </Column>
      {download?.all && (
        <Column>
          {!isLoading && (
            <DownloadCsv {...download.all.csv} {...actionButtonStyles}>
              {download.all.label ||
                intl.formatMessage({
                  defaultMessage: "Download full dataset",
                  id: "B6XXtf",
                  description:
                    "Text label for button to download a csv file of all items in a table.",
                })}
            </DownloadCsv>
          )}
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
): ColumnDef<TData> => ({
  id: "rowSelect",
  header: ({ table }) => (
    <Header table={table} label="Select all" color="white" />
  ),
  cell,
  meta: {
    hideInColumnDialog: true,
    isRowSelect: true,
  },
});
