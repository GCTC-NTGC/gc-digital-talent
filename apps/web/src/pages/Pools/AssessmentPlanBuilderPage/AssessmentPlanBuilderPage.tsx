import * as React from "react";
import { useParams } from "react-router-dom";
import { useIntl } from "react-intl";
import ClipboardDocumentListIcon from "@heroicons/react/24/outline/ClipboardDocumentListIcon";

import { Scalars } from "@gc-digital-talent/graphql";
import {
  commonMessages,
  formMessages,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import {
  Heading,
  Link,
  NotFound,
  Pending,
  Separator,
  Sidebar,
} from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";
import adminMessages from "~/messages/adminMessages";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import {
  GetAssessmentPlanBuilderDataQuery,
  useGetAssessmentPlanBuilderDataQuery,
} from "~/api/generated";
import SEO from "~/components/SEO/SEO";

import OrganizeSection from "./components/OrganizeSection";
import SkillSummarySection from "./components/SkillSummarySection";
import { getAssessmentPlanStatusPill } from "./utils";
import SkillsQuickSummary from "./components/SkillsQuickSummary";

const pageTitle = {
  defaultMessage: "Assessment plan",
  id: "fkYYe3",
  description: "Title for the assessment plan builder",
};

const pageSubtitle = {
  defaultMessage:
    "Select, organize and define the assessments used to evaluate each skill in the advertisement. Make sure every skill is assessed at least once to complete your assessment plan.",
  id: "SSZY5w",
  description: "Subtitle for the assessment plan builder",
};
export interface AssessmentPlanBuilderProps {
  pool: NonNullable<GetAssessmentPlanBuilderDataQuery["pool"]>;
}

export const AssessmentPlanBuilder = ({ pool }: AssessmentPlanBuilderProps) => {
  const intl = useIntl();
  const routes = useRoutes();

  return (
    <>
      <SEO
        title={intl.formatMessage(pageTitle)}
        description={intl.formatMessage(pageSubtitle)}
      />
      <div data-h2-container="base(center, full, 0)">
        <Heading level="h2" Icon={ClipboardDocumentListIcon} color="primary">
          {intl.formatMessage(pageTitle)}
          <div data-h2-flex-grow="base(2)" />
          {getAssessmentPlanStatusPill(pool, intl)}
        </Heading>
        <p data-h2-margin="base(x1 0)">{intl.formatMessage(pageSubtitle)}</p>
        <Separator
          orientation="horizontal"
          decorative
          data-h2-background-color="base(gray.lighter)"
          data-h2-margin="base(x1 0)"
        />
        <Sidebar.Wrapper>
          <Sidebar.Sidebar>
            <div data-h2-margin-top="base(x1.5)">
              <SkillsQuickSummary
                poolSkills={pool.poolSkills?.filter(notEmpty) ?? []}
                assessmentSteps={pool.assessmentSteps?.filter(notEmpty) ?? []}
              />
            </div>
          </Sidebar.Sidebar>
          <Sidebar.Content>
            <OrganizeSection pool={pool} />
            <SkillSummarySection pool={pool} />
            <Separator
              orientation="horizontal"
              decorative
              data-h2-background-color="base(gray.lighter)"
              data-h2-margin="base(x1 0)"
            />
            <div
              data-h2-display="base(flex)"
              data-h2-gap="base(x.5, x1)"
              data-h2-flex-wrap="base(wrap)"
              data-h2-flex-direction="base(column) l-tablet(row)"
              data-h2-align-items="base(flex-start) l-tablet(center)"
            >
              {/* TODO: switch to submit button */}
              {intl.formatMessage({
                defaultMessage: "Save plan and go back",
                id: "Rbp02p",
                description:
                  "Text on a button to save the assessment plan and return to the pool page",
              })}
              <Link
                type="button"
                mode="inline"
                color="primary"
                href={routes.poolView(pool.id)}
              >
                {intl.formatMessage(formMessages.cancelGoBack)}
              </Link>
            </div>
          </Sidebar.Content>
        </Sidebar.Wrapper>
      </div>
    </>
  );
};

type RouteParams = {
  poolId: Scalars["ID"];
};

export const AssessmentPlanBuilderPage = () => {
  const intl = useIntl();
  const { poolId } = useParams<RouteParams>();
  const routes = useRoutes();

  const notFoundMessage = intl.formatMessage(
    {
      defaultMessage: "Pool {poolId} not found.",
      id: "Sb2fEr",
      description: "Message displayed for pool not found.",
    },
    { poolId },
  );

  if (!poolId) {
    throw new Response(notFoundMessage, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const [{ data: queryData, fetching: queryFetching, error: queryError }] =
    useGetAssessmentPlanBuilderDataQuery({
      variables: { poolId: poolId || "" },
    });

  const navigationCrumbs = [
    {
      label: intl.formatMessage({
        defaultMessage: "Home",
        id: "EBmWyo",
        description: "Link text for the home link in breadcrumbs.",
      }),
      url: routes.adminDashboard(),
    },
    {
      label: intl.formatMessage(adminMessages.pools),
      url: routes.poolTable(),
    },
    {
      label: getLocalizedName(queryData?.pool?.name, intl),
      url: routes.poolView(poolId),
    },
    {
      label: intl.formatMessage(pageTitle),
      url: routes.assessmentPlanBuilder(poolId),
    },
  ];

  return (
    <AdminContentWrapper crumbs={navigationCrumbs}>
      <Pending fetching={queryFetching} error={queryError}>
        {queryData?.pool ? (
          <AssessmentPlanBuilder pool={queryData.pool} />
        ) : (
          <NotFound
            headingMessage={intl.formatMessage(commonMessages.notFound)}
          >
            <p>
              {intl.formatMessage(
                {
                  defaultMessage: "Pool {poolId} not found.",
                  id: "Sb2fEr",
                  description: "Message displayed for pool not found.",
                },
                { poolId },
              )}
            </p>
          </NotFound>
        )}
      </Pending>
    </AdminContentWrapper>
  );
};

export default AssessmentPlanBuilderPage;
