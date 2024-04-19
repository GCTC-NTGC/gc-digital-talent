import React from "react";
import { useIntl } from "react-intl";
import { flexRender } from "@tanstack/react-table";
import type { Header, Cell } from "@tanstack/react-table";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";

import { Link } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import SortButton from "./SortButton";
import styles, { getCellStyles } from "./styles";
import { AddDef } from "./types";
import { getColumnHeader } from "./utils";

type WrapperProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const Wrapper = ({ children, ...rest }: WrapperProps) => (
  <div role="region" {...rest}>
    <div
      data-h2-overflow-x="base(auto)"
      data-h2-overflow-y="base(hidden)"
      data-h2-radius="base(s)"
      data-h2-shadow="base(medium)"
    >
      {children}
    </div>
  </div>
);

type TableProps = React.DetailedHTMLProps<
  React.TableHTMLAttributes<HTMLTableElement>,
  HTMLTableElement
>;

const Table = ({ children, ...rest }: TableProps) => (
  <table
    role="table"
    data-h2-background-color="base(foreground)"
    data-h2-border-collapse="base(collapse)"
    data-h2-display="base(block) l-tablet(table)"
    data-h2-width="base(100%)"
    {...rest}
  >
    {children}
  </table>
);

type CaptionProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>;

const Caption = (props: CaptionProps) => (
  <caption data-h2-visually-hidden="base(invisible)" {...props} />
);

type HeadProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLTableSectionElement>,
  HTMLTableSectionElement
>;

const Head = (props: HeadProps) => <thead {...props} />;

type BodyProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLTableSectionElement>,
  HTMLTableSectionElement
>;

const Body = (props: BodyProps) => (
  // Note: Need to specify role for mobile responsive styles
  // eslint-disable-next-line jsx-a11y/no-redundant-roles
  <tbody
    role="rowgroup"
    data-h2-width="base(100%)"
    data-h2-display="base(block) l-tablet(table-row-group)"
    {...props}
  />
);

type RowProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLTableRowElement>,
  HTMLTableRowElement
>;

const HeadRow = (props: RowProps) => (
  <tr
    data-h2-display="base(none) l-tablet(table-row)"
    {...styles.row}
    {...props}
  />
);

const Row = (props: RowProps) => (
  <tr
    role="row"
    data-h2-display="base(flex) l-tablet(table-row)"
    data-h2-background-color="base:selectors[:nth-child(even)](background.dark.50) base:dark:selectors[:nth-child(even)](white.3) base:selectors[:nth-child(odd)](foreground)"
    data-h2-border-bottom="base:selectors[:not(:last-child)](1px solid gray.dark)"
    data-h2-flex-direction="base(row)"
    data-h2-flex-wrap="base(wrap)"
    data-h2-justify-content="base(space-between)"
    data-h2-align-items="base(center)"
    {...styles.row}
    {...props}
  />
);

type CellHTMLProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLTableCellElement>,
  HTMLTableCellElement
>;

type HeadCellProps<T> = {
  header: Header<T, unknown>;
} & CellHTMLProps;

const HeadCell = <T,>({ header, ...rest }: HeadCellProps<T>) => {
  const isRowSelect = header.column.columnDef.meta?.isRowSelect;
  const shouldShrink = header.column.columnDef.meta?.shrink;
  const sortingLocked = header.column.columnDef.meta?.sortingLocked;
  return (
    <th
      role="columnheader"
      data-h2-background-color="base(background.darkest) base:dark(white)"
      data-h2-color="base:all(white)"
      data-h2-display="base(none) l-tablet(table-cell)"
      data-h2-font-size="base(caption)"
      data-h2-vertical-align="base(middle)"
      data-h2-font-weight="base(400)"
      {...(!isRowSelect &&
        !shouldShrink && {
          "data-h2-min-width": "base(x8)",
        })}
      {...styles.cell}
      {...rest}
    >
      {header.isPlaceholder ? null : (
        <SortButton column={header.column} locked={sortingLocked}>
          {flexRender(header.column.columnDef.header, header.getContext())}
        </SortButton>
      )}
    </th>
  );
};

type CellProps<T> = {
  cell: Cell<T, unknown>;
} & CellHTMLProps;

const Cell = <T,>({ cell, ...rest }: CellProps<T>) => {
  const intl = useIntl();
  const isRowTitle = cell.column.columnDef.meta?.isRowTitle;
  const isRowSelect = cell.column.columnDef.meta?.isRowSelect;
  const shouldShrink = cell.column.columnDef.meta?.shrink;
  const cellStyles = getCellStyles({
    isRowTitle,
    isRowSelect,
    shouldShrink,
  });
  const header = getColumnHeader(cell.column, "mobileHeader");

  // We don't want to show the "header" for row titles or selection cells
  const showHeader =
    header &&
    !isRowSelect &&
    !isRowTitle &&
    !cell.column.columnDef.meta?.hideMobileHeader;

  return (
    <td
      // Seems like a false positive, cell is the implicit role for this element
      // REF: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td#technical_summary:~:text=%3Ctr%3E%20element.-,Implicit%20ARIA%20role,-cell%20if%20a
      // eslint-disable-next-line jsx-a11y/no-interactive-element-to-noninteractive-role
      role="cell"
      data-h2-vertical-align="base(middle)"
      data-h2-max-width="base(100%) l-tablet(none)"
      data-h2-color="base(black)"
      {...cellStyles.td}
      {...styles.cell}
      {...rest}
    >
      {showHeader && (
        <span
          data-h2-display="base(inline) l-tablet(none)"
          className="font-bold"
        >
          {header}
          {intl.formatMessage(commonMessages.dividingColon)}{" "}
        </span>
      )}
      <span {...cellStyles.value}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </span>
    </td>
  );
};

type ControlProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const Control = (props: ControlProps) => (
  <div data-h2-width="base(100%) l-tablet(auto)" {...props} />
);

interface AddActionProps {
  add: AddDef;
}

const AddAction = ({ add }: AddActionProps) => (
  <>
    {add.linkProps && (
      <Control data-h2-flex-shrink="base(1)">
        <Link
          icon={PlusCircleIcon}
          color="secondary"
          mode="solid"
          href={add.linkProps.href}
          block
          state={{ from: add.linkProps.from ?? null }}
        >
          {add.linkProps.label}
        </Link>
      </Control>
    )}
    {add.component && <Control>{add.component}</Control>}
  </>
);

interface ControlsProps {
  children: React.ReactNode;
  add?: AddDef;
}

const Controls = ({ children, add }: ControlsProps) => (
  <div
    className="flex"
    data-h2-align-items="base(flex-end)"
    data-h2-flex-direction="base(column) l-tablet(row)"
    data-h2-gap="base(x.25 0) l-tablet(0 x.25)"
    data-h2-margin-bottom="base(x1) l-tablet(x.25)"
    data-h2-justify-content="base(space-between)"
    data-h2-font-size="base(caption)"
  >
    {add && <AddAction add={add} />}
    <div
      className="flex"
      data-h2-align-items="base(flex-end)"
      data-h2-flex-direction="base(column) l-tablet(row)"
      data-h2-gap="base(x.25 0) l-tablet(0 x.25)"
      data-h2-flex-grow="base(1)"
      data-h2-order="base(-1)"
      data-h2-width="base(100%) l-tablet(auto)"
    >
      {children}
    </div>
  </div>
);

export default {
  Wrapper,
  Table,
  Caption,
  Head,
  HeadRow,
  HeadCell,
  Body,
  Row,
  Cell,
  Controls,
  Control,
};
