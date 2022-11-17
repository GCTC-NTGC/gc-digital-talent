import React from "react";
import { useIntl } from "react-intl";
import { commonMessages } from "@common/messages";
import Breadcrumbs from "@common/components/Breadcrumbs";
import type { BreadcrumbsProps } from "@common/components/Breadcrumbs";
import Link from "@common/components/Link";
import NotFound from "@common/components/NotFound";
import Pending from "@common/components/Pending";
import { getFullPoolAdvertisementTitle } from "@common/helpers/poolUtils";
import { useDirectIntakeRoutes } from "../../directIntakeRoutes";
import { useGetPoolQuery } from "../../api/generated";
import type { Pool } from "../../api/generated";

interface PoolApplyProps {
  pool: Pool;
}

const PoolApply: React.FC<PoolApplyProps> = ({ pool }) => {
  const intl = useIntl();
  const paths = useDirectIntakeRoutes();

  const links = [
    {
      title: intl.formatMessage({
        defaultMessage: "Pools Index",
        id: "tf/wEc",
        description: "Breadcrumb title for the pools index link.",
      }),
      href: paths.home(),
    },

    {
      title: getFullPoolAdvertisementTitle(intl, pool),
      href: pool ? paths.pool(pool.id) : undefined,
    },
  ] as BreadcrumbsProps["links"];

  return (
    <>
      <Breadcrumbs links={links} />
      <h1>{getFullPoolAdvertisementTitle(intl, pool)}</h1>
      <Link
        type="button"
        mode="outline"
        color="primary"
        href={paths.pool(pool ? pool.id : "/")}
      >
        {intl.formatMessage({
          defaultMessage: "Back to pool",
          id: "dHLkSE",
          description: "Label for button to return to view pool",
        })}
      </Link>
    </>
  );
};

export interface PoolApplyPageProps {
  id: string;
}

const PoolApplyPage: React.FC<PoolApplyPageProps> = ({ id }) => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useGetPoolQuery({
    variables: { id },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.pool ? (
        <PoolApply pool={data?.pool} />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>
            {intl.formatMessage({
              defaultMessage: "Error, pool unable to be loaded",
              id: "DcEinN",
              description: "Error message, placeholder",
            })}
          </p>
        </NotFound>
      )}
    </Pending>
  );
};

export default PoolApplyPage;
