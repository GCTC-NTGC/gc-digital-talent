import React from "react";
import { RocketLaunchIcon } from "@heroicons/react/24/outline";
import { useIntl } from "react-intl";

import { CardFlat } from "@common/components/Card";
import Flourish from "@common/components/Flourish";
import Hero from "@common/components/Hero";
import Heading from "@common/components/Heading";
import Link from "@common/components/Link";
import Pending from "@common/components/Pending";
import NotFound from "@common/components/NotFound";

import { commonMessages } from "@common/messages";
import { imageUrl } from "@common/helpers/router";
import useTheme from "@common/hooks/useTheme";

import PoolCard from "./PoolCard";

import {
  AdvertisementStatus,
  PublishingGroup,
  PoolAdvertisement,
  useBrowsePoolAdvertisementsQuery,
} from "../../api/generated";
import TALENTSEARCH_APP_DIR from "../../talentSearchConstants";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useDirectIntakeRoutes } from "../../directIntakeRoutes";
import { useApplicantProfileRoutes } from "../../applicantProfileRoutes";
import { useTalentSearchRoutes } from "../../talentSearchRoutes";

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
  "data-h2-offset": isTop ? "base(0, 0, auto, auto)" : "base(auto, auto, 0, 0)",
});

export interface BrowsePoolsProps {
  poolAdvertisements: PoolAdvertisement[];
}

export const BrowsePools: React.FC<BrowsePoolsProps> = ({
  poolAdvertisements,
}) => {
  const { mode } = useTheme();
  const intl = useIntl();
  const paths = useDirectIntakeRoutes();
  const tsPaths = useTalentSearchRoutes();
  const profilePaths = useApplicantProfileRoutes();

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

  const filteredPoolAdvertisements = poolAdvertisements
    .filter(
      (p) =>
        p.advertisementStatus === AdvertisementStatus.Published && // list jobs which have the PUBLISHED AdvertisementStatus
        p.publishingGroup === PublishingGroup.ItJobs, // and which are meant to be published on the IT Jobs page
    )
    .sort(
      (p1, p2) =>
        (p1.expiryDate ?? "").localeCompare(p2.expiryDate ?? "") || // first level sort: by expiry date whichever one expires first should appear first on the list
        (p1.publishedAt ?? "").localeCompare(p2.publishedAt ?? ""), // second level sort: whichever one was published first should appear first
    );

  return (
    <>
      <Hero
        imgPath={imageUrl(TALENTSEARCH_APP_DIR, "browse_header.png")}
        title={title}
        subtitle={intl.formatMessage({
          defaultMessage:
            "Find and apply to digital talent opportunities in the Government of Canada.",
          id: "2UDONd",
          description: "Subtitle for the browse IT jobs page",
        })}
        crumbs={crumbs}
      />
      {filteredPoolAdvertisements.length ? (
        <div
          data-h2-background-color="base(black.03) base:dark(black.9)"
          data-h2-color="base(black) base:dark(white)"
          data-h2-border="base(bottom, 1px, solid, black.50)"
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
            <div data-h2-padding="base(x3, 0) p-tablet(x4, 0)">
              <Heading
                level="h2"
                Icon={RocketLaunchIcon}
                color="blue"
                data-h2-margin="base(0, 0, x0.5, 0)"
              >
                {intl.formatMessage({
                  defaultMessage: "Active talent recruitment processes",
                  id: "YImugL",
                  description:
                    "Title for the current jobs recruiting candidates",
                })}
              </Heading>
              <p data-h2-margin="base(x1, 0)" data-h2-font-weight="base(700)">
                {intl.formatMessage({
                  id: "gtaSs1",
                  defaultMessage:
                    "This platform allows you to apply to recruitment processes that makes it easy for hiring managers to find you.",
                  description:
                    "Description of how the application process works, paragraph one",
                })}
              </p>
              <p>
                {intl.formatMessage({
                  id: "EIHPGF",
                  defaultMessage:
                    "Your application to a process will be reviewed by our team and if it's a match, you will be invited to an assessment. Once accepted, managers will be able to contact you about job opportunities based on your skills.",
                  description:
                    "Description of how the application process works, paragraph two",
                })}
              </p>
              <div data-h2-padding="base(x2, 0, 0, 0) p-tablet(x3, 0, 0, 0)">
                <ul
                  data-h2-margin="base(0)"
                  data-h2-padding="base(0)"
                  data-h2-list-style="base(none)"
                >
                  {filteredPoolAdvertisements.map((poolAdvertisement) => (
                    <li key={poolAdvertisement.id}>
                      <PoolCard pool={poolAdvertisement} />
                    </li>
                  ))}
                </ul>
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
                        {intl.formatMessage({
                          defaultMessage: "More opportunities are coming soon!",
                          id: "g+JcDC",
                          description:
                            "Heading for message about upcoming opportunities",
                        })}
                      </Heading>
                      <p>
                        {intl.formatMessage({
                          defaultMessage:
                            "We're posting new opportunities all the time. By starting your profile now, you'll be able to submit applications lightning fast when the time comes.",
                          id: "sehm2K",
                          description:
                            "Text describing upcoming opportunities instructing users to create a profile",
                        })}
                      </p>
                    </div>
                    <div data-h2-margin="base(x1, 0, 0, 0) p-tablet(0)">
                      <Link
                        color="blue"
                        mode="outline"
                        type="button"
                        weight="bold"
                        href={profilePaths.myProfile()}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {intl.formatMessage({
                          defaultMessage: "Create a profile",
                          id: "obSyWw",
                          description:
                            "Link text to direct users to the profile page",
                        })}
                      </Link>
                    </div>
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
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>
            {intl.formatMessage({
              defaultMessage: "No pools found.",
              id: "mW0/n1",
              description:
                "Message displayed on the browse pools direct intake page when there are no pools.",
            })}
          </p>
        </NotFound>
      )}
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
                href: `${tsPaths.home()}/indigenous-it-apprentice`,
                mode: "outline",
                external: true,
                label: intl.formatMessage({
                  defaultMessage:
                    "<hidden>Learn more about </hidden>Indigenous IT apprenticeship<hidden> opportunities</hidden>",
                  id: "xgocDD",
                  description:
                    "Link text to go to IAP homepage on browse IT jobs page",
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
                href: tsPaths.search(),
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
