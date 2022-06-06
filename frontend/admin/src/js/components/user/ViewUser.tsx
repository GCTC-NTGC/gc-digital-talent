import * as React from "react";
import { useIntl } from "react-intl";
import {
  HomeIcon,
  DownloadIcon,
  UserCircleIcon,
} from "@heroicons/react/outline";
import Breadcrumbs from "@common/components/Breadcrumbs";
import type { BreadcrumbsProps } from "@common/components/Breadcrumbs";
import PageHeader from "@common/components/PageHeader";
import { Link } from "@common/components";
import { Tab, TabSet } from "@common/components/tabs";
import { commonMessages } from "@common/messages";
import Pending from "@common/components/Pending";
import NotFound from "@common/components/NotFound";
import { useAdminRoutes } from "../../adminRoutes";
import { User, useUserQuery } from "../../api/generated";
import DashboardContentContainer from "../DashboardContentContainer";
import UserProfileApi from "./UserProfile";

interface ViewUserPageProps {
  user: User;
}

export const ViewUserPage: React.FC<ViewUserPageProps> = ({ user }) => {
  const intl = useIntl();
  const adminPaths = useAdminRoutes();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Candidate Details",
    description: "Title for the page when viewing an individual user.",
  });

  const userName = `${user?.firstName} ${user?.lastName}`;

  const links = [
    {
      title: intl.formatMessage({
        defaultMessage: "Home",
        description: "Breadcrumb title for the home link.",
      }),
      href: adminPaths.home(),
      icon: <HomeIcon style={{ width: "1rem", marginRight: "5px" }} />,
    },
    {
      title: intl.formatMessage({
        defaultMessage: "Users",
        description: "Breadcrumb title for the all users table link.",
      }),
      href: adminPaths.userTable(),
      icon: <UserCircleIcon style={{ width: "1rem", marginRight: "5px" }} />,
    },
    {
      title: userName,
    },
  ] as BreadcrumbsProps["links"];

  return (
    <>
      <PageHeader icon={UserCircleIcon}>{pageTitle}</PageHeader>
      <Breadcrumbs links={links} />
      <div
        data-h2-align-items="b(center)"
        data-h2-display="b(flex)"
        data-h2-flex-direction="b(column) m(row)"
        data-h2-margin="b(top-bottom, l)"
      >
        {userName !== " " && (
          <h2
            data-h2-margin="b(top-bottom, s) m(top-bottom, none)"
            data-h2-font-weight="b(800)"
          >
            {userName}
          </h2>
        )}
        <div data-h2-margin="m(left, auto)">
          <Link
            mode="outline"
            color="primary"
            type="button"
            href="/"
            // download={ TODO }
          >
            <span>
              <DownloadIcon style={{ width: "1rem" }} />{" "}
              {intl.formatMessage({
                defaultMessage: "Download Profile",
                description: "Text for button to download a user",
              })}
            </span>
          </Link>
        </div>
      </div>
      <TabSet>
        <Tab
          text={intl.formatMessage({
            defaultMessage: "General Information",
            description: "Tabs title for the individual user general info.",
          })}
        />
        <Tab
          text={intl.formatMessage({
            defaultMessage: "Candidate Profile",
            description: "Tabs title for the individual user profile.",
          })}
        >
          <UserProfileApi userId={user.id} />
        </Tab>
      </TabSet>
    </>
  );
};

interface ViewUserProps {
  userId: string;
}

const ViewUser: React.FC<ViewUserProps> = ({ userId }) => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useUserQuery({
    variables: { id: userId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      <DashboardContentContainer>
        {data?.user ? (
          <ViewUserPage user={data.user} />
        ) : (
          <NotFound
            headingMessage={intl.formatMessage(commonMessages.notFound)}
          >
            <p>
              {intl.formatMessage(
                {
                  defaultMessage: "User {userId} not found.",
                  description: "Message displayed for user not found.",
                },
                { userId },
              )}
            </p>
          </NotFound>
        )}
      </DashboardContentContainer>
    </Pending>
  );
};

export default ViewUser;
