import { defineMessage, useIntl } from "react-intl";
import { OperationContext, useQuery } from "urql";
import { ReactNode } from "react";

import {
  commonMessages,
  errorMessages,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import {
  Link,
  NotFound,
  Pending,
  Separator,
  TableOfContents,
} from "@gc-digital-talent/ui";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";
import {
  FragmentType,
  getFragment,
  graphql,
  Scalars,
} from "@gc-digital-talent/graphql";
import { NotFoundError } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import SEO from "~/components/SEO/SEO";
import { routeErrorMessages } from "~/hooks/useErrorMessages";
import messages from "~/messages/adminMessages";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import OrganizeSection, {
  sectionTitle as organizeSectionTitle,
} from "./components/OrganizeSection";
import SkillSummarySection, {
  sectionTitle as skillSummarySectionTitle,
} from "./components/SkillSummarySection";
import { PAGE_SECTION_ID } from "./navigation";

const pageTitle = defineMessage(messages.assessmentPlan);

const pageSubtitle = defineMessage({
  defaultMessage:
    "Select, organize and define the assessments used to evaluate each skill in the advertisement.",
  id: "2ZjclP",
  description: "Subtitle for the assessment plan builder",
});

const context: Partial<OperationContext> = {
  additionalTypenames: ["AssessmentStep", "PoolSkill"],
};

const AssessmentPlanBuilderPool_Fragment = graphql(/* GraphQL */ `
  fragment AssessmentPlanBuilderPool on Pool {
    id
    ...OrganizeSectionPool
    ...SkillSummarySectionPool
    ...AssessmentPlanStatus
    poolSkills {
      id
      type {
        value
      }
      skill {
        id
        category {
          value
        }
        key
        name {
          en
          fr
        }
      }
    }
  }
`);

export interface AssessmentPlanBuilderProps {
  poolQuery: FragmentType<typeof AssessmentPlanBuilderPool_Fragment>;
  pageIsLoading: boolean;
}

export const AssessmentPlanBuilder = ({
  poolQuery,
  pageIsLoading,
}: AssessmentPlanBuilderProps) => {
  const intl = useIntl();
  const routes = useRoutes();
  const pool = getFragment(AssessmentPlanBuilderPool_Fragment, poolQuery);
  pool.poolSkills?.sort((a, b) => {
    const aName = getLocalizedName(a?.skill?.name, intl);
    const bName = getLocalizedName(b?.skill?.name, intl);
    return aName.localeCompare(bName);
  });

  return (
    <TableOfContents.Wrapper>
      <TableOfContents.Navigation>
        <TableOfContents.List>
          <TableOfContents.ListItem>
            <TableOfContents.AnchorLink
              id={PAGE_SECTION_ID.ORGANIZE_ASSESSMENT_APPROACH}
            >
              {intl.formatMessage(organizeSectionTitle)}
            </TableOfContents.AnchorLink>
          </TableOfContents.ListItem>
          <TableOfContents.ListItem>
            <TableOfContents.AnchorLink id={PAGE_SECTION_ID.SKILL_SUMMARY}>
              {intl.formatMessage(skillSummarySectionTitle)}
            </TableOfContents.AnchorLink>
          </TableOfContents.ListItem>
        </TableOfContents.List>
        <Link mode="solid" color="primary" href={routes.poolView(pool.id)}>
          {intl.formatMessage({
            defaultMessage: "Back to process details",
            id: "nPPUMW",
            description: "Link text to go back to the process details page",
          })}
        </Link>
      </TableOfContents.Navigation>

      <TableOfContents.Content>
        <OrganizeSection poolQuery={pool} pageIsLoading={pageIsLoading} />
        <SkillSummarySection poolQuery={pool} />
        <Separator space="lg" />
      </TableOfContents.Content>
    </TableOfContents.Wrapper>
  );
};

interface RouteParams extends Record<string, string> {
  poolId: Scalars["ID"]["output"];
}

const AssessmentPlanBuilderPage_Query = graphql(/* GraphQL */ `
  query AssessmentPlanBuilderPage($poolId: UUID!) {
    # the existing data of the pool to edit
    pool(id: $poolId) {
      ...AssessmentPlanBuilderPool
      community {
        teamIdForRoleAssignment
      }
      teamIdForRoleAssignment
    }
  }
`);

export const AssessmentPlanBuilderPage = () => {
  const intl = useIntl();
  const { poolId } = useRequiredParams<RouteParams>("poolId");
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
    throw new NotFoundError(notFoundMessage);
  }

  const [{ data: queryData, fetching: queryFetching, error: queryError }] =
    useQuery({
      query: AssessmentPlanBuilderPage_Query,
      variables: { poolId },
      context,
    });

  // RequireAuth in router can't check team roles
  const authorizedToSeeThePage: boolean =
    authorization.roleAssignments?.some(
      (authorizedRoleAssignment) =>
        (authorizedRoleAssignment.role?.name === ROLE_NAME.ProcessOperator &&
          authorizedRoleAssignment.team?.id ===
            queryData?.pool?.teamIdForRoleAssignment) ||
        (authorizedRoleAssignment.role?.name === ROLE_NAME.CommunityRecruiter &&
          authorizedRoleAssignment.team?.id ===
            queryData?.pool?.community?.teamIdForRoleAssignment) ||
        (authorizedRoleAssignment.role?.name === ROLE_NAME.CommunityAdmin &&
          authorizedRoleAssignment.team?.id ===
            queryData?.pool?.community?.teamIdForRoleAssignment) ||
        authorizedRoleAssignment.role?.name === ROLE_NAME.PlatformAdmin,
    ) ?? false;

  // figure out what content should be displayed
  const content = (): ReactNode => {
    if (queryData?.pool && authorizedToSeeThePage) {
      return (
        <AssessmentPlanBuilder
          poolQuery={queryData.pool}
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
    <>
      <SEO
        title={intl.formatMessage(pageTitle)}
        description={intl.formatMessage(pageSubtitle)}
      />
      <AdminContentWrapper>
        <Pending
          fetching={queryFetching || !authorization.isLoaded}
          error={queryError}
        >
          {content()}
        </Pending>
      </AdminContentWrapper>
    </>
  );
};

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.PlatformAdmin,
      ROLE_NAME.CommunityAdmin,
      ROLE_NAME.CommunityRecruiter,
      ROLE_NAME.ProcessOperator,
    ]}
  >
    <AssessmentPlanBuilderPage />
  </RequireAuth>
);

Component.displayName = "AdminAssessmentPlanBuilderPage";

export default Component;
