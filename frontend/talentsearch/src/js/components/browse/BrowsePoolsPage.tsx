import React from "react";
import { RocketLaunchIcon } from "@heroicons/react/24/outline";
import { useIntl } from "react-intl";

import Hero from "@common/components/Hero";
import Pending from "@common/components/Pending";
import NotFound from "@common/components/NotFound";

import { commonMessages } from "@common/messages";
import { imageUrl } from "@common/helpers/router";
import Heading from "@common/components/Heading";
import {
  AdvertisementStatus,
  PublishingGroup,
  PoolAdvertisement,
  useBrowsePoolAdvertisementsQuery,
} from "../../api/generated";
import PoolCard from "./PoolCard/PoolCard";
import TALENTSEARCH_APP_DIR from "../../talentSearchConstants";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useDirectIntakeRoutes } from "../../directIntakeRoutes";

export interface BrowsePoolsProps {
  poolAdvertisements: PoolAdvertisement[];
}

export const BrowsePools: React.FC<BrowsePoolsProps> = ({
  poolAdvertisements,
}) => {
  const intl = useIntl();
  const paths = useDirectIntakeRoutes();

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
          data-h2-border="base(bottom, 1px, solid, black.50)"
          data-h2-position="base(relative)"
        >
          <div
            data-h2-position="base(relative)"
            data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
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
              <ul
                data-h2-list-style="base(none)"
                data-h2-margin="base(0)"
                data-h2-padding="base(x2, 0, 0, 0) p-tablet(x3, 0, 0, 0)"
              >
                {filteredPoolAdvertisements.map((poolAdvertisement) => (
                  <li key={poolAdvertisement.id}>
                    <PoolCard pool={poolAdvertisement} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
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
