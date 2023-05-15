import * as React from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router";
import { OperationContext } from "urql";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import { Scalars, useUserQuery } from "@gc-digital-talent/graphql";

import PageHeader from "~/components/PageHeader";
import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import { getFullNameLabel } from "~/utils/nameUtils";
import adminMessages from "~/messages/adminMessages";

const context: Partial<OperationContext> = {
  additionalTypenames: ["Role"], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
  requestPolicy: "cache-first", // The list of roles will rarely change, so we override default request policy to avoid unnecessary cache updates.
};

type RouteParams = {
  userId: Scalars["ID"];
};

const UserPlacementPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const { userId } = useParams<RouteParams>();
  const [{ data: userData /* , fetching, error */ }] = useUserQuery({
    variables: { id: userId || "" },
    context,
  });

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
      label: intl.formatMessage(adminMessages.users),
      url: routes.userTable(),
    },
    ...(userId
      ? [
          {
            label: getFullNameLabel(
              userData?.user?.firstName,
              userData?.user?.lastName,
              intl,
            ),
            url: routes.userView(userId),
          },
        ]
      : []),
    ...(userId
      ? [
          {
            label: intl.formatMessage({
              defaultMessage: "Placement",
              id: "I0VGC0",
              description: "User placement breadcrumb text",
            }),
            url: routes.userPlacement(userId),
          },
        ]
      : []),
  ];

  const pageTitle = intl.formatMessage({
    defaultMessage: "Placement information",
    id: "/WvEvL",
    description: "Page title for the user placement information page",
  });

  return (
    <AdminContentWrapper crumbs={navigationCrumbs}>
      <SEO title={pageTitle} />
      <PageHeader icon={UserIcon}>{pageTitle}</PageHeader>
    </AdminContentWrapper>
  );
};

export default UserPlacementPage;
