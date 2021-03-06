import * as React from "react";
import { useIntl } from "react-intl";
import {
  HomeIcon,
  PrinterIcon,
  UserCircleIcon,
} from "@heroicons/react/outline";
import Breadcrumbs from "@common/components/Breadcrumbs";
import type { BreadcrumbsProps } from "@common/components/Breadcrumbs";
import PageHeader from "@common/components/PageHeader";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@common/components/Tabs";
import { commonMessages } from "@common/messages";
import Pending from "@common/components/Pending";
import NotFound from "@common/components/NotFound";
import { isEmpty } from "lodash";
import Heading from "@common/components/Heading";
import { useAdminRoutes } from "../../adminRoutes";
import { User, useUserQuery } from "../../api/generated";
import DashboardContentContainer from "../DashboardContentContainer";
import UserProfileApi from "./UserProfile";
import GeneralInfoTabApi from "./GeneralInformationTab/GeneralInformationTab";
import UserProfilePrintButton from "./UserProfilePrintButton";

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

  let userName = `${user?.firstName} ${user?.lastName}`;
  if (isEmpty(user?.firstName) && isEmpty(user?.firstName)) {
    userName = intl.formatMessage({
      defaultMessage: "(Missing name)",
      description: "Message for Missing names in profile",
    });
  }

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

  const tabs = [
    intl.formatMessage({
      defaultMessage: "General Information",
      description: "Tabs title for the individual user general info.",
    }),
    intl.formatMessage({
      defaultMessage: "Candidate Profile",
      description: "Tabs title for the individual user profile.",
    }),
  ];

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
          <Heading
            level="h2"
            data-h2-margin="b(top-bottom, s) m(top-bottom, none)"
          >
            {userName}
          </Heading>
        )}
        <div data-h2-margin="m(left, auto)">
          <UserProfilePrintButton userId={user.id}>
            <span>
              <PrinterIcon style={{ width: "1rem" }} />{" "}
              {intl.formatMessage({
                defaultMessage: "Print Profile",
                description: "Text for button to print a user profile",
              })}
            </span>
          </UserProfilePrintButton>
        </div>
      </div>
      <Tabs>
        <TabList>
          {tabs.map((tab, index) => (
            <Tab key={tab} index={index}>
              {tab}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          <TabPanel>
            <GeneralInfoTabApi userId={user.id} />
          </TabPanel>
          <TabPanel>
            <UserProfileApi userId={user.id} />
          </TabPanel>
        </TabPanels>
      </Tabs>
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
