import { defineMessage, useIntl } from "react-intl";
import { useQuery } from "urql";
import { tv } from "tailwind-variants";

import { Container, Flourish, Pending } from "@gc-digital-talent/ui";
import { useTheme } from "@gc-digital-talent/theme";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { graphql, PoolStatus } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import browseHeroImg from "~/assets/img/two-people-looking-at-laptop-with-coffee.webp";
import flourishTopLight from "~/assets/img/browse_top_light.webp";
import flourishBottomLight from "~/assets/img/browse_bottom_light.webp";
import flourishTopDark from "~/assets/img/browse_top_dark.webp";
import flourishBottomDark from "~/assets/img/browse_bottom_dark.webp";

import ClosedJobOpportunitiesSection from "./components/ClosedJobOpportunitiesSection/ClosedJobOpportunitiesSection";
import FooterCard from "./components/FooterCard/FooterCard";
import { canShowOnBrowseJobs } from "./utils";
import ConversionFeatures from "./components/ConversionFeatures/ConversionFeatures";

const flourish = tv({
  base: "absolute z-1 w-[25vw]",
  variants: {
    isTop: {
      true: "top-0 right-0",
      false: "bottom-0 left-0",
    },
  },
});
const ClosedJobsPage_Query = graphql(/* GraphQL */ `
  query ClosedJobsPage {
    poolsPaginated(
      where: { statuses: [CLOSED] }
      first: 500
      orderBy: { column: "closing_date", order: DESC }
    ) {
      data {
        id
        publishingGroup {
          value
          label {
            en
            fr
          }
        }
        status {
          value
          label {
            en
            fr
          }
        }
        ...ClosedJobOpportunitiesSectionPool
      }
    }
  }
`);

const subTitle = defineMessage({
  defaultMessage: "Browse and apply to jobs in the Government of Canada",
  id: "IwVHgf",
  description: "Subtitle for the browse jobs page",
});

export const Component = () => {
  const { mode } = useTheme();
  const intl = useIntl();
  const paths = useRoutes();

  const [{ data, fetching, error }] = useQuery({
    query: ClosedJobsPage_Query,
  });

  const pools = unpackMaybes(data?.poolsPaginated?.data);
  const title = intl.formatMessage(navigationMessages.browseJobs);
  const formattedSubTitle = intl.formatMessage(subTitle);

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: title,
        url: paths.closedJobs(),
      },
    ],
  });

  const closedPools = pools.filter(
    (p) =>
      p.status?.value === PoolStatus.Closed && // list jobs which have the PUBLISHED PoolStatus
      canShowOnBrowseJobs(p),
  );
  // a different footer message is displayed if there are opportunities showing, otherwise a null state message is used
  const areOpportunitiesShowing = !!closedPools.length;

  return (
    <Pending fetching={fetching} error={error}>
      <SEO title={title} description={formattedSubTitle} />
      <Hero
        imgPath={browseHeroImg}
        title={title}
        subtitle={formattedSubTitle}
        crumbs={crumbs}
      />

      <div className="relative overflow-hidden py-18">
        <img
          alt=""
          src={mode === "dark" ? flourishTopDark : flourishTopLight}
          className={flourish({ isTop: true })}
        />
        <Container className="relative z-2">
          <ClosedJobOpportunitiesSection poolsQuery={closedPools} />
          <FooterCard areOpportunitiesShowing={areOpportunitiesShowing} />
        </Container>
        <img
          alt=""
          src={mode === "dark" ? flourishBottomDark : flourishBottomLight}
          className={flourish({ isTop: false })}
        />
      </div>
      <ConversionFeatures />
      <Flourish />
    </Pending>
  );
};

Component.displayName = "ClosedJobsPage";

export default Component;
