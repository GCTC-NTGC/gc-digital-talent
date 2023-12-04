import React from "react";
import { useIntl } from "react-intl";

import { CardFlat, Flourish, Pending } from "@gc-digital-talent/ui";
import { useTheme } from "@gc-digital-talent/theme";
import { useAuthentication } from "@gc-digital-talent/auth";
import { nowUTCDateTime } from "@gc-digital-talent/date-helpers";
import { useFeatureFlags } from "@gc-digital-talent/env";

import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";
import {
  PoolStatus,
  PublishingGroup,
  Pool,
  useBrowsePoolsQuery,
} from "~/api/generated";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import { wrapAbbr } from "~/utils/nameUtils";
import browseHeroImg from "~/assets/img/browse_header.webp";
import flourishTopLight from "~/assets/img/browse_top_light.webp";
import flourishBottomLight from "~/assets/img/browse_bottom_light.webp";
import flourishTopDark from "~/assets/img/browse_top_dark.webp";
import flourishBottomDark from "~/assets/img/browse_bottom_dark.webp";
import CallToActionCard from "~/components/CallToActionCard/CallToActionCard";

import OngoingRecruitmentSection from "./components/OngoingRecruitmentSection/OngoingRecruitmentSection";
import ActiveRecruitmentSection from "./components/ActiveRecruitmentSection/ActiveRecruitmentSection";

const getFlourishStyles = (isTop: boolean) => ({
  "data-h2-position": "base(absolute)",
  "data-h2-width": "base(25vw)",
  "data-h2-location": isTop
    ? "base(0, 0, auto, auto)"
    : "base(auto, auto, 0, 0)",
  "data-h2-z-index": "base(-1)",
});

export interface BrowsePoolsProps {
  pools: Pool[];
}

