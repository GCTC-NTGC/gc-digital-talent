import type { ColumnDef} from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { useIntl } from "react-intl";

import { Heading } from "@gc-digital-talent/ui";

import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";

import type { MetricRow } from "./metricRows";
import { metricLabels } from "./metricsMessages";

/** Builds a column that reads one figure out of a row's `values`. */
export type MetricColumnFactory<TValues> = (
  id: string,
  header: string,
  render: (values: TValues) => string,
) => ColumnDef<MetricRow<TValues>>;

interface MetricSectionProps<TValues> {
  title: string;
  /** What the metric means and how to read it. Shown above the table. */
  description: ReactNode;
  rows: MetricRow<TValues>[];
  /**
   * Columns over `values`; the community column is prepended here.
   *
   * A builder rather than an array so TypeScript can infer the value type from
   * `rows` and flow it into each column's render callback — passing an array
   * would leave those callbacks untyped.
   */
  columns: (
    col: MetricColumnFactory<TValues>,
  ) => ColumnDef<MetricRow<TValues>>[];
}

/**
 * One metric: a heading, an explanation, and a table of communities plus the
 * overall total.
 *
 * The metrics do not share a column shape, so each gets its own table rather
 * than being flattened into a single wide one.
 */
const MetricSection = <TValues,>({
  title,
  description,
  rows,
  columns,
}: MetricSectionProps<TValues>) => {
  const intl = useIntl();
  const columnHelper = createColumnHelper<MetricRow<TValues>>();

  const communityColumn = columnHelper.accessor((row) => row.community, {
    id: "community",
    enableColumnFilter: false,
    header: intl.formatMessage(metricLabels.community),
    cell: ({ getValue, row }) =>
      row.original.isTotal ? <strong>{getValue()}</strong> : getValue(),
  }) as ColumnDef<MetricRow<TValues>>;

  const col: MetricColumnFactory<TValues> = (id, header, render) =>
    columnHelper.accessor((row) => render(row.values), {
      id,
      header,
      enableColumnFilter: false,
    }) as ColumnDef<MetricRow<TValues>>;

  return (
    <>
      <Heading level="h3" size="h6" className="mt-12 mb-3">
        {title}
      </Heading>
      <p className="mb-4">{description}</p>
      <Table<MetricRow<TValues>>
        caption={title}
        data={rows}
        columns={[communityColumn, ...columns(col)]}
      />
    </>
  );
};

export default MetricSection;
