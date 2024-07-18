import { useEffect } from "react";
import { IntlShape, useIntl } from "react-intl";
import { Outlet } from "react-router-dom";
import { OperationContext, useQuery } from "urql";
import isString from "lodash/isString";

import {
  Pending,
  Chip,
  ThrowNotFound,
  useAnnouncer,
} from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
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
import AdminHero from "~/components/Hero/AdminHero";
import { PageNavInfo } from "~/types/pages";
import { getAssessmentPlanStatus } from "~/validators/pool/assessmentPlan";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

export const PoolLayout_Fragment = graphql(/* GraphQL */ `
  fragment PoolLayout on Pool {
    ...AssessmentPlanStatus
    id
    stream {
      value
      label {
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
    team {
      id
      name
      displayName {
        en
        fr
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
    stream: pool.stream,
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

  const pages = useAdminPoolPages(intl, pool);
  const currentPage = useCurrentPage<PageNavKeys>(pages);

  const subTitle = pool.team
    ? getLocalizedName(pool.team?.displayName, intl)
    : currentPage?.subtitle;

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
      <AdminHero
        title={heroTitleValue}
        subtitle={heroSubtitleValue}
        nav={
          // Pages with crumbs are sub-pages and don't show up as tabs
          currentPage?.crumbs
            ? {
                mode: "crumbs",
                items: currentPage.crumbs,
              }
            : {
                mode: "subNav",
                items: Array.from(pages.values())
                  .filter((page) => !page.crumbs)
                  .map((page) => ({
                    label: page.link.label ?? page.title,
                    url: page.link.url,
                  })),
              }
        }
        contentRight={
          (currentPage?.link.url.includes("edit") ||
            currentPage?.link.url.includes("plan")) &&
          badge.label && (
            <Chip color={badge.color} data-h2-flex-shrink="base(0)">
              {isString(badge.label)
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

type RouteParams = {
  poolId: string;
};

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
      ROLE_NAME.PoolOperator,
      ROLE_NAME.RequestResponder,
      ROLE_NAME.CommunityManager,
      ROLE_NAME.PlatformAdmin,
    ]}
  >
    <PoolLayout />
  </RequireAuth>
);

Component.displayName = "AdminPoolLayout";

export default PoolLayout;