export const BrowsePools = ({ pools }: BrowsePoolsProps) => {
  const { mode } = useTheme();
  const intl = useIntl();
  const { loggedIn } = useAuthentication();
  const paths = useRoutes();
  const { executiveTeaser } = useFeatureFlags();

  const title = intl.formatMessage({
    defaultMessage: "Browse jobs",
    id: "8EFvJf",
    description: "Page title for the direct intake browse pools page.",
  });

  const crumbs = useBreadcrumbs([
    {
      label: title,
      url: paths.browsePools(),
    },
  ]);

  const activeRecruitmentPools = pools.filter(
    (p) =>
      p.status === PoolStatus.Published && // list jobs which have the PUBLISHED PoolStatus
      (p.publishingGroup === PublishingGroup.ItJobs ||
        p.publishingGroup === PublishingGroup.ExecutiveJobs),
  );

  const ongoingRecruitmentPools = pools.filter(
    (p) =>
      p.status === PoolStatus.Published && // list jobs which have the PUBLISHED PoolStatus
      p.publishingGroup === PublishingGroup.ItJobsOngoing, // and which are meant to be published on the IT Jobs page
  );

  // a different footer message is displayed if there are opportunities showing, otherwise a null state message is used
  const areOpportunitiesShowing =
    activeRecruitmentPools.length || ongoingRecruitmentPools.length;

  const profileLink = {
    href: loggedIn ? paths.myProfile() : paths.login(),
    label: loggedIn
      ? intl.formatMessage({
          defaultMessage: "Update my profile",
          id: "jfCwes",
          description:
            "Link text to direct users to the profile page when signed in",
        })
      : intl.formatMessage({
          defaultMessage: "Create a profile",
          id: "wPpvvm",
          description:
            "Link text to direct users to the profile page when anonymous",
        }),
  };

  return (
    <>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Browse jobs",
          id: "ApyEMy",
          description: "Title for the browse pools page",
        })}
      />
      <Hero
        imgPath={browseHeroImg}
        title={title}
        subtitle={intl.formatMessage({
          defaultMessage:
            "Find and apply to digital talent opportunities in the Government of Canada.",
          id: "2UDONd",
          description: "Subtitle for the browse IT jobs page",
        })}
        crumbs={crumbs}
      />

      <div
        data-h2-background-color="base(background)"
        data-h2-color="base(black)"
        data-h2-border-bottom="base(1px solid black.50)"
        data-h2-position="base(relative)"
        data-h2-padding="base(x3, 0)"
      >
        <img
          alt=""
          src={mode === "dark" ? flourishTopDark : flourishTopLight}
          {...getFlourishStyles(true)}
        />
        <div
          data-h2-position="base(relative)"
          data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
          style={{ zIndex: 1 }}
        >
          <div>
            <ActiveRecruitmentSection pools={activeRecruitmentPools} />
          </div>
          {executiveTeaser && (
            <CallToActionCard
              heading={intl.formatMessage({
                defaultMessage: "Executive (EX) process coming soon",
                id: "dFCH1c",
                description: "Heading for the teaser of executive processes",
              })}
              link={profileLink}
              data-h2-margin="base(x1, 0, 0, 0)"
            >
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Our first executive (EX) process for an EX-03 position will be published on the GC Digital Talent platform in November 2023. Check this space for an opportunity to submit your candidacy to be a digital leader in government.",
                  id: "3yg5j7",
                  description:
                    "Text describing upcoming executive opportunities instructing users to create a profile when anonymous",
                })}
              </p>
            </CallToActionCard>
          )}
          {ongoingRecruitmentPools.length > 0 && (
            <div>
              <OngoingRecruitmentSection pools={ongoingRecruitmentPools} />
            </div>
          )}
          {!executiveTeaser && (
            <CallToActionCard
              heading={
                areOpportunitiesShowing
                  ? intl.formatMessage({
                      defaultMessage: "More opportunities are coming soon!",
                      id: "g+JcDC",
                      description:
                        "Heading for message about upcoming opportunities",
                    })
                  : intl.formatMessage({
                      defaultMessage:
                        "No opportunities are available right now, but more are coming soon!",
                      id: "xHjgXz",
                      description:
                        "Text displayed when there are no pool advertisements to display",
                    })
              }
              link={profileLink}
              data-h2-margin="base(x1, 0, 0, 0)"
            >
              <p>
                {loggedIn
                  ? intl.formatMessage({
                      defaultMessage:
                        "We're posting new opportunities all the time. By keeping your profile up to date, you'll be able to submit applications lightning fast when the time comes.",
                      id: "9SZDCq",
                      description:
                        "Text describing upcoming opportunities instructing users to update a profile when signed in",
                    })
                  : intl.formatMessage({
                      defaultMessage:
                        "We're posting new opportunities all the time. By starting your profile now, you'll be able to submit applications lightning fast when the time comes.",
                      id: "3sbLPV",
                      description:
                        "Text describing upcoming opportunities instructing users to create a profile when anonymous",
                    })}
              </p>
            </CallToActionCard>
          )}
        </div>
        <img
          alt=""
          src={mode === "dark" ? flourishBottomDark : flourishBottomLight}
          {...getFlourishStyles(false)}
        />
      </div>
      <div
        data-h2-background-color="base(white) base:dark(white)"
        data-h2-color="base(black) base:dark(white)"
        data-h2-padding="base(x3, 0)"
      >
        <div
          data-h2-position="base(relative)"
          data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
        >
          <div
            data-h2-display="base(grid)"
            data-h2-grid-template-columns="base(1fr) p-tablet(repeat(2, minmax(0, 1fr)))"
            data-h2-gap="base(x2) p-tablet(x3)"
          >
            <CardFlat
              color="primary"
              title={intl.formatMessage(
                {
                  defaultMessage:
                    "Browse <abbreviation>IT</abbreviation> opportunities for the Indigenous community",
                  id: "drDPf3",
                  description:
                    "Title for Indigenous community job opportunities on Browse IT jobs page",
                },
                {
                  abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
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
                    abbreviation: (text: React.ReactNode) =>
                      wrapAbbr(text, intl),
                  },
                )}
              </p>
            </CardFlat>
            <CardFlat
              color="primary"
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
                  label: intl.formatMessage({
                    defaultMessage: "Find talent",
                    id: "7waBmC",
                    description:
                      "Link text to go to the search page on browse jobs page",
                  }),
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
                    abbreviation: (text: React.ReactNode) =>
                      wrapAbbr(text, intl),
                  },
                )}
              </p>
            </CardFlat>
          </div>
        </div>
      </div>
      <Flourish />
    </>
  );
};

const now = nowUTCDateTime();

const BrowsePoolsApi = () => {
  const [{ data, fetching, error }] = useBrowsePoolsQuery({
    variables: { closingAfter: now }, // pass current dateTime into query argument
  });

  const filteredPools = data?.publishedPools.filter(
    (pool) => typeof pool !== `undefined` && !!pool,
  ) as Pool[];

  return (
    <Pending fetching={fetching} error={error}>
      <BrowsePools pools={filteredPools} />
    </Pending>
  );
};

export default BrowsePoolsApi;
