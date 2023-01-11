import React from "react";
import { useIntl } from "react-intl";
import { CardFlat } from "@common/components/Card";
import Flourish from "@common/components/Flourish";
import Hero from "@common/components/Hero";
import Heading from "@common/components/Heading";
import Link from "@common/components/Link";
import Pending from "@common/components/Pending";
import SEO from "@common/components/SEO/SEO";
import imageUrl from "@common/helpers/imageUrl";
import useTheme from "@common/hooks/useTheme";
import useFeatureFlags from "@common/hooks/useFeatureFlags";
import { AuthenticationContext } from "@common/components/Auth";
import {
  AdvertisementStatus,
  PublishingGroup,
  PoolAdvertisement,
  useBrowsePoolAdvertisementsQuery,
} from "../../api/generated";
import TALENTSEARCH_APP_DIR from "../../talentSearchConstants";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import useRoutes from "../../hooks/useRoutes";
import { ActiveRecruitmentSection } from "./ActiveRecruitmentSection";
import { OngoingRecruitmentSection } from "./OngoingRecruitmentSection";

const flourishTopLight = imageUrl(TALENTSEARCH_APP_DIR, "browse_top_light.png");
const flourishBottomLight = imageUrl(
  TALENTSEARCH_APP_DIR,
  "browse_bottom_light.png",
);
const flourishTopDark = imageUrl(TALENTSEARCH_APP_DIR, "browse_top_dark.png");
const flourishBottomDark = imageUrl(
  TALENTSEARCH_APP_DIR,
  "browse_bottom_dark.png",
);

const getFlourishStyles = (isTop: boolean) => ({
  "data-h2-position": "base(absolute)",
  "data-h2-width": "base(25vw)",
  "data-h2-location": isTop
    ? "base(0, 0, auto, auto)"
    : "base(auto, auto, 0, 0)",
  "data-h2-z-index": "base(-1)",
});

export interface BrowsePoolsProps {
  poolAdvertisements: PoolAdvertisement[];
}

