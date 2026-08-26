import { createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";

import type { FragmentType} from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { DownloadCsv , Heading } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";

import MetricSection from "./MetricSection";
import { metricLabels, metricTitles } from "./metricsMessages";
import {
  csvMessages,
  getMetricsCsvData,
  getMetricsCsvHeaders,
} from "./metricsCsv";
import {
  formatMetricDays,
  formatMetricNumber,
  formatMetricPercent,
  toMetricRows,
} from "./metricRows";

export const TalentRequestMetrics_Fragment = graphql(/* GraphQL */ `
  fragment TalentRequestMetrics on TalentRequestMetrics {
    windowStart
    submittedRequests {
      overall {
        submittedRequests
        submittedWithNoMatches
        statusNew
        statusInProgress
        statusCompleted
      }
      byCommunity {
        community {
          id
          name {
            en
            fr
            localized
          }
        }
        values {
          submittedRequests
          submittedWithNoMatches
          statusNew
          statusInProgress
          statusCompleted
        }
      }
    }
    timeToReferralSent {
      overall {
        medianDaysToReferralSent
        requestsWithReferralSent
        totalRequests
      }
      byCommunity {
        community {
          id
          name {
            en
            fr
            localized
          }
        }
        values {
          medianDaysToReferralSent
          requestsWithReferralSent
          totalRequests
        }
      }
    }
    timeToCompletion {
      overall {
        medianDaysToCompletion
        completionsMeasured
        completedRequests
        stillOpen
        medianAgeOfOpenRequests
      }
      byCommunity {
        community {
          id
          name {
            en
            fr
            localized
          }
        }
        values {
          medianDaysToCompletion
          completionsMeasured
          completedRequests
          stillOpen
          medianAgeOfOpenRequests
        }
      }
    }
    fulfillmentRate {
      overall {
        hires
        eligibleCompletions
        fulfillmentRatePct
        completedWithoutDetail
        excludedFromDenominator
      }
      byCommunity {
        community {
          id
          name {
            en
            fr
            localized
          }
        }
        values {
          hires
          eligibleCompletions
          fulfillmentRatePct
          completedWithoutDetail
          excludedFromDenominator
        }
      }
    }
    referralsPerRequest {
      overall {
        requests
        requestsWithNoTrackedUsers
        medianReviewedPerRequest
        medianReferredPerRequest
        totalReviewed
        totalReferred
        referredShareOfReviewedPct
      }
      byCommunity {
        community {
          id
          name {
            en
            fr
            localized
          }
        }
        values {
          requests
          requestsWithNoTrackedUsers
          medianReviewedPerRequest
          medianReferredPerRequest
          totalReviewed
          totalReferred
          referredShareOfReviewedPct
        }
      }
    }
    nonHireReasons {
      overall {
        reasons {
          reason {
            value
            label {
              en
              fr
              localized
            }
          }
          candidates
          pctOfNotSelected
        }
      }
      byCommunity {
        community {
          id
          name {
            en
            fr
            localized
          }
        }
        values {
          reasons {
            reason {
              value
              label {
                en
                fr
                localized
              }
            }
            candidates
            pctOfNotSelected
          }
        }
      }
    }
  }
`);

interface NonHireReasonRow {
  id: string;
  community: string;
  isTotal: boolean;
  reason: string;
  candidates: number;
  pctOfNotSelected?: number | null;
}

interface TalentRequestMetricsSectionsProps {
  metricsQuery: FragmentType<typeof TalentRequestMetrics_Fragment>;
}

const TalentRequestMetricsSections = ({
  metricsQuery,
}: TalentRequestMetricsSectionsProps) => {
  const intl = useIntl();
  const metrics = getFragment(TalentRequestMetrics_Fragment, metricsQuery);

  const notRecorded = intl.formatMessage(metricLabels.notRecorded);

  const allCommunities = intl.formatMessage(metricLabels.allCommunities);

  // Non-hire reasons is the one metric that is a breakdown rather than a set of
  // figures, so it flattens to one row per community-and-reason pair.
  const nonHireRows: NonHireReasonRow[] = [
    ...metrics.nonHireReasons.overall.reasons.map((entry, index) => ({
      id: `overall-${index}`,
      community: allCommunities,
      isTotal: true,
      reason: entry.reason
        ? getLocalizedName(entry.reason.label, intl)
        : notRecorded,
      candidates: entry.candidates,
      pctOfNotSelected: entry.pctOfNotSelected,
    })),
    ...metrics.nonHireReasons.byCommunity.flatMap(({ community, values }) =>
      values.reasons.map((entry, index) => ({
        id: `${community.id}-${index}`,
        community: getLocalizedName(community.name, intl),
        isTotal: false,
        reason: entry.reason
          ? getLocalizedName(entry.reason.label, intl)
          : notRecorded,
        candidates: entry.candidates,
        pctOfNotSelected: entry.pctOfNotSelected,
      })),
    ),
  ];

  const nonHireHelper = createColumnHelper<NonHireReasonRow>();

  return (
    <>
      <DownloadCsv
        headers={getMetricsCsvHeaders(intl)}
        data={() => getMetricsCsvData(metrics, intl)}
        fileName={intl.formatMessage(csvMessages.fileName)}
        mode="inline"
      >
        {intl.formatMessage(csvMessages.downloadLabel)}
      </DownloadCsv>
      <MetricSection
        title={intl.formatMessage(metricTitles.submittedRequests)}
        description={intl.formatMessage({
          defaultMessage:
            "How many talent requests were submitted, and where they currently sit. Requests that matched nobody are counted separately: they signal demand the talent pool is not meeting, and cannot result in a hire.",
          id: 'DvrllS',
          description: "Explanation of the submitted requests metric",
        })}
        rows={toMetricRows(metrics.submittedRequests, intl)}
        columns={(col) => [
          col(
            "submittedRequests",
            intl.formatMessage(metricLabels.submitted),
            (values) => formatMetricNumber(values.submittedRequests, intl),
          ),
          col(
            "submittedWithNoMatches",
            intl.formatMessage(metricLabels.noMatches),
            (values) => formatMetricNumber(values.submittedWithNoMatches, intl),
          ),
          col(
            "statusNew",
            intl.formatMessage(metricLabels.statusNew),
            (values) => formatMetricNumber(values.statusNew, intl),
          ),
          col(
            "statusInProgress",
            intl.formatMessage(metricLabels.statusInProgress),
            (values) => formatMetricNumber(values.statusInProgress, intl),
          ),
          col(
            "statusCompleted",
            intl.formatMessage(metricLabels.statusCompleted),
            (values) => formatMetricNumber(values.statusCompleted, intl),
          ),
        ]}
      />

      <MetricSection
        title={intl.formatMessage(metricTitles.timeToReferralSent)}
        description={intl.formatMessage({
          defaultMessage:
            "Median days from submission until talent was sent to the manager. The median only describes requests that reached that point, so read it against the counts beside it: a median covering few of many requests describes a fast-moving minority rather than the whole cohort.",
          id: 'HYvOBW',
          description: "Explanation of the time to referral sent metric",
        })}
        rows={toMetricRows(metrics.timeToReferralSent, intl)}
        columns={(col) => [
          col(
            "medianDaysToReferralSent",
            intl.formatMessage(metricLabels.medianDays),
            (values) => formatMetricDays(values.medianDaysToReferralSent, intl),
          ),
          col(
            "requestsWithReferralSent",
            intl.formatMessage(metricLabels.talentSent),
            (values) =>
              formatMetricNumber(values.requestsWithReferralSent, intl),
          ),
          col(
            "totalRequests",
            intl.formatMessage(metricLabels.totalRequests),
            (values) => formatMetricNumber(values.totalRequests, intl),
          ),
        ]}
      />

      <MetricSection
        title={intl.formatMessage(metricTitles.timeToCompletion)}
        description={intl.formatMessage({
          defaultMessage:
            "Median days from submission until the request was closed, excluding duplicate and non-compliant requests. A request left open contributes nothing until it closes, so this median leans toward faster requests: if the open requests are much older than it, the real figure is higher.",
          id: 'h2OKl5',
          description: "Explanation of the time to completion metric",
        })}
        rows={toMetricRows(metrics.timeToCompletion, intl)}
        columns={(col) => [
          col(
            "medianDaysToCompletion",
            intl.formatMessage(metricLabels.medianDays),
            (values) => formatMetricDays(values.medianDaysToCompletion, intl),
          ),
          col(
            "completionsMeasured",
            intl.formatMessage(metricLabels.completionsMeasured),
            (values) => formatMetricNumber(values.completionsMeasured, intl),
          ),
          col(
            "stillOpen",
            intl.formatMessage(metricLabels.stillOpen),
            (values) => formatMetricNumber(values.stillOpen, intl),
          ),
          col(
            "medianAgeOfOpenRequests",
            intl.formatMessage(metricLabels.medianAgeOfOpen),
            (values) => formatMetricDays(values.medianAgeOfOpenRequests, intl),
          ),
        ]}
      />

      <MetricSection
        title={intl.formatMessage(metricTitles.fulfillmentRate)}
        description={intl.formatMessage({
          defaultMessage:
            "The share of closed requests that ended in a hire, counting only requests we actually tried to fill. Duplicate and non-compliant requests are excluded. Requests closed without a reason recorded count against the rate but can never count toward it, so a high number there means the rate is understated.",
          id: '6Rws9H',
          description: "Explanation of the fulfillment rate metric",
        })}
        rows={toMetricRows(metrics.fulfillmentRate, intl)}
        columns={(col) => [
          col(
            "fulfillmentRatePct",
            intl.formatMessage(metricTitles.fulfillmentRate),
            (values) => formatMetricPercent(values.fulfillmentRatePct, intl),
          ),
          col(
            "hires",
            intl.formatMessage(metricLabels.hires),
            (values) => formatMetricNumber(values.hires, intl),
          ),
          col(
            "eligibleCompletions",
            intl.formatMessage(metricLabels.attempts),
            (values) => formatMetricNumber(values.eligibleCompletions, intl),
          ),
          col(
            "completedWithoutDetail",
            intl.formatMessage(metricLabels.noReasonRecorded),
            (values) => formatMetricNumber(values.completedWithoutDetail, intl),
          ),
          col(
            "excludedFromDenominator",
            intl.formatMessage(metricLabels.excluded),
            (values) =>
              formatMetricNumber(values.excludedFromDenominator, intl),
          ),
        ]}
      />

      <MetricSection
        title={intl.formatMessage(metricTitles.referralsPerRequest)}
        description={intl.formatMessage({
          defaultMessage:
            "How many candidates were reviewed and how many of those were referred. Requests with nobody tracked were not worked in the tool — that does not mean no candidates matched, and until it is low the other figures here describe only the work that was tracked.",
          id: 'L28zzP',
          description: "Explanation of the referrals per request metric",
        })}
        rows={toMetricRows(metrics.referralsPerRequest, intl)}
        columns={(col) => [
          col(
            "totalReviewed",
            intl.formatMessage(metricLabels.reviewed),
            (values) => formatMetricNumber(values.totalReviewed, intl),
          ),
          col(
            "totalReferred",
            intl.formatMessage(metricLabels.referred),
            (values) => formatMetricNumber(values.totalReferred, intl),
          ),
          col(
            "referredShareOfReviewedPct",
            intl.formatMessage(metricLabels.referredShare),
            (values) =>
              formatMetricPercent(values.referredShareOfReviewedPct, intl),
          ),
          col(
            "medianReviewedPerRequest",
            intl.formatMessage(metricLabels.medianReviewed),
            (values) =>
              formatMetricNumber(values.medianReviewedPerRequest, intl, {
                maximumFractionDigits: 1,
              }),
          ),
          col(
            "medianReferredPerRequest",
            intl.formatMessage(metricLabels.medianReferred),
            (values) =>
              formatMetricNumber(values.medianReferredPerRequest, intl, {
                maximumFractionDigits: 1,
              }),
          ),
          col(
            "requestsWithNoTrackedUsers",
            intl.formatMessage(metricLabels.nobodyTracked),
            (values) =>
              formatMetricNumber(values.requestsWithNoTrackedUsers, intl),
          ),
        ]}
      />

      <Heading level="h3" size="h6" className="mt-12 mb-3">
        {intl.formatMessage(metricTitles.nonHireReasons)}
      </Heading>
      <p className="mb-4">
        {intl.formatMessage({
          defaultMessage:
            'Why referred candidates were not selected. "Not recorded" means the reason was never filled in, which is different from an admin deliberately choosing that no reason applied. A community with nothing to break down does not appear here at all.',
          id: 'XKmNd5',
          description: "Explanation of the non-hire reasons metric",
        })}
      </p>
      <Table<NonHireReasonRow>
        caption={intl.formatMessage(metricTitles.nonHireReasons)}
        data={nonHireRows}
        nullMessage={{
          description: intl.formatMessage({
            defaultMessage:
              "No candidates have been marked as not selected yet.",
            id: 'BMM0OJ',
            description: "Message shown when there are no non-hire reasons",
          }),
        }}
        columns={[
          nonHireHelper.accessor((row) => row.community, {
            id: "community",
            enableColumnFilter: false,
            header: intl.formatMessage(metricLabels.community),
            cell: ({ getValue, row }) =>
              row.original.isTotal ? <strong>{getValue()}</strong> : getValue(),
          }),
          nonHireHelper.accessor((row) => row.reason, {
            id: "reason",
            enableColumnFilter: false,
            header: intl.formatMessage(metricLabels.reason),
          }),
          nonHireHelper.accessor((row) => row.candidates, {
            id: "candidates",
            enableColumnFilter: false,
            header: intl.formatMessage(metricLabels.candidates),
            cell: ({ getValue }) => formatMetricNumber(getValue(), intl),
          }),
          nonHireHelper.accessor((row) => row.pctOfNotSelected, {
            id: "pctOfNotSelected",
            enableColumnFilter: false,
            header: intl.formatMessage(metricLabels.share),
            cell: ({ getValue }) => formatMetricPercent(getValue(), intl),
          }),
        ]}
      />
    </>
  );
};

export default TalentRequestMetricsSections;
