import React from "react";
import { useIntl } from "react-intl";
import { useParams, Outlet } from "react-router-dom";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";
import Cog8ToothIcon from "@heroicons/react/24/outline/Cog8ToothIcon";

import { ThrowNotFound, Pending } from "@gc-digital-talent/ui";

import SEO from "~/components/SEO/SEO";
import PageHeader from "~/components/PageHeader";
import useRoutes from "~/hooks/useRoutes";
import useCurrentPage from "~/hooks/useCurrentPage";
import { getFullNameHtml } from "~/utils/nameUtils";
import { User, useUserNameQuery } from "~/api/generated";
import { PageNavInfo } from "~/types/pages";

type PageNavKeys = "profile" | "info" | "edit";

interface UserHeaderProps {
  user: Pick<User, "id" | "firstName" | "lastName">;
}

const UserHeader = ({ user }: UserHeaderProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const pages = new Map<PageNavKeys, PageNavInfo>([
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
  const currentPage = useCurrentPage<PageNavKeys>(pages);

  return (
    <>
      <SEO title={currentPage?.title} />
      <PageHeader subtitle={userName} icon={currentPage?.icon} navItems={pages}>
        {currentPage?.title}
      </PageHeader>
    </>
  );
};

const UserLayout = () => {
  const { userId } = useParams();
  const [{ data, fetching, error }] = useUserNameQuery({
    variables: {
      userId: userId || "",
    },
  });

  return (
    <>
      {/* This is above the AdminContentWrapper so it needs its own centering */}
      <div data-h2-container="base(center, full, x2)">
        <Pending fetching={fetching} error={error}>
          {data?.user ? <UserHeader user={data.user} /> : <ThrowNotFound />}
        </Pending>
      </div>
      <Outlet />
    </>
  );
};

export default UserLayout;
