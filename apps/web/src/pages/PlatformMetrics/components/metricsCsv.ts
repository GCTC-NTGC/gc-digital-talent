import type { IntlShape } from "react-intl";
import { defineMessages } from "react-intl";

import type { DownloadCsvProps } from "@gc-digital-talent/ui";
import type { TalentRequestMetricsFragment } from "@gc-digital-talent/graphql";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { parseDateTimeUtc, rawFormat } from "@gc-digital-talent/date-helpers";

import {
  formatMetricDays,
  formatMetricNumber,
  formatMetricPercent,
  toMetricRows,
} from "./metricRows";
import { metricLabels, metricTitles } from "./metricsMessages";

const csvMessages = defineMessages({
  metric: {
    defaultMessage: "Metric", id: 'cCn2y7',
    description: "CSV column header naming which metric a row belongs to",
  },
  measure: {
    defaultMessage: "Measure", id: 'p69Sh+',
    description: "CSV column header naming which figure a row reports",
  },
  value: {
    defaultMessage: "Value", id: 'PFnQYl',
    description: "CSV column header for the figure itself",
  },
  reasonCandidates: {
    defaultMessage: "{reason} (candidates)", id: 'dXMLYm',
    description: "CSV measure naming the candidate count for a non-hire reason",
  },
  reasonShare: {
    defaultMessage: "{reason} (share)", id: 'QM11EJ',
    description: "CSV measure naming the share for a non-hire reason",
  },
  fileName: {
    defaultMessage: "gc_digital_talent_platform_metrics_{date}.csv", id: 'LHQ+dQ',
    description: "Filename for the platform metrics CSV download",
  },
  downloadLabel: {
    defaultMessage: "Download all metrics (CSV)", id: 'DtvKwd',
    description: "Button text to download every metric as a CSV file",
  },
});

export { csvMessages };

interface CsvRow extends Record<string, string> {
  metric: string;
  community: string;
  measure: string;
  value: string;
}

/**
 * Long format — one row per metric, community and measure.
 *
 * The six metrics have no column shape in common, so a wide file would be
 * mostly empty cells. Long format keeps every figure addressable and lets a
 * spreadsheet pivot it back into whatever shape the reader wants.
 */
export const getMetricsCsvHeaders = (
  intl: IntlShape,
): DownloadCsvProps["headers"] => [
  { id: "metric", displayName: intl.formatMessage(csvMessages.metric) },
  { id: "community", displayName: intl.formatMessage(metricLabels.community) },
  { id: "measure", displayName: intl.formatMessage(csvMessages.measure) },
  { id: "value", displayName: intl.formatMessage(csvMessages.value) },
];

/**
 * Filename for the download, stamped with the date the snapshot was computed.
 *
 * Deliberately not the download date: the file's contents belong to one nightly
 * run, so naming it after that run identifies the data rather than the moment
 * someone clicked. It also removes a day-boundary trap — a download made late
 * in the evening would otherwise carry a date the data has nothing to do with.
 *
 * Formatted from the same parsed timestamp the page displays, so the filename
 * and the "last calculated" line on screen always agree.
 */
export const getMetricsCsvFileName = (
  intl: IntlShape,
  computedAt: string,
): string =>
  intl.formatMessage(csvMessages.fileName, {
    date: rawFormat(parseDateTimeUtc(computedAt), "yyyy_MM_dd"),
  });

/** A metric's figures, as (label, formatted value) pairs. */
type Measures<TValues> = (
  values: TValues,
  intl: IntlShape,
) => [string, string][];

const rowsFor = <TValues,>(
  title: string,
  metric: Parameters<typeof toMetricRows<TValues>>[0],
  measures: Measures<TValues>,
  intl: IntlShape,
): CsvRow[] =>
  toMetricRows(metric, intl).flatMap((row) =>
    measures(row.values, intl).map(([measure, value]) => ({
      metric: title,
      community: row.community,
      measure,
      value,
    })),
  );

type Metrics = TalentRequestMetricsFragment;
type NonHireEntry = Metrics["nonHireReasons"]["overall"]["reasons"][number];
type NonHireGroup = Metrics["nonHireReasons"]["byCommunity"][number];

