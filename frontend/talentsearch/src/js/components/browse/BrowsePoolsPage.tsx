import React from "react";
import { useIntl } from "react-intl";

import Hero from "@common/components/Hero";
import Pending from "@common/components/Pending";
import NotFound from "@common/components/NotFound";

import { commonMessages } from "@common/messages";
import { imageUrl } from "@common/helpers/router";
import {
  PoolAdvertisement,
  useBrowsePoolAdvertisementsQuery,
} from "../../api/generated";
import PoolCard from "./PoolCard";
import TALENTSEARCH_APP_DIR from "../../talentSearchConstants";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useDirectIntakeRoutes } from "../../directIntakeRoutes";

interface BrowsePoolsProps {
  poolAdvertisements?: PoolAdvertisement[];
}

const BrowsePools: React.FC<BrowsePoolsProps> = ({ poolAdvertisements }) => {
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
      {poolAdvertisements && poolAdvertisements.length ? (
        <ul>
          {poolAdvertisements.map((poolAdvertisement) => (
            <li
              data-h2-list-style="base(none)"
              key={poolAdvertisement.id}
              data-h2-margin="base(x0.5, 0, x0.5, 0)"
            >
              <PoolCard pool={poolAdvertisement} />
            </li>
          ))}
        </ul>
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

  const filteredPoolAdvertisements = data?.poolAdvertisements.filter(
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
