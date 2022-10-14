import React from "react";
import { useIntl } from "react-intl";
import Pending from "@common/components/Pending";
import NotFound from "@common/components/NotFound";
import { commonMessages } from "@common/messages";
import {
  AdvertisementStatus,
  PublishingGroup,
  PoolAdvertisement,
  useBrowsePoolAdvertisementsQuery,
} from "../../api/generated";
import PoolCard from "./PoolCard";

export interface BrowsePoolsProps {
  poolAdvertisements: PoolAdvertisement[];
}

export const BrowsePools: React.FC<BrowsePoolsProps> = ({
  poolAdvertisements,
}) => {
  const intl = useIntl();

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
      <h1>
        {intl.formatMessage({
          defaultMessage: "Browse Pools",
          id: "oG9dAi",
          description: "Page title for the direct intake browse pools page.",
        })}
      </h1>
      {filteredPoolAdvertisements.length ? (
        <ul>
          {filteredPoolAdvertisements.map((poolAdvertisement) => (
            <li
              data-h2-list-style="base(none)"
              key={poolAdvertisement.id}
              data-h2-margin="base(x0.5, 0, x0.5, 0)"
            >
              <PoolCard pool={poolAdvertisement} headingLevel="h2" />
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
