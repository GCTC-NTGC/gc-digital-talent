import { defineMessages } from "react-intl";

/**
 * Labels shared between the metrics tables and the CSV export.
 *
 * Both render the same numbers, so both must name them the same way — defining
 * these once means a downloaded file cannot disagree with what is on screen.
 */
export const metricTitles = defineMessages({
  submittedRequests: {
    defaultMessage: "Submitted requests", id: 'Vy/RPX',
    description: "Heading for the submitted requests metric",
  },
  timeToReferralSent: {
    defaultMessage: "Time until talent sent", id: 'MLw0dg',
    description: "Heading for the time to referral sent metric",
  },
  timeToCompletion: {
    defaultMessage: "Time until completion", id: 'mNuJ9v',
    description: "Heading for the time to completion metric",
  },
  fulfillmentRate: {
    defaultMessage: "Fulfillment rate", id: 'B4htcZ',
    description: "Heading for the fulfillment rate metric",
  },
  referralsPerRequest: {
    defaultMessage: "Referrals per request", id: 'Jl6lp4',
    description: "Heading for the referrals per request metric",
  },
  nonHireReasons: {
    defaultMessage: "Reasons candidates were not hired", id: '4N+lla',
    description: "Heading for the non-hire reasons metric",
  },
});

export const metricLabels = defineMessages({
  community: {
    defaultMessage: "Community", id: 'CJKG6e',
    description: "Column header for the community a metric is broken down by",
  },
  allCommunities: {
    defaultMessage: "All communities", id: '106sI9',
    description: "Label for the total row of a metrics table",
  },
  notRecorded: {
    defaultMessage: "Not recorded", id: 'I8XBv1',
    description:
      "Label for candidates whose non-selection reason was never filled in",
  },
  submitted: {
    defaultMessage: "Submitted", id: 'zJzaRv',
    description: "Column header for number of requests submitted",
  },
  noMatches: {
    defaultMessage: "No matches", id: 'bIvbCv',
    description: "Column header for requests that matched no candidates",
  },
  statusNew: {
    defaultMessage: "New", id: 'GOyvnL',
    description: "Column header for requests with a status of new",
  },
  statusInProgress: {
    defaultMessage: "In progress", id: 'gq3g5h',
    description: "Column header for requests with a status of in progress",
  },
  statusCompleted: {
    defaultMessage: "Completed", id: 'G+y8WB',
    description: "Column header for requests with a status of completed",
  },
  medianDays: {
    defaultMessage: "Median days", id: 'G8oHm8',
    description: "Column header for a median measured in days",
  },
  talentSent: {
    defaultMessage: "Talent sent", id: 'acstrc',
    description: "Column header for requests that had talent sent",
  },
  totalRequests: {
    defaultMessage: "Total requests", id: 'FPw6nj',
    description: "Column header for the total number of requests",
  },
  completionsMeasured: {
    defaultMessage: "Completions measured", id: 'vKBFqR',
    description: "Column header for the number of completions behind a median",
  },
  stillOpen: {
    defaultMessage: "Still open", id: 'wGndAw',
    description: "Column header for requests that remain open",
  },
  medianAgeOfOpen: {
    defaultMessage: "Median age of open", id: 'BgZfjn',
    description: "Column header for the median age of still-open requests",
  },
  hires: {
    defaultMessage: "Hires", id: '9I4di5',
    description: "Column header for the number of hires made",
  },
  attempts: {
    defaultMessage: "Attempts", id: 'ryqgvD',
    description: "Column header for completed requests we tried to fill",
  },
  noReasonRecorded: {
    defaultMessage: "No reason recorded", id: 'eooq9e',
    description:
      "Column header for requests closed without a completion reason",
  },
  excluded: {
    defaultMessage: "Excluded", id: 'JT1G3v',
    description: "Column header for requests excluded from a rate calculation",
  },
  reviewed: {
    defaultMessage: "Reviewed", id: '+Na54i',
    description: "Column header for candidates reviewed",
  },
  referred: {
    defaultMessage: "Referred", id: 'oAuBSC',
    description: "Column header for candidates referred",
  },
  referredShare: {
    defaultMessage: "Referred share", id: 'YfIOiZ',
    description:
      "Column header for the share of reviewed candidates who were referred",
  },
  medianReviewed: {
    defaultMessage: "Median reviewed", id: 'KoTP4Q',
    description:
      "Column header for the median candidates reviewed per request",
  },
  medianReferred: {
    defaultMessage: "Median referred", id: 'tVrsHS',
    description:
      "Column header for the median candidates referred per request",
  },
  nobodyTracked: {
    defaultMessage: "Nobody tracked", id: 'boodk9',
    description: "Column header for requests with no tracked candidates",
  },
  reason: {
    defaultMessage: "Reason", id: '3C8SnZ',
    description: "Column header for the reason a candidate was not selected",
  },
  candidates: {
    defaultMessage: "Candidates", id: 'eDviit',
    description: "Column header for the number of candidates behind a reason",
  },
  share: {
    defaultMessage: "Share", id: 'RqNE9p',
    description: "Column header for a reason's share of all non-selections",
  },
});
