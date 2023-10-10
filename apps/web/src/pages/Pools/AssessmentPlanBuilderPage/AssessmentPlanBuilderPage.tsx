import * as React from "react";
import { useParams } from "react-router-dom";
import { useIntl } from "react-intl";

import { Scalars } from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import adminMessages from "~/messages/adminMessages";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";

type RouteParams = {
  poolId: Scalars["ID"];
};

export const EditPoolPage = () => {
  const intl = useIntl();
  const { poolId } = useParams<RouteParams>();
  const routes = useRoutes();

  const notFoundMessage = intl.formatMessage(
    {
      defaultMessage: "Pool {poolId} not found.",
      id: "Sb2fEr",
      description: "Message displayed for pool not found.",
    },
    { poolId },
  );

  if (!poolId) {
    throw new Response(notFoundMessage, {
      status: 404,
      statusText: "Not Found",
    });
  }

  // const [{ data, fetching, error }] = useGetEditPoolDataQuery({
  //   variables: { poolId: poolId || "" },
  // });

  // const { isFetching, mutations } = usePoolMutations();

  // const ctx = React.useMemo(() => {
  //   return { isSubmitting: isFetching };
  // }, [isFetching]);

  const navigationCrumbs = [
    {
      label: intl.formatMessage({
        defaultMessage: "Home",
        id: "EBmWyo",
        description: "Link text for the home link in breadcrumbs.",
      }),
      url: routes.adminDashboard(),
    },
    {
      label: intl.formatMessage(adminMessages.pools),
      url: routes.poolTable(),
    },
    // {
    //   label: getLocalizedName(data?.pool?.name, intl),
    //   url: routes.poolView(poolId),
    // },
    {
      label: intl.formatMessage({
        defaultMessage: "Edit<hidden> pool</hidden>",
        id: "D6HIId",
        description: "Edit pool breadcrumb text",
      }),
      url: routes.poolUpdate(poolId),
    },
  ];

  return (
    <AdminContentWrapper crumbs={navigationCrumbs}>
      Hello, world
    </AdminContentWrapper>
  );
};

export default EditPoolPage;
