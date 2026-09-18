import { createIntl, createIntlCache } from "react-intl";

import type { TalentRequestMetricsFragment } from "@gc-digital-talent/graphql";

import {
  getMetricsCsvData,
  getMetricsCsvFileName,
  getMetricsCsvHeaders,
} from "./metricsCsv";

const intl = createIntl({ locale: "en" }, createIntlCache());

const community = (id: string, en: string) => ({
  id,
  name: { en, fr: `${en} FR`, localized: en },
});

/**
 * One community with figures, plus a second that has nothing to report, so the
 * absent-versus-zero distinction is exercised.
 */
const metrics = {
  windowStart: "2026-06-03",
  submittedRequests: {
    overall: {
      submittedRequests: 5,
      submittedWithNoMatches: 1,
      statusNew: 2,
      statusInProgress: 0,
      statusCompleted: 3,
    },
    byCommunity: [
      {
        community: community("digital-id", "Digital"),
        values: {
          submittedRequests: 4,
          submittedWithNoMatches: 0,
          statusNew: 1,
          statusInProgress: 0,
          statusCompleted: 3,
        },
      },
    ],
  },
  timeToReferralSent: {
    overall: {
      medianDaysToReferralSent: 4.5,
      requestsWithReferralSent: 2,
      totalRequests: 5,
    },
    byCommunity: [],
  },
  timeToCompletion: {
    overall: {
      medianDaysToCompletion: 15,
      completionsMeasured: 2,
      completedRequests: 2,
      stillOpen: 3,
      medianAgeOfOpenRequests: 20,
    },
    byCommunity: [],
  },
  fulfillmentRate: {
    overall: {
      hires: 1,
      eligibleCompletions: 2,
      fulfillmentRatePct: 50,
      completedWithoutDetail: 0,
      excludedFromDenominator: 1,
    },
    byCommunity: [
      {
        community: community("finance-id", "Finance"),
        values: {
          hires: 0,
          eligibleCompletions: 0,
          // No attempts at all, so there is no rate — distinct from 0%.
          fulfillmentRatePct: null,
          completedWithoutDetail: 0,
          excludedFromDenominator: 0,
        },
      },
    ],
  },
  referralsPerRequest: {
    overall: {
      requests: 5,
      requestsWithNoTrackedUsers: 2,
      medianReviewedPerRequest: 1,
      medianReferredPerRequest: 1,
      totalReviewed: 6,
      totalReferred: 5,
      referredShareOfReviewedPct: 83.3,
    },
    byCommunity: [],
  },
  nonHireReasons: {
    overall: {
      reasons: [
        {
          reason: {
            value: "LACKS_EXPERIENCE",
            label: {
              en: "Lacks experience",
              fr: "FR",
              localized: "Lacks experience",
            },
          },
          candidates: 2,
          pctOfNotSelected: 40,
        },
        // Never filled in, which is not the same as the NO_REASON enum value.
        { reason: null, candidates: 1, pctOfNotSelected: 20 },
      ],
    },
    byCommunity: [],
  },
} as unknown as TalentRequestMetricsFragment;

describe("metricsCsv", () => {
  const rows = getMetricsCsvData(metrics, intl);

  it("emits the four long-format columns", () => {
    expect(getMetricsCsvHeaders(intl).map((h) => h.id)).toEqual([
      "metric",
      "community",
      "measure",
      "value",
    ]);
  });

  it("labels the total row and names each community", () => {
    const submitted = rows.filter(
      (row) => row.metric === "Submitted requests" && row.measure === "Submitted",
    );

    expect(submitted).toEqual([
      {
        metric: "Submitted requests",
        community: "All communities",
        measure: "Submitted",
        value: "5",
      },
      {
        metric: "Submitted requests",
        community: "Digital",
        measure: "Submitted",
        value: "4",
      },
    ]);
  });

  it("formats percentages without rescaling them", () => {
    const rate = rows.find(
      (row) =>
        row.metric === "Fulfillment rate" &&
        row.measure === "Fulfillment rate" &&
        row.community === "All communities",
    );

    expect(rate?.value).toBe("50.0%");
  });

  it("reports an absent value as unavailable rather than zero", () => {
    const finance = rows.find(
      (row) => row.community === "Finance" && row.measure === "Fulfillment rate",
    );
    const hires = rows.find(
      (row) => row.community === "Finance" && row.measure === "Hires",
    );

    expect(finance?.value).toBe("Not available");
    expect(hires?.value).toBe("0");
  });

  it("keeps an unrecorded non-hire reason distinct and reports both figures", () => {
    const nonHire = rows.filter(
      (row) => row.metric === "Reasons candidates were not hired",
    );

    expect(nonHire).toEqual([
      {
        metric: "Reasons candidates were not hired",
        community: "All communities",
        measure: "Lacks experience (candidates)",
        value: "2",
      },
      {
        metric: "Reasons candidates were not hired",
        community: "All communities",
        measure: "Lacks experience (share)",
        value: "40.0%",
      },
      {
        metric: "Reasons candidates were not hired",
        community: "All communities",
        measure: "Not recorded (candidates)",
        value: "1",
      },
      {
        metric: "Reasons candidates were not hired",
        community: "All communities",
        measure: "Not recorded (share)",
        value: "20.0%",
      },
    ]);
  });

  it("names the file after the snapshot date, not the download date", () => {
    // Late evening UTC, so a download-date stamp in a western timezone would
    // disagree with the snapshot this file actually contains.
    const fileName = getMetricsCsvFileName(intl, "2026-08-26T23:30:00.000000Z");

    expect(fileName).toBe(
      "gc_digital_talent_platform_metrics_2026_08_26.csv",
    );
    // No spaces or capitals to trip up shells and case-sensitive filesystems.
    expect(fileName).toBe(fileName.toLowerCase());
    expect(fileName).not.toContain(" ");
  });

  it("covers all six metrics", () => {
    expect(new Set(rows.map((row) => row.metric)).size).toBe(6);
  });
});
