import * as React from "react";
import { useIntl } from "react-intl";
import { PrinterIcon, UserCircleIcon } from "@heroicons/react/24/outline";
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
    id: "XtBhGo",
    description: "Title for the page when viewing an individual user.",
  });

  let userName = `${user?.firstName} ${user?.lastName}`;
  if (isEmpty(user?.firstName) && isEmpty(user?.firstName)) {
    userName = intl.formatMessage({
      defaultMessage: "(Missing name)",
      id: "4xzq2Y",
      description: "Message for Missing names in profile",
    });
  }

  const links = [
    {
      title: intl.formatMessage({
        defaultMessage: "Home",
        id: "YtEDfa",
        description: "Breadcrumb title for the home link.",
      }),
      href: adminPaths.home(),
    },
    {
      title: intl.formatMessage({
        defaultMessage: "Users",
        id: "eMXL0K",
        description: "Breadcrumb title for the all users table link.",
      }),
      href: adminPaths.userTable(),
    },
    {
      title: userName,
    },
  ] as BreadcrumbsProps["links"];

  const tabs = [
    intl.formatMessage({
      defaultMessage: "General Information",
      id: "EK90Iy",
      description: "Tabs title for the individual user general info.",
    }),
    intl.formatMessage({
      defaultMessage: "Candidate Profile",
      id: "/no0jA",
      description: "Tabs title for the individual user profile.",
    }),
  ];

  return (
    <>
      <PageHeader icon={UserCircleIcon}>{pageTitle}</PageHeader>
      <Breadcrumbs links={links} />
      <div data-h2-margin="base(x2, 0, x1, 0)">
        <div data-h2-flex-grid="base(center, x1)">
          <div data-h2-flex-item="base(1of1) p-tablet(fill)">
            {userName !== " " && (
              <Heading level="h2" data-h2-margin="base(x.5, 0) l-tablet(0)">
                {userName}
              </Heading>
            )}
          </div>
          <div data-h2-flex-item="base(1of1) p-tablet(content)">
            <UserProfilePrintButton userId={user.id}>
              <span>
                <PrinterIcon style={{ width: "1rem" }} />{" "}
                {intl.formatMessage({
                  defaultMessage: "Print Profile",
                  id: "R+Zm3X",
                  description: "Text for button to print a user profile",
                })}
              </span>
            </UserProfilePrintButton>
          </div>
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
                  id: "0SoKjt",
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
