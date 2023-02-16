import React from "react";
import { useIntl } from "react-intl";
import { useParams, Outlet } from "react-router-dom";
import {
  UserIcon,
  UserCircleIcon,
  Cog8ToothIcon,
} from "@heroicons/react/24/outline";

import PageHeader from "@common/components/PageHeader";
import Pending from "@common/components/Pending";
import SEO from "@common/components/SEO/SEO";
import { ThrowNotFound } from "@common/components/NotFound";
import { getFullNameHtml } from "@common/helpers/nameUtils";

import useRoutes from "~/hooks/useRoutes";
import useCurrentPage from "~/hooks/useCurrentPage";
import { User, useUserNameQuery } from "~/api/generated";
import { PageNavInfo } from "~/types/pages";

type PageNaveKeys = "profile" | "info" | "edit";

interface PageContentProps {
  user: Pick<User, "id" | "firstName" | "lastName">;
}

const PageContent = ({ user }: PageContentProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const pages = new Map<PageNaveKeys, PageNavInfo>([
    [
      "profile",
      {
        icon: UserCircleIcon,
        title: intl.formatMessage({
          defaultMessage: "User profile",
          id: "SLedtO",
          description: "Title for the user profile page",
        }),
        link: {
          url: paths.userProfile(user.id),
        },
      },
    ],
    [
      "info",
      {
        icon: UserIcon,
        title: intl.formatMessage({
          defaultMessage: "View user",
          id: "eP8dfW",
          description: "Title for the user information page",
        }),
        link: {
          url: paths.userView(user.id),
          label: intl.formatMessage({
            defaultMessage: "User information",
            id: "SFk84j",
            description: "Link text for the user information page link",
          }),
        },
      },
    ],
    [
      "edit",
      {
        icon: Cog8ToothIcon,
        title: intl.formatMessage({
          defaultMessage: "Edit user account",
          id: "9i2N/g",
          description: "Title for the user edit page",
        }),
        link: {
          url: paths.userUpdate(user.id),
        },
      },
    ],
  ]);

  const userName = getFullNameHtml(user.firstName, user.lastName, intl);
  const currentPage = useCurrentPage<PageNaveKeys>(pages);

  return (
    <>
      <SEO title={currentPage?.title} />
      <PageHeader subtitle={userName} icon={currentPage?.icon} navItems={pages}>
        {currentPage?.title}
      </PageHeader>
    </>
  );
};

const UserPage = () => {
  const intl = useIntl();
  const { userId } = useParams();
  const [{ data, fetching, error }] = useUserNameQuery({
    variables: {
      userId: userId || "",
    },
  });

  return (
    <>
      <Pending fetching={fetching} error={error}>
        {data?.user ? (
          <PageContent user={data.user} />
        ) : (
          <ThrowNotFound
            message={intl.formatMessage(
              {
                defaultMessage: "User {userId} not found.",
                id: "0SoKjt",
                description: "Message displayed for user not found.",
              },
              { userId },
            )}
          />
        )}
      </Pending>
      <Outlet />
    </>
  );
};

export default UserPage;
