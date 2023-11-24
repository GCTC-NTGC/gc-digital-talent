import React from "react";
import { useIntl } from "react-intl";
import { Outlet } from "react-router-dom";

import { ThrowNotFound, Pending } from "@gc-digital-talent/ui";
import { Pool } from "@gc-digital-talent/graphql";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import SEO from "~/components/SEO/SEO";
import PageHeader from "~/components/PageHeader";
import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import { useGetAssessmentEvaluationPoolInfoQuery } from "~/api/generated";
import { PageNavInfo } from "~/types/pages";
import { getFullPoolTitleLabel } from "~/utils/poolUtils";

type PageNavKeys = "process" | "screening" | "candidates";

interface AssessmentEvaluationHeaderProps {
  pool: Pool;
}

const AssessmentEvaluationHeader = ({
  pool,
}: AssessmentEvaluationHeaderProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const pages = new Map<PageNavKeys, PageNavInfo>([
    [
      "process",
      {
        title: intl.formatMessage({
          defaultMessage: "Process information",
          id: "R5sGKY",
          description: "Title for the pool info page",
        }),
        link: {
          url: "#",
        },
      },
    ],
    [
      "screening",
      {
        title: intl.formatMessage({
          defaultMessage: "Screening and evaluation",
          id: "l+5AnB",
          description: "Title for the screening page",
        }),
        link: {
          url: paths.screeningAndEvaluation(pool.id),
        },
      },
    ],
    [
      "candidates",
      {
        title: intl.formatMessage({
          defaultMessage: "Qualified candidates",
          id: "pgm0uZ",
          description: "Title for the qualified candidates page",
        }),
        link: {
          url: "#",
        },
      },
    ],
  ]);

  const poolName = getFullPoolTitleLabel(intl, pool);
  const teamName = getLocalizedName(pool.team?.displayName, intl);

  return (
    <>
      <SEO title={poolName} />
      <PageHeader subtitle={teamName} navItems={pages}>
        {poolName}
      </PageHeader>
    </>
  );
};

type RouteParams = {
  poolId: string;
};

const AssessmentEvaluationLayout = () => {
  const { poolId } = useRequiredParams<RouteParams>("poolId");
  const [{ data, fetching, error }] = useGetAssessmentEvaluationPoolInfoQuery({
    variables: {
      poolId: poolId || "",
    },
  });

  return (
    <>
      {/* This is above the AdminContentWrapper so it needs its own centering */}
      <div data-h2-container="base(center, full, x2)">
        <Pending fetching={fetching} error={error}>
          {data?.pool ? (
            <AssessmentEvaluationHeader pool={data.pool} />
          ) : (
            <ThrowNotFound />
          )}
        </Pending>
      </div>
      <Outlet />
    </>
  );
};

export default AssessmentEvaluationLayout;
