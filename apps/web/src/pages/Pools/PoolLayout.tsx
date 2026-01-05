import { useEffect } from "react";
import { IntlShape, useIntl } from "react-intl";
import { Outlet } from "react-router";
import { OperationContext, useQuery } from "urql";

import {
  Pending,
  Chip,
  ThrowNotFound,
  useAnnouncer,
} from "@gc-digital-talent/ui";
import {
  FragmentType,
  PoolLayoutFragment,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import useCurrentPage from "~/hooks/useCurrentPage";
import {
  getAdvertisementStatus,
  getPoolCompletenessBadge,
  getShortPoolTitleLabel,
  useAdminPoolPages,
} from "~/utils/poolUtils";
import { PageNavKeys } from "~/types/pool";
import useRequiredParams from "~/hooks/useRequiredParams";
import { PageNavInfo } from "~/types/pages";
import { getAssessmentPlanStatus } from "~/validators/pool/assessmentPlan";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import Hero from "~/components/Hero";

export const PoolLayout_Fragment = graphql(/* GraphQL */ `
  fragment PoolLayout on Pool {
    ...AssessmentPlanStatus
    id
    workStream {
      id
      name {
        en
        fr
      }
    }
    publishingGroup {
      value
      label {
        en
        fr
      }
    }
    publishedAt
    isComplete
    name {
      en
      fr
    }
    community {
      name {
        localized
      }
    }
    classification {
      id
      group
      level
      name {
        en
        fr
      }
    }
  }
`);

interface HeroTitleProps {
  currentPage: PageNavInfo | undefined;
  intl: IntlShape;
  pool: PoolLayoutFragment;
}

const heroTitle = ({ currentPage, intl, pool }: HeroTitleProps) => {
  if (currentPage?.link.url.includes("edit")) {
    return currentPage?.title;
  }
  if (currentPage?.link.url.includes("plan")) {
    return currentPage?.title;
  }
  return getShortPoolTitleLabel(intl, {
    workStream: pool.workStream,
    name: pool.name,
    publishingGroup: pool.publishingGroup,
    classification: pool.classification,
  });
};

interface HeroSubtitleProps {
  currentPage: PageNavInfo | undefined;
  subTitle: string | undefined;
}

const heroSubtitle = ({ currentPage, subTitle }: HeroSubtitleProps) => {
  if (currentPage?.link.url.includes("edit")) {
    return currentPage?.subtitle;
  }
  if (currentPage?.link.url.includes("plan")) {
    return currentPage?.subtitle;
  }
  return subTitle;
};

interface PoolHeaderProps {
  poolQuery: FragmentType<typeof PoolLayout_Fragment>;
}

const PoolHeader = ({ poolQuery }: PoolHeaderProps) => {
  const intl = useIntl();
  const { announce } = useAnnouncer();
  const pool = getFragment(PoolLayout_Fragment, poolQuery);

  const pages = useAdminPoolPages(intl, {
    id: pool.id,
    name: pool.name,
    publishingGroup: pool.publishingGroup,
    workStream: pool.workStream,
    classification: pool.classification,
  });
  const currentPage = useCurrentPage<PageNavKeys>(pages);

  const subTitle = pool.community?.name?.localized ?? currentPage?.subtitle;

  const heroTitleValue = heroTitle({ currentPage, intl, pool });
  const heroSubtitleValue = heroSubtitle({ currentPage, subTitle });

  const status = currentPage?.link.url.includes("plan")
    ? getAssessmentPlanStatus(pool)
    : getAdvertisementStatus(pool);
  const badge = getPoolCompletenessBadge(status);

  useEffect(() => {
    if (currentPage?.title) {
      announce(currentPage?.title);
    }
  }, [announce, currentPage?.title, intl]);

  return (
    <>
      <SEO title={currentPage?.title} description={subTitle} />
      <Hero
        title={heroTitleValue}
        subtitle={heroSubtitleValue}
        crumbs={currentPage?.crumbs ?? undefined}
        navTabs={
          !currentPage?.crumbs
            ? Array.from(pages.values())
                .filter((page) => !page.crumbs)
                .map((page) => ({
                  label: page.link.label ?? page.title,
                  url: page.link.url,
                }))
            : undefined
        }
        status={
          (currentPage?.link.url.includes("edit") ||
            currentPage?.link.url.includes("plan")) &&
          badge.label && (
            <Chip color={badge.color} className="shrink-0">
              {typeof badge.label === "string"
                ? badge.label
                : intl.formatMessage(badge.label)}
            </Chip>
          )
        }
      />
    </>
  );
};

const context: Partial<OperationContext> = {
  additionalTypenames: ["AssessmentStep", "PoolSkill"],
};

const PoolLayout_Query = graphql(/* GraphQL */ `
  query PoolLayout($poolId: UUID!) {
    pool(id: $poolId) {
      ...PoolLayout
    }
  }
`);

interface RouteParams extends Record<string, string> {
  poolId: string;
}

const PoolLayout = () => {
  const { poolId } = useRequiredParams<RouteParams>("poolId");
  const [{ data, fetching, error }] = useQuery({
    query: PoolLayout_Query,
    variables: {
      poolId,
    },
    context,
  });

  return (
    <>
      <Pending fetching={fetching} error={error}>
        {data?.pool ? <PoolHeader poolQuery={data.pool} /> : <ThrowNotFound />}
      </Pending>
      <Outlet />
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
    <PoolLayout />
  </RequireAuth>
);

Component.displayName = "AdminPoolLayout";

export default Component;