export const BrowsePools: React.FC<BrowsePoolsProps> = ({
  poolAdvertisements,
}) => {
  const { mode } = useTheme();
  const intl = useIntl();
  const { loggedIn } = React.useContext(AuthenticationContext);
  const paths = useRoutes();
  const featureFlags = useFeatureFlags();

  const title = intl.formatMessage({
    defaultMessage: "Browse IT jobs",
    id: "J2WrFI",
    description: "Page title for the direct intake browse pools page.",
  });

  const crumbs = useBreadcrumbs([
    {
      label: title,
      url: paths.allPools(),
    },
  ]);

  const activeRecruitmentPools = poolAdvertisements.filter(
    (p) =>
      p.advertisementStatus === AdvertisementStatus.Published && // list jobs which have the PUBLISHED AdvertisementStatus
      p.publishingGroup === PublishingGroup.ItJobs, // and which are meant to be published on the IT Jobs page
  );

  const ongoingRecruitmentPools = poolAdvertisements.filter(
    (p) =>
      p.advertisementStatus === AdvertisementStatus.Published && // list jobs which have the PUBLISHED AdvertisementStatus
      p.publishingGroup === PublishingGroup.ItJobsOngoing, // and which are meant to be published on the IT Jobs page
  );

  // a different footer message is displayed if there are opportunities showing, otherwise a null state message is used
  const areOpportunitiesShowing = featureFlags.ongoingRecruitments
    ? activeRecruitmentPools.length || ongoingRecruitmentPools.length
    : activeRecruitmentPools.length;

  return (
    <>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Browse opportunities",
          id: "1To4Kg",
          description: "Title for the browse pools page",
        })}
      />
      <Hero
        imgPath={imageUrl(TALENTSEARCH_APP_DIR, "browse_header.jpg")}
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
        data-h2-background-color="base(black.03) base:dark(black.90)"
        data-h2-color="base(black) base:dark(white)"
        data-h2-border-bottom="base(1px solid black.50)"
        data-h2-position="base(relative)"
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
          <div data-h2-padding="base(x3, 0, 0, 0) p-tablet(x4, 0, 0, 0)">
            <ActiveRecruitmentSection pools={activeRecruitmentPools} />
          </div>
          {featureFlags.ongoingRecruitments && (
            <div data-h2-padding="base(x3, 0, 0, 0) p-tablet(x4, 0, 0, 0)">
              <OngoingRecruitmentSection pools={ongoingRecruitmentPools} />
            </div>
          )}
          <div data-h2-padding="base(x3, 0) p-tablet(x4, 0)">
            <div
              data-h2-background-color="base(white) base:dark(black.light)"
              data-h2-color="base(black) base:dark(white)"
              data-h2-shadow="base(large)"
              data-h2-padding="base(x1) p-tablet(x2)"
              data-h2-radius="base(rounded)"
            >
              <div
                data-h2-display="p-tablet(flex)"
                data-h2-gap="base(x3)"
                data-h2-align-items="base(center)"
              >
                <div>
                  <Heading
                    level="h3"
                    size="h6"
                    data-h2-margin="base(0, 0, x1, 0)"
                  >
                    {areOpportunitiesShowing
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
                        })}
                  </Heading>
                  <p>
                    {loggedIn
                      ? intl.formatMessage({
                          defaultMessage:
                            "We're posting new opportunities all the time. By keeping your profile up to date, you'll be able to submit applications lightning fast when the time comes.",
                          id: "Jorewd",
                          description:
                            "Text describing upcoming opportunities instructing users to update a profile when logged in",
                        })
                      : intl.formatMessage({
                          defaultMessage:
                            "We're posting new opportunities all the time. By starting your profile now, you'll be able to submit applications lightning fast when the time comes.",
                          id: "3sbLPV",
                          description:
                            "Text describing upcoming opportunities instructing users to create a profile when anonymous",
                        })}
                  </p>
                </div>
                <div data-h2-margin="base(x1, 0, 0, 0) p-tablet(0)">
                  <Link
                    color="blue"
                    mode="outline"
                    type="button"
                    weight="bold"
                    href={paths.myProfile()}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {loggedIn
                      ? intl.formatMessage({
                          defaultMessage: "Update my profile",
                          id: "/vsOxF",
                          description:
                            "Link text to direct users to the profile page when logged in",
                        })
                      : intl.formatMessage({
                          defaultMessage: "Create a profile",
                          id: "wPpvvm",
                          description:
                            "Link text to direct users to the profile page when anonymous",
                        })}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <img
          alt=""
          src={mode === "dark" ? flourishBottomDark : flourishBottomLight}
          {...getFlourishStyles(false)}
        />
      </div>
      <div
        data-h2-background-color="base:dark(black.light)"
        data-h2-color="base(black) base:dark(white)"
        data-h2-padding="base(x3, 0) p-tablet(x4, 0) l-tablet(x6, 0)"
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
              color="purple"
              title={intl.formatMessage({
                defaultMessage:
                  "Browse IT opportunities for the Indigenous community",
                id: "GZrICV",
                description:
                  "Title for Indigenous community job opportunities on Browse IT jobs page",
              })}
              link={{
                href: `${paths.home()}/indigenous-it-apprentice`,
                mode: "outline",
                external: true,
                label: intl.formatMessage({
                  defaultMessage:
                    "Apply<hidden> to the Indigenous Apprenticeship Program</hidden> now",
                  description:
                    "Link text to go to IAP homepage on Browse IT jobs page",
                  id: "07BM9O",
                }),
              }}
            >
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Designed by, with, and for the Indigenous community, the program recruits First Nations, Inuit, and Métis applicants who have a passion for IT, for entry level employment, learning and development opportunities.",
                  id: "+6QgII",
                  description:
                    "Summary for Indigenous community job opportunities on Browse IT jobs page",
                })}
              </p>
            </CardFlat>
            <CardFlat
              color="purple"
              title={intl.formatMessage({
                defaultMessage: "Hire talent for your team",
                id: "jTN0bg",
                description:
                  "Title for to go to the search page on Browse IT jobs page",
              })}
              link={{
                href: paths.search(),
                mode: "outline",
                label: intl.formatMessage({
                  defaultMessage: "Visit the talent search page",
                  id: "BhfG7a",
                  description:
                    "Link text to go to the search page on browse IT jobs page",
                }),
              }}
            >
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Let our team save you time and energy by matching your needs to pre-qualified IT professionals with the right skills for the job. All the talent in our pools has been qualified through a competitive process, so you can jump straight to the interview and decide if they are a good fit for your team.",
                  id: "Ms6O4W",
                  description:
                    "Summary for to go to the search page on Browse IT jobs page",
                })}
              </p>
            </CardFlat>
          </div>
        </div>
      </div>
      <Flourish />
    </>
  );
};

const BrowsePoolsApi: React.FC = () => {
  const [{ data, fetching, error }] = useBrowsePoolAdvertisementsQuery();

  const filteredPoolAdvertisements = data?.publishedPoolAdvertisements.filter(
    (poolAdvertisement) =>
      typeof poolAdvertisement !== undefined && !!poolAdvertisement,
  ) as PoolAdvertisement[];

  return (
    <Pending fetching={fetching} error={error}>
      <BrowsePools poolAdvertisements={filteredPoolAdvertisements} />
    </Pending>
  );
};

export default BrowsePoolsApi;
