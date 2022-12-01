import * as React from "react";
import { useIntl } from "react-intl";
import { PrinterIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import Breadcrumbs from "@common/components/Breadcrumbs";
import type { BreadcrumbsProps } from "@common/components/Breadcrumbs";
import PageHeader from "@common/components/PageHeader";
import Tabs from "@common/components/Tabs";
import { commonMessages } from "@common/messages";
import Pending from "@common/components/Pending";
import NotFound from "@common/components/NotFound";
import Heading from "@common/components/Heading";
import { getFullNameHtml } from "@common/helpers/nameUtils";
import { useParams } from "react-router-dom";
import { useAdminRoutes } from "../../adminRoutes";
import { Scalars, User, useUserQuery } from "../../api/generated";
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
      title: getFullNameHtml(user.firstName, user.lastName, intl),
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
            <Heading level="h2" data-h2-margin="base(x.5, 0) l-tablet(0)">
              {getFullNameHtml(user.firstName, user.lastName, intl)}
            </Heading>
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
      <Tabs.Root defaultValue="0">
        <Tabs.List
          aria-label={intl.formatMessage({
            defaultMessage: "User Information",
            id: "mv+9jt",
            description: "Heading for the user information section",
          })}
        >
          {tabs.map((tab, index) => (
            <Tabs.Trigger key={tab} value={`${index}`}>
              {tab}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <Tabs.Content value="0">
          <GeneralInfoTabApi userId={user.id} />
        </Tabs.Content>
        <Tabs.Content value="1">
          <UserProfileApi userId={user.id} />
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
};

type RouteParams = {
  userId: Scalars["ID"];
};

const ViewUser = () => {
  const { userId } = useParams<RouteParams>();
  const intl = useIntl();
  const [{ data, fetching, error }] = useUserQuery({
    variables: { id: userId || "" },
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