export const getMetricsCsvData = (
  metrics: Metrics,
  intl: IntlShape,
): CsvRow[] => {
  const notRecorded = intl.formatMessage(metricLabels.notRecorded);

  const nonHireRows: CsvRow[] = [
    ...metrics.nonHireReasons.overall.reasons.map((entry: NonHireEntry) => ({
      entry,
      community: intl.formatMessage(metricLabels.allCommunities),
    })),
    ...metrics.nonHireReasons.byCommunity.flatMap((group: NonHireGroup) =>
      group.values.reasons.map((entry: NonHireEntry) => ({
        entry,
        community: getLocalizedName(group.community.name, intl),
      })),
    ),
  ].flatMap(({ entry, community }) => {
    const reason = entry.reason
      ? getLocalizedName(entry.reason.label, intl)
      : notRecorded;

    return [
      {
        metric: intl.formatMessage(metricTitles.nonHireReasons),
        community,
        measure: intl.formatMessage(csvMessages.reasonCandidates, { reason }),
        value: formatMetricNumber(entry.candidates, intl),
      },
      {
        metric: intl.formatMessage(metricTitles.nonHireReasons),
        community,
        measure: intl.formatMessage(csvMessages.reasonShare, { reason }),
        value: formatMetricPercent(entry.pctOfNotSelected, intl),
      },
    ];
  });

  return [
    ...rowsFor(
      intl.formatMessage(metricTitles.submittedRequests),
      metrics.submittedRequests,
      (values) => [
        [
          intl.formatMessage(metricLabels.submitted),
          formatMetricNumber(values.submittedRequests, intl),
        ],
        [
          intl.formatMessage(metricLabels.noMatches),
          formatMetricNumber(values.submittedWithNoMatches, intl),
        ],
        [
          intl.formatMessage(metricLabels.statusNew),
          formatMetricNumber(values.statusNew, intl),
        ],
        [
          intl.formatMessage(metricLabels.statusInProgress),
          formatMetricNumber(values.statusInProgress, intl),
        ],
        [
          intl.formatMessage(metricLabels.statusCompleted),
          formatMetricNumber(values.statusCompleted, intl),
        ],
      ],
      intl,
    ),
    ...rowsFor(
      intl.formatMessage(metricTitles.timeToReferralSent),
      metrics.timeToReferralSent,
      (values) => [
        [
          intl.formatMessage(metricLabels.medianDays),
          formatMetricDays(values.medianDaysToReferralSent, intl),
        ],
        [
          intl.formatMessage(metricLabels.talentSent),
          formatMetricNumber(values.requestsWithReferralSent, intl),
        ],
        [
          intl.formatMessage(metricLabels.totalRequests),
          formatMetricNumber(values.totalRequests, intl),
        ],
      ],
      intl,
    ),
    ...rowsFor(
      intl.formatMessage(metricTitles.timeToCompletion),
      metrics.timeToCompletion,
      (values) => [
        [
          intl.formatMessage(metricLabels.medianDays),
          formatMetricDays(values.medianDaysToCompletion, intl),
        ],
        [
          intl.formatMessage(metricLabels.completionsMeasured),
          formatMetricNumber(values.completionsMeasured, intl),
        ],
        [
          intl.formatMessage(metricLabels.stillOpen),
          formatMetricNumber(values.stillOpen, intl),
        ],
        [
          intl.formatMessage(metricLabels.medianAgeOfOpen),
          formatMetricDays(values.medianAgeOfOpenRequests, intl),
        ],
      ],
      intl,
    ),
    ...rowsFor(
      intl.formatMessage(metricTitles.fulfillmentRate),
      metrics.fulfillmentRate,
      (values) => [
        [
          intl.formatMessage(metricTitles.fulfillmentRate),
          formatMetricPercent(values.fulfillmentRatePct, intl),
        ],
        [
          intl.formatMessage(metricLabels.hires),
          formatMetricNumber(values.hires, intl),
        ],
        [
          intl.formatMessage(metricLabels.attempts),
          formatMetricNumber(values.eligibleCompletions, intl),
        ],
        [
          intl.formatMessage(metricLabels.noReasonRecorded),
          formatMetricNumber(values.completedWithoutDetail, intl),
        ],
        [
          intl.formatMessage(metricLabels.excluded),
          formatMetricNumber(values.excludedFromDenominator, intl),
        ],
      ],
      intl,
    ),
    ...rowsFor(
      intl.formatMessage(metricTitles.referralsPerRequest),
      metrics.referralsPerRequest,
      (values) => [
        [
          intl.formatMessage(metricLabels.reviewed),
          formatMetricNumber(values.totalReviewed, intl),
        ],
        [
          intl.formatMessage(metricLabels.referred),
          formatMetricNumber(values.totalReferred, intl),
        ],
        [
          intl.formatMessage(metricLabels.referredShare),
          formatMetricPercent(values.referredShareOfReviewedPct, intl),
        ],
        [
          intl.formatMessage(metricLabels.medianReviewed),
          formatMetricNumber(values.medianReviewedPerRequest, intl, {
            maximumFractionDigits: 1,
          }),
        ],
        [
          intl.formatMessage(metricLabels.medianReferred),
          formatMetricNumber(values.medianReferredPerRequest, intl, {
            maximumFractionDigits: 1,
          }),
        ],
        [
          intl.formatMessage(metricLabels.nobodyTracked),
          formatMetricNumber(values.requestsWithNoTrackedUsers, intl),
        ],
      ],
      intl,
    ),
    ...nonHireRows,
  ];
};
