import * as React from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { PrinterIcon, UserCircleIcon } from "@heroicons/react/24/outline";

import {
  AdminBreadcrumbs,
  Pending,
  NotFound,
  Heading,
  Tabs,
} from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";

import PageHeader from "~/components/PageHeader";
import SEO from "~/components/SEO/SEO";
import UserProfile from "~/components/UserProfile";
import { getFullNameHtml } from "~/utils/nameUtils";
import useRoutes from "~/hooks/useRoutes";
import {
  Applicant,
  Pool,
  Scalars,
  useGetViewUserDataQuery,
} from "~/api/generated";
import AdminAboutUserSection from "~/components/AdminAboutUserSection/AdminAboutUserSection";

import GeneralInfoTab from "./components/GeneralInformationTab/GeneralInformationTab";
import UserProfilePrintButton from "./components/UserProfilePrintButton";

interface ViewUserProps {
  user: Applicant;
  pools: Pool[];
}

export const ViewUser: React.FC<ViewUserProps> = ({ user, pools }) => {
  const intl = useIntl();
  const paths = useRoutes();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Candidate Details",
    id: "XtBhGo",
    description: "Title for the page when viewing an individual user.",
  });

  const links = [
    {
      label: intl.formatMessage({
        defaultMessage: "Home",
        id: "YtEDfa",
        description: "Breadcrumb title for the home link.",
      }),
      url: paths.home(),
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Users",
        id: "eMXL0K",
        description: "Breadcrumb title for the all users table link.",
      }),
      url: paths.userTable(),
    },
    {
      label: getFullNameHtml(user.firstName, user.lastName, intl),
      url: paths.userView(user.id),
    },
  ];

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
      <AdminBreadcrumbs crumbs={links} />
      <div data-h2-margin="base(x2, 0, x1, 0)">
        <div data-h2-flex-grid="base(center, x1)">
          <div data-h2-flex-item="base(1of1) p-tablet(fill)">
            <Heading level="h2" data-h2-margin="base(x.5, 0) l-tablet(0)">
              {getFullNameHtml(user.firstName, user.lastName, intl)}
            </Heading>
          </div>
          <div data-h2-flex-item="base(1of1) p-tablet(content)">
            <UserProfilePrintButton applicant={user}>
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
          <GeneralInfoTab user={user} pools={pools} />
        </Tabs.Content>
        <Tabs.Content value="1">
          <UserProfile
            applicant={user}
            headingLevel="h3"
            sections={{
              about: {
                isVisible: true,
                override: <AdminAboutUserSection applicant={user} />,
              },
              language: { isVisible: true },
              government: { isVisible: true },
              workLocation: { isVisible: true },
              workPreferences: { isVisible: true },
              employmentEquity: { isVisible: true },
              roleSalary: { isVisible: true },
              skillsExperience: { isVisible: true },
            }}
          />
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
};

type RouteParams = {
  userId: Scalars["ID"];
};

const ViewUserPage = () => {
  const { userId } = useParams<RouteParams>();
  const intl = useIntl();
  const [{ data: lookupData, fetching, error }] = useGetViewUserDataQuery({
    variables: { id: userId || "" },
  });

  const user = lookupData?.applicant;
  const pools = lookupData?.pools.filter(notEmpty);

  return (
    <>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Candidate details",
          id: "dj8GiH",
          description: "Page title for the individual user page",
        })}
      />
      <Pending fetching={fetching} error={error}>
        {user && pools ? (
          <ViewUser user={user} pools={pools} />
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
      </Pending>
    </>
  );
};

export default ViewUserPage;
