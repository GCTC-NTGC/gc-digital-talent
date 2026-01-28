import { defineMessage, useIntl } from "react-intl";
import { useQuery } from "urql";
import { ReactNode } from "react";
import { tv } from "tailwind-variants";

import { CardFlat, Container, Flourish, Pending } from "@gc-digital-talent/ui";
import { useTheme } from "@gc-digital-talent/theme";
import { navigationMessages } from "@gc-digital-talent/i18n";
import {
  graphql,
  PoolStatus,
  PublishingGroup,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { useFeatureFlags } from "@gc-digital-talent/env";

import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import { wrapAbbr } from "~/utils/nameUtils";
import browseHeroImg from "~/assets/img/two-people-looking-at-laptop-with-coffee.webp";
import flourishTopLight from "~/assets/img/browse_top_light.webp";
import flourishBottomLight from "~/assets/img/browse_bottom_light.webp";
import flourishTopDark from "~/assets/img/browse_top_dark.webp";
import flourishBottomDark from "~/assets/img/browse_bottom_dark.webp";
import WfaBanner from "~/components/WfaBanner/WfaBanner";
import HolidayMessage from "~/components/HolidayMessage/HolidayMessage";

import ActiveRecruitmentSection from "./components/ActiveRecruitmentSection/ActiveRecruitmentSection";
import FooterCard from "./components/FooterCard/FooterCard";

const flourish = tv({
  base: "absolute z-[1] w-[25vw]",
  variants: {
    isTop: {
      true: "top-0 right-0",
      false: "bottom-0 left-0",
    },
  },
});

const BrowsePoolsPage_Query = graphql(/* GraphQL */ `
  query BrowsePoolsPage {
    poolsPaginated(
      where: { statuses: [PUBLISHED] }
      first: 500
      orderBy: { column: "closing_date", order: ASC }
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
        ...ActiveRecruitmentSectionPool
      }
    }
  }
`);

const subTitle = defineMessage({
  defaultMessage:
    "Find and apply to digital talent opportunities in the Government of Canada.",
  id: "2UDONd",
  description: "Subtitle for the browse IT jobs page",
});

export const Component = () => {
  const { mode } = useTheme();
  const intl = useIntl();
  const paths = useRoutes();
  const featureFlags = useFeatureFlags();

  const [{ data, fetching, error }] = useQuery({
    query: BrowsePoolsPage_Query,
  });

  const pools = unpackMaybes(data?.poolsPaginated?.data);
  const title = intl.formatMessage(navigationMessages.browseJobs);
  const formattedSubTitle = intl.formatMessage(subTitle);

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: title,
        url: paths.jobs(),
      },
    ],
  });

  const activeRecruitmentPools = pools.filter(
    (p) =>
      p.status?.value === PoolStatus.Published && // list jobs which have the PUBLISHED PoolStatus
      (p.publishingGroup?.value === PublishingGroup.ItJobs ||
        p.publishingGroup?.value === PublishingGroup.ExecutiveJobs),
  );

  // a different footer message is displayed if there are opportunities showing, otherwise a null state message is used
  const areOpportunitiesShowing = !!activeRecruitmentPools.length;

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
        <Container className="relative z-[2]">
          <WfaBanner />
          <ActiveRecruitmentSection poolsQuery={activeRecruitmentPools} />
          {!areOpportunitiesShowing && featureFlags.holidayMessage ? (
            <HolidayMessage />
          ) : (
            <FooterCard areOpportunitiesShowing={areOpportunitiesShowing} />
          )}
        </Container>
        <img
          alt=""
          src={mode === "dark" ? flourishBottomDark : flourishBottomLight}
          className={flourish({ isTop: false })}
        />
      </div>
      <div className="border-t border-t-black/50 bg-white py-18 text-black dark:border-t-white/50 dark:bg-gray-700 dark:text-white">
        <Container className="relative">
          <div className="grid gap-12 xs:grid-cols-2 xs:gap-18">
            <CardFlat
              color="secondary"
              title={intl.formatMessage(
                {
                  defaultMessage:
                    "Browse <abbreviation>IT</abbreviation> opportunities for the Indigenous community",
                  id: "drDPf3",
                  description:
                    "Title for Indigenous community job opportunities on Browse IT jobs page",
                },
                {
                  abbreviation: (text: ReactNode) => wrapAbbr(text, intl),
                },
              )}
              links={[
                {
                  href: `${paths.home()}/indigenous-it-apprentice`,
                  mode: "solid",
                  external: true,
                  label: intl.formatMessage({
                    defaultMessage:
                      "Apply<hidden> to the IT Apprenticeship Program for Indigenous Peoples</hidden> now",
                    description:
                      "Link text to go to IAP homepage on Browse IT jobs page",
                    id: "NSHPIJ",
                  }),
                },
              ]}
            >
              <p>
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "Designed by, with, and for the Indigenous community, the program recruits First Nations, Inuit, and Métis applicants who have a passion for <abbreviation>IT</abbreviation>, for entry level employment, learning and development opportunities.",
                    id: "OvL68O",
                    description:
                      "Summary for Indigenous community job opportunities on Browse IT jobs page",
                  },
                  {
                    abbreviation: (text: ReactNode) => wrapAbbr(text, intl),
                  },
                )}
              </p>
            </CardFlat>
            <CardFlat
              color="secondary"
              title={intl.formatMessage({
                defaultMessage: "Hire talent for your team",
                id: "jTN0bg",
                description:
                  "Title for to go to the search page on Browse IT jobs page",
              })}
              links={[
                {
                  href: paths.search(),
                  mode: "solid",
                  label: intl.formatMessage(navigationMessages.findTalent),
                },
              ]}
            >
              <p>
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "Let our team save you time and energy by matching your needs to pre-qualified <abbreviation>IT</abbreviation> professionals with the right skills for the job. All the talent in our pools has been qualified through a competitive process, so you can jump straight to the interview and decide if they are a good fit for your team.",
                    id: "6UVZOY",
                    description:
                      "Summary for to go to the search page on Browse IT jobs page",
                  },
                  {
                    abbreviation: (text: ReactNode) => wrapAbbr(text, intl),
                  },
                )}
              </p>
            </CardFlat>
          </div>
        </Container>
      </div>
      <Flourish />
    </Pending>
  );
};

Component.displayName = "BrowsePoolsPage";

export default Component;
