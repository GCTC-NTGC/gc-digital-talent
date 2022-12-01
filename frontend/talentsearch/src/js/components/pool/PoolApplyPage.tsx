import React from "react";
import { useIntl } from "react-intl";

import Breadcrumbs from "@common/components/Breadcrumbs";
import type { BreadcrumbsProps } from "@common/components/Breadcrumbs";
import Link from "@common/components/Link";
import { ThrowNotFound } from "@common/components/NotFound";
import Pending from "@common/components/Pending";
import { getFullPoolAdvertisementTitle } from "@common/helpers/poolUtils";

import useRoutes from "../../hooks/useRoutes";
import { PoolAdvertisement, useGetPoolQuery } from "../../api/generated";

interface PoolApplyProps {
  pool: PoolAdvertisement;
}

const PoolApply: React.FC<PoolApplyProps> = ({ pool }) => {
  const intl = useIntl();
  const paths = useRoutes();

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
      {data?.poolAdvertisement ? (
        <PoolApply pool={data?.poolAdvertisement} />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage({
            defaultMessage: "Error, pool unable to be loaded",
            id: "DcEinN",
            description: "Error message, placeholder",
          })}
        />
      )}
    </Pending>
  );
};

export default PoolApplyPage;
