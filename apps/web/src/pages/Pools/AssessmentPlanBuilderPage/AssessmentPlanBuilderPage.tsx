import * as React from "react";
import { defineMessage, useIntl } from "react-intl";
import ClipboardDocumentListIcon from "@heroicons/react/24/outline/ClipboardDocumentListIcon";

import {
  commonMessages,
  errorMessages,
  formMessages,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import {
  Heading,
  Link,
  NotFound,
  Pending,
  Pill,
  Separator,
  Sidebar,
} from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";

import {
  Scalars,
  GetAssessmentPlanBuilderDataQuery,
  useGetAssessmentPlanBuilderDataQuery,
} from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import { pageTitle as indexPoolPageTitle } from "~/pages/Pools/IndexPoolPage/IndexPoolPage";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import SEO from "~/components/SEO/SEO";
import { routeErrorMessages } from "~/hooks/useErrorMessages";
import { getAssessmentPlanStatus } from "~/validators/pool/assessmentPlan";
import { getPoolCompletenessBadge } from "~/utils/poolUtils";

import OrganizeSection from "./components/OrganizeSection";
import SkillSummarySection from "./components/SkillSummarySection";
import SkillsQuickSummary from "./components/SkillsQuickSummary";

const pageTitle = defineMessage({
  defaultMessage: "Assessment plan",
  id: "fkYYe3",
  description: "Title for the assessment plan builder",
});

const pageSubtitle = defineMessage({
  defaultMessage:
    "Select, organize and define the assessments used to evaluate each skill in the advertisement. Make sure every skill is assessed at least once to complete your assessment plan.",
  id: "SSZY5w",
  description: "Subtitle for the assessment plan builder",
});
export interface AssessmentPlanBuilderProps {
  pool: NonNullable<GetAssessmentPlanBuilderDataQuery["pool"]>;
  pageIsLoading: boolean;
}

export const AssessmentPlanBuilder = ({
  pool,
  pageIsLoading,
}: AssessmentPlanBuilderProps) => {
  const intl = useIntl();
  const routes = useRoutes();
  pool.poolSkills?.sort((a, b) => {
    const aName = getLocalizedName(a?.skill?.name, intl);
    const bName = getLocalizedName(b?.skill?.name, intl);
    return aName.localeCompare(bName);
  });

  const assessmentStatus = getAssessmentPlanStatus(pool);
  const assessmentBadge = getPoolCompletenessBadge(assessmentStatus);

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
          <Pill
            bold
            mode="outline"
            color={assessmentBadge.color}
            data-h2-flex-shrink="base(0)"
          >
            {intl.formatMessage(assessmentBadge.label)}
          </Pill>
        </Heading>
        <p data-h2-margin="base(x1 0)">{intl.formatMessage(pageSubtitle)}</p>
        <Separator
          orientation="horizontal"
          decorative
          data-h2-background-color="base(gray)"
          data-h2-margin="base(x2, 0, x1, 0)"
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
            <OrganizeSection pool={pool} pageIsLoading={pageIsLoading} />
            <SkillSummarySection pool={pool} />
            <Separator
              orientation="horizontal"
              decorative
              data-h2-background-color="base(gray)"
              data-h2-margin="base(x3 0)"
            />
            <div
              data-h2-display="base(flex)"
              data-h2-gap="base(x.5, x1)"
              data-h2-flex-wrap="base(wrap)"
              data-h2-flex-direction="base(column) l-tablet(row)"
              data-h2-align-items="base(flex-start) l-tablet(center)"
            >
              <Link
                mode="solid"
                color="secondary"
                href={routes.poolView(pool.id)}
              >
                {/* Doesn't actually save anything */}
                {intl.formatMessage({
                  defaultMessage: "Save plan and go back",
                  id: "Rbp02p",
                  description:
                    "Text on a button to save the assessment plan and return to the pool page",
                })}
              </Link>
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
  const { poolId } = useRequiredParams<RouteParams>("poolId");
  const routes = useRoutes();
  const authorization = useAuthorization();

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
      variables: { poolId },
    });

  // Note: Should technically be in subNav of layout?
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      label: intl.formatMessage(indexPoolPageTitle),
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

  // RequireAuth in router can't check team roles
  const authorizedToSeeThePage: boolean =
    authorization.roleAssignments?.some(
      (authorizedRoleAssignment) =>
        (authorizedRoleAssignment.role?.name === ROLE_NAME.PoolOperator &&
          authorizedRoleAssignment.team?.name ===
            queryData?.pool?.team?.name) ||
        authorizedRoleAssignment.role?.name === ROLE_NAME.CommunityManager ||
        authorizedRoleAssignment.role?.name === ROLE_NAME.PlatformAdmin,
    ) ?? false;

  // figure out what content should be displayed
  const content = (): React.ReactNode => {
    if (queryData?.pool && authorizedToSeeThePage) {
      return (
        <AssessmentPlanBuilder
          pool={queryData.pool}
          pageIsLoading={queryFetching}
        />
      );
    }
    if (!queryData?.pool) {
      return (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
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
      );
    }
    if (!authorizedToSeeThePage) {
      // reuse error from routing errors
      return intl.formatMessage(routeErrorMessages.unauthorizedTitle);
    }

    // shouldn't drop through to this
    return intl.formatMessage(errorMessages.unknown);
  };

  return (
    <AdminContentWrapper>
      <Pending
        fetching={queryFetching || !authorization.isLoaded}
        error={queryError}
      >
        {content()}
      </Pending>
    </AdminContentWrapper>
  );
};

export default AssessmentPlanBuilderPage;
