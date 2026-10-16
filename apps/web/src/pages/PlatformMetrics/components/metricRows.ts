import type { IntlShape } from "react-intl";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import type { LocalizedString } from "@gc-digital-talent/graphql";

/**
 * One row of a metric table: a community, or the overall total.
 *
 * Every metric shares this outer shape and differs only in `values`, so the
 * table component stays generic and each metric supplies its own columns.
 */
export interface MetricRow<TValues> {
  id: string;
  community: string;
  isTotal: boolean;
  values: TValues;
}

interface Metric<TValues> {
  overall: TValues;
  byCommunity: {
    community: { id: string; name?: LocalizedString | null };
    values: TValues;
  }[];
}

/**
 * Flatten a metric into table rows, total first.
 *
 * The total comes from the API rather than being summed here: it is computed in
 * the same pass as the breakdown, and re-deriving it client-side would quietly
 * disagree wherever a community is absent from a metric.
 */
export const toMetricRows = <TValues>(
  metric: Metric<TValues>,
  intl: IntlShape,
): MetricRow<TValues>[] => [
  {
    id: "overall",
    community: intl.formatMessage({
      defaultMessage: "All communities",
      id: '106sI9',
      description: "Label for the total row of a metrics table",
    }),
    isTotal: true,
    values: metric.overall,
  },
  ...metric.byCommunity.map(({ community, values }) => ({
    id: community.id,
    community: getLocalizedName(community.name, intl),
    isTotal: false,
    values,
  })),
];

/**
 * Format a metric value, distinguishing absent from zero.
 *
 * Null means "no value to report" — a community with no completions has no
 * fulfillment rate, which is not a rate of 0%. Showing "Not available" keeps
 * that distinction visible instead of inventing a number.
 */
export const formatMetricNumber = (
  value: number | null | undefined,
  intl: IntlShape,
  options?: Intl.NumberFormatOptions,
): string =>
  value === null || value === undefined
    ? intl.formatMessage(commonMessages.notAvailable)
    : intl.formatNumber(value, options);

/**
 * Percentages arrive as 0-100 with one decimal, so they are scaled back to a
 * fraction before formatting — `style: "percent"` multiplies by 100 itself.
 */
export const formatMetricPercent = (
  value: number | null | undefined,
  intl: IntlShape,
): string =>
  value === null || value === undefined
    ? intl.formatMessage(commonMessages.notAvailable)
    : intl.formatNumber(value / 100, {
        style: "percent",
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      });

/** Days carry one decimal, matching the precision the medians are computed at. */
export const formatMetricDays = (
  value: number | null | undefined,
  intl: IntlShape,
): string => formatMetricNumber(value, intl, { maximumFractionDigits: 1 });
