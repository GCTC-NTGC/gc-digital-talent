import React from "react";
import { useIntl } from "react-intl";
import Pending from "@common/components/Pending";
import NotFound from "@common/components/NotFound";
import { commonMessages } from "@common/messages";
import {
  PoolAdvertisement,
  useBrowsePoolAdvertisementsQuery,
} from "../../api/generated";
import PoolCard from "./PoolCard";

interface BrowsePoolsProps {
  poolAdvertisements?: PoolAdvertisement[];
}

const BrowsePools: React.FC<BrowsePoolsProps> = ({ poolAdvertisements }) => {
  const intl = useIntl();

  return (
    <>
      <h1>
        {intl.formatMessage({
          defaultMessage: "Browse Pools",
          id: "oG9dAi",
          description: "Page title for the direct intake browse pools page.",
        })}
      </h1>
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
