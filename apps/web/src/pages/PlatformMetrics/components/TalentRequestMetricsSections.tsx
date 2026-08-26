import { createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";

import type { FragmentType} from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { Heading } from "@gc-digital-talent/ui";

import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";

import MetricSection from "./MetricSection";
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

  const notRecorded = intl.formatMessage({
    defaultMessage: "Not recorded",
    id: 'I8XBv1',
    description:
      "Label for candidates whose non-selection reason was never filled in",
  });

  const allCommunities = intl.formatMessage({
    defaultMessage: "All communities",
    id: '106sI9',
    description: "Label for the total row of a metrics table",
  });

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
      <MetricSection
        title={intl.formatMessage({
          defaultMessage: "Submitted requests",
          id: 'Vy/RPX',
          description: "Heading for the submitted requests metric",
        })}
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
            intl.formatMessage({
              defaultMessage: "Submitted",
              id: 'zJzaRv',
              description: "Column header for number of requests submitted",
            }),
            (values) => formatMetricNumber(values.submittedRequests, intl),
          ),
          col(
            "submittedWithNoMatches",
            intl.formatMessage({
              defaultMessage: "No matches",
              id: 'bIvbCv',
              description:
                "Column header for requests that matched no candidates",
            }),
            (values) => formatMetricNumber(values.submittedWithNoMatches, intl),
          ),
          col(
            "statusNew",
            intl.formatMessage({
              defaultMessage: "New",
              id: 'GOyvnL',
              description: "Column header for requests with a status of new",
            }),
            (values) => formatMetricNumber(values.statusNew, intl),
          ),
          col(
            "statusInProgress",
            intl.formatMessage({
              defaultMessage: "In progress",
              id: 'gq3g5h',
              description:
                "Column header for requests with a status of in progress",
            }),
            (values) => formatMetricNumber(values.statusInProgress, intl),
          ),
          col(
            "statusCompleted",
            intl.formatMessage({
              defaultMessage: "Completed",
              id: 'G+y8WB',
              description:
                "Column header for requests with a status of completed",
            }),
            (values) => formatMetricNumber(values.statusCompleted, intl),
          ),
        ]}
      />

      <MetricSection
        title={intl.formatMessage({
          defaultMessage: "Time until talent sent",
          id: 'MLw0dg',
          description: "Heading for the time to referral sent metric",
        })}
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
            intl.formatMessage({
              defaultMessage: "Median days",
              id: 'G8oHm8',
              description: "Column header for a median measured in days",
            }),
            (values) => formatMetricDays(values.medianDaysToReferralSent, intl),
          ),
          col(
            "requestsWithReferralSent",
            intl.formatMessage({
              defaultMessage: "Talent sent",
              id: 'acstrc',
              description: "Column header for requests that had talent sent",
            }),
            (values) =>
              formatMetricNumber(values.requestsWithReferralSent, intl),
          ),
          col(
            "totalRequests",
            intl.formatMessage({
              defaultMessage: "Total requests",
              id: 'FPw6nj',
              description: "Column header for the total number of requests",
            }),
            (values) => formatMetricNumber(values.totalRequests, intl),
          ),
        ]}
      />

      <MetricSection
        title={intl.formatMessage({
          defaultMessage: "Time until completion",
          id: 'mNuJ9v',
          description: "Heading for the time to completion metric",
        })}
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
            intl.formatMessage({
              defaultMessage: "Median days",
              id: 'G8oHm8',
              description: "Column header for a median measured in days",
            }),
            (values) => formatMetricDays(values.medianDaysToCompletion, intl),
          ),
          col(
            "completionsMeasured",
            intl.formatMessage({
              defaultMessage: "Completions measured",
              id: 'vKBFqR',
              description:
                "Column header for the number of completions behind a median",
            }),
            (values) => formatMetricNumber(values.completionsMeasured, intl),
          ),
          col(
            "stillOpen",
            intl.formatMessage({
              defaultMessage: "Still open",
              id: 'wGndAw',
              description: "Column header for requests that remain open",
            }),
            (values) => formatMetricNumber(values.stillOpen, intl),
          ),
          col(
            "medianAgeOfOpenRequests",
            intl.formatMessage({
              defaultMessage: "Median age of open",
              id: 'BgZfjn',
              description:
                "Column header for the median age of still-open requests",
            }),
            (values) => formatMetricDays(values.medianAgeOfOpenRequests, intl),
          ),
        ]}
      />

      <MetricSection
        title={intl.formatMessage({
          defaultMessage: "Fulfillment rate",
          id: 'B4htcZ',
          description: "Heading for the fulfillment rate metric",
        })}
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
            intl.formatMessage({
              defaultMessage: "Fulfillment rate",
              id: 'B4htcZ',
              description: "Heading for the fulfillment rate metric",
            }),
            (values) => formatMetricPercent(values.fulfillmentRatePct, intl),
          ),
          col(
            "hires",
            intl.formatMessage({
              defaultMessage: "Hires",
              id: '9I4di5',
              description: "Column header for the number of hires made",
            }),
            (values) => formatMetricNumber(values.hires, intl),
          ),
          col(
            "eligibleCompletions",
            intl.formatMessage({
              defaultMessage: "Attempts",
              id: 'ryqgvD',
              description:
                "Column header for completed requests we tried to fill",
            }),
            (values) => formatMetricNumber(values.eligibleCompletions, intl),
          ),
          col(
            "completedWithoutDetail",
            intl.formatMessage({
              defaultMessage: "No reason recorded",
              id: 'eooq9e',
              description:
                "Column header for requests closed without a completion reason",
            }),
            (values) => formatMetricNumber(values.completedWithoutDetail, intl),
          ),
          col(
            "excludedFromDenominator",
            intl.formatMessage({
              defaultMessage: "Excluded",
              id: 'JT1G3v',
              description:
                "Column header for requests excluded from a rate calculation",
            }),
            (values) =>
              formatMetricNumber(values.excludedFromDenominator, intl),
          ),
        ]}
      />

      <MetricSection
        title={intl.formatMessage({
          defaultMessage: "Referrals per request",
          id: 'Jl6lp4',
          description: "Heading for the referrals per request metric",
        })}
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
            intl.formatMessage({
              defaultMessage: "Reviewed",
              id: '+Na54i',
              description: "Column header for candidates reviewed",
            }),
            (values) => formatMetricNumber(values.totalReviewed, intl),
          ),
          col(
            "totalReferred",
            intl.formatMessage({
              defaultMessage: "Referred",
              id: 'oAuBSC',
              description: "Column header for candidates referred",
            }),
            (values) => formatMetricNumber(values.totalReferred, intl),
          ),
          col(
            "referredShareOfReviewedPct",
            intl.formatMessage({
              defaultMessage: "Referred share",
              id: 'YfIOiZ',
              description:
                "Column header for the share of reviewed candidates who were referred",
            }),
            (values) =>
              formatMetricPercent(values.referredShareOfReviewedPct, intl),
          ),
          col(
            "medianReviewedPerRequest",
            intl.formatMessage({
              defaultMessage: "Median reviewed",
              id: 'KoTP4Q',
              description:
                "Column header for the median candidates reviewed per request",
            }),
            (values) =>
              formatMetricNumber(values.medianReviewedPerRequest, intl, {
                maximumFractionDigits: 1,
              }),
          ),
          col(
            "medianReferredPerRequest",
            intl.formatMessage({
              defaultMessage: "Median referred",
              id: 'tVrsHS',
              description:
                "Column header for the median candidates referred per request",
            }),
            (values) =>
              formatMetricNumber(values.medianReferredPerRequest, intl, {
                maximumFractionDigits: 1,
              }),
          ),
          col(
            "requestsWithNoTrackedUsers",
            intl.formatMessage({
              defaultMessage: "Nobody tracked",
              id: 'boodk9',
              description:
                "Column header for requests with no tracked candidates",
            }),
            (values) =>
              formatMetricNumber(values.requestsWithNoTrackedUsers, intl),
          ),
        ]}
      />

      <Heading level="h3" size="h6" className="mt-12 mb-3">
        {intl.formatMessage({
          defaultMessage: "Reasons candidates were not hired",
          id: '4N+lla',
          description: "Heading for the non-hire reasons metric",
        })}
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
        caption={intl.formatMessage({
          defaultMessage: "Reasons candidates were not hired",
          id: '4N+lla',
          description: "Heading for the non-hire reasons metric",
        })}
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
            header: intl.formatMessage({
              defaultMessage: "Community",
              id: 'CJKG6e',
              description:
                "Column header for the community a metric is broken down by",
            }),
            cell: ({ getValue, row }) =>
              row.original.isTotal ? <strong>{getValue()}</strong> : getValue(),
          }),
          nonHireHelper.accessor((row) => row.reason, {
            id: "reason",
            enableColumnFilter: false,
            header: intl.formatMessage({
              defaultMessage: "Reason",
              id: '3C8SnZ',
              description:
                "Column header for the reason a candidate was not selected",
            }),
          }),
          nonHireHelper.accessor((row) => row.candidates, {
            id: "candidates",
            enableColumnFilter: false,
            header: intl.formatMessage({
              defaultMessage: "Candidates",
              id: 'eDviit',
              description:
                "Column header for the number of candidates behind a reason",
            }),
            cell: ({ getValue }) => formatMetricNumber(getValue(), intl),
          }),
          nonHireHelper.accessor((row) => row.pctOfNotSelected, {
            id: "pctOfNotSelected",
            enableColumnFilter: false,
            header: intl.formatMessage({
              defaultMessage: "Share",
              id: 'RqNE9p',
              description:
                "Column header for a reason's share of all non-selections",
            }),
            cell: ({ getValue }) => formatMetricPercent(getValue(), intl),
          }),
        ]}
      />
    </>
  );
};

export default TalentRequestMetricsSections;
