import React from "react";
import { useIntl } from "react-intl";
import { getLocale } from "@common/helpers/localize";
import { commonMessages } from "@common/messages";
import Breadcrumbs from "@common/components/Breadcrumbs";
import type { BreadcrumbsProps } from "@common/components/Breadcrumbs";
import Link from "@common/components/Link";
import { useDirectIntakeRoutes } from "../../directIntakeRoutes";
import { useGetPoolQuery } from "../../api/generated";
import type { Pool } from "../../api/generated";

interface PoolApplicationThanksProps {
  pool: Pool;
}

const PoolApplicationThanks: React.FC<PoolApplicationThanksProps> = ({
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
      href: pool ? paths.pool(pool.id) : undefined,
    },

    {
      title: intl.formatMessage({
        defaultMessage: "Apply",
        description: "Breadcrumb title for the pool application link.",
      }),
      href: pool ? paths.poolApply(pool.id) : undefined,
    },

    {
      title: intl.formatMessage({
        defaultMessage: "Thanks for Applying",
        description:
          "Breadcrumb title for the pools 'thanks for applying page' link.",
      }),
    },
  ] as BreadcrumbsProps["links"];

  return (
    <>
      <Breadcrumbs links={links} />
      <h1>
        {intl.formatMessage({
          defaultMessage: "Thanks for applying to",
          description: "Title for page thanking user for applying to a pool",
        })}{" "}
        {pool.name?.[locale]}
      </h1>
      <Link
        type="button"
        mode="outline"
        color="primary"
        href={paths.allPools()}
      >
        {intl.formatMessage({
          defaultMessage: "Back to pools list",
          description: "Label for button to the browse pools page",
        })}
      </Link>
    </>
  );
};

export interface PoolApplicationThanksPageProps {
  id: string;
}

const PoolApplicationThanksPage: React.FC<PoolApplicationThanksPageProps> = ({
  id,
}) => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useGetPoolQuery({
    variables: { id },
  });

  if (fetching) {
    return <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>;
  }

  if (error) {
    return (
      <p>
        {intl.formatMessage(commonMessages.loadingError)}
        {error.message}
      </p>
    );
  }

  if (!data?.pool) {
    return (
      <p>
        {intl.formatMessage({
          defaultMessage: "Error, pool unable to be loaded",
          description: "Error message, placeholder",
        })}
      </p>
    );
  }

  return <PoolApplicationThanks pool={data?.pool} />;
};

export default PoolApplicationThanksPage;
