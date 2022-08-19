import React from "react";
import { useIntl } from "react-intl";
import { getLocale } from "@common/helpers/localize";
import Breadcrumbs from "@common/components/Breadcrumbs";
import type { BreadcrumbsProps } from "@common/components/Breadcrumbs";
import Link from "@common/components/Link";
import NotFound from "@common/components/NotFound";
import Pending from "@common/components/Pending";
import commonMessages from "@common/messages/commonMessages";
import { useDirectIntakeRoutes } from "../../directIntakeRoutes";
import { useBrowsePoolQuery } from "../../api/generated";
import type { Pool } from "../../api/generated";

interface BrowseIndividualPoolProps {
  pool: Pool;
}

const BrowseIndividualPool: React.FC<BrowseIndividualPoolProps> = ({
  pool,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useDirectIntakeRoutes();

  const links = [
    {
      title: intl.formatMessage({
        defaultMessage: "Pools Index",
        description: "Breadcrumb title for the pools index link.",
      }),
      href: paths.home(),
    },

    {
      title: pool?.name?.[locale],
    },
  ] as BreadcrumbsProps["links"];

  return (
    <div>
      <Breadcrumbs links={links} />
      <h1>{pool.name?.[locale]}</h1>
      <Link
        type="button"
        mode="outline"
        color="primary"
        href={paths.poolApply(pool ? pool.id : "/")}
      >
        {intl.formatMessage({
          defaultMessage: "Apply",
          description: "Apply label for button to apply to pool",
        })}
      </Link>
    </div>
  );
};

const BrowseIndividualPoolApi: React.FC<{ poolId: string }> = ({ poolId }) => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useBrowsePoolQuery({
    variables: { id: poolId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.pool ? (
        <BrowseIndividualPool pool={data?.pool} />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          {intl.formatMessage({
            defaultMessage: "Error, pool unable to be loaded",
            description: "Error message, placeholder",
          })}
        </NotFound>
      )}
    </Pending>
  );
};

export default BrowseIndividualPoolApi;
