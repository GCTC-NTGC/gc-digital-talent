import React from "react";
import { useIntl } from "react-intl";
import { useQuery } from "urql";
import BoltIcon from "@heroicons/react/20/solid/BoltIcon";
import CloudIcon from "@heroicons/react/20/solid/CloudIcon";
import HomeIconOutline from "@heroicons/react/24/outline/HomeIcon";
import BuildingOfficeIcon from "@heroicons/react/20/solid/BuildingOfficeIcon";
import BuildingOffice2Icon from "@heroicons/react/20/solid/BuildingOffice2Icon";
import TicketIcon from "@heroicons/react/20/solid/TicketIcon";
import IdentificationIcon from "@heroicons/react/20/solid/IdentificationIcon";
import UserIcon from "@heroicons/react/20/solid/UserIcon";
import Squares2X2Icon from "@heroicons/react/20/solid/Squares2X2Icon";
import PuzzlePieceIcon from "@heroicons/react/20/solid/PuzzlePieceIcon";

import { Heading, Pending } from "@gc-digital-talent/ui";
import { useAuthorization, hasRole } from "@gc-digital-talent/auth";
import { User, graphql } from "@gc-digital-talent/graphql";

import PageHeader from "~/components/PageHeader";
import SEO from "~/components/SEO/SEO";
import { getFullNameHtml } from "~/utils/nameUtils";
import useRoutes from "~/hooks/useRoutes";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import adminMessages from "~/messages/adminMessages";

import LinkWell from "./components/LinkWell";

interface DashboardPageProps {
  currentUser?: User | null;
}

const DashboardPage = ({ currentUser }: DashboardPageProps) => {
  const intl = useIntl();
  const adminRoutes = useRoutes();
  const { roleAssignments } = useAuthorization();
  const navigationCrumbs = [
    {
      label: intl.formatMessage({
        defaultMessage: "Home",
        id: "EBmWyo",
        description: "Link text for the home link in breadcrumbs.",
      }),
      url: adminRoutes.adminDashboard(),
    },
  ];

  return (
    <AdminContentWrapper crumbs={navigationCrumbs}>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Admin",
          id: "wHX/8C",
          description: "Title tag for Admin site",
        })}
      />
      <PageHeader
        icon={HomeIconOutline}
        subtitle={intl.formatMessage({
          defaultMessage:
            "This is the administrator hub of the GC Digital Talent platform, manage, sort and recruit talent to the GoC.",
          id: "7nxtBm",
          description: "Subtitle for the admin dashboard page",
        })}
      >
        {intl.formatMessage(
          {
            defaultMessage: "Welcome back, {name}",
            id: "lIwJp4",
            description:
              "Title for dashboard on the talent cloud admin portal.",
          },
          {
            name: currentUser
              ? getFullNameHtml(
                  currentUser.firstName,
                  currentUser.lastName,
                  intl,
                )
              : intl.formatMessage({
                  defaultMessage: "N/A",
                  id: "AauSuA",
                  description: "Not available message.",
                }),
          },
        )}
      </PageHeader>
      <Heading
        size="h4"
        data-h2-font-weight="base(bold)"
        data-h2-margin="base(0, 0, x1, 0)"
      >
        {intl.formatMessage({
          defaultMessage: "What are you working on today?",
          id: "wHnGAK",
          description:
            "Heading for the sections of links available to the current user",
        })}
      </Heading>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1, 0)"
      >
        {hasRole("pool_operator", roleAssignments) && (
          <LinkWell
            title={intl.formatMessage({
              defaultMessage: "Managing a recruitment process",
              id: "293bsq",
              description: "Heading for pool operator dashboard links",
            })}
            links={[
              {
                label: intl.formatMessage(adminMessages.pools),
                href: adminRoutes.poolTable(),
                icon: Squares2X2Icon,
              },
              {
                label: intl.formatMessage(adminMessages.poolsCandidates),
                href: adminRoutes.poolCandidates(),
                icon: IdentificationIcon,
              },
              {
                label: intl.formatMessage(adminMessages.users),
                href: adminRoutes.userTable(),
                icon: UserIcon,
              },
              {
                label: intl.formatMessage({
                  defaultMessage: "My Teams",
                  id: "N3uD4m",
                  description: "Link text for current users teams page",
                }),
                href: adminRoutes.teamTable(),
                icon: BuildingOffice2Icon,
              },
            ]}
          />
        )}
        {hasRole("request_responder", roleAssignments) && (
          <LinkWell
            title={intl.formatMessage({
              defaultMessage: "Responding to talent requests",
              id: "ijUT7N",
              description: "Heading for request responder dashboard links",
            })}
            links={[
              {
                label: intl.formatMessage(adminMessages.requests),
                href: adminRoutes.searchRequestTable(),
                icon: TicketIcon,
              },
              {
                label: intl.formatMessage(adminMessages.poolsCandidates),
                href: adminRoutes.poolCandidates(),
                icon: IdentificationIcon,
              },
              {
                label: intl.formatMessage(adminMessages.users),
                href: adminRoutes.userTable(),
                icon: UserIcon,
              },
            ]}
          />
        )}
        {hasRole("community_manager", roleAssignments) && (
          <LinkWell
            title={intl.formatMessage({
              defaultMessage: "Publishing pools and managing teams",
              id: "B29+yd",
              description: "Heading for Community Manager dashboard links",
            })}
            links={[
              {
                label: intl.formatMessage(adminMessages.pools),
                href: adminRoutes.poolTable(),
                icon: Squares2X2Icon,
              },
              {
                label: intl.formatMessage(adminMessages.teams),
                href: adminRoutes.teamTable(),
                icon: BuildingOffice2Icon,
              },
            ]}
          />
        )}
        {hasRole("platform_admin", roleAssignments) && (
          <LinkWell
            title={intl.formatMessage({
              defaultMessage: "Maintaining the platform",
              id: "ipSk4R",
              description: "Heading for platform dashboard links",
            })}
            links={[
              {
                label: intl.formatMessage(adminMessages.users),
                href: adminRoutes.userTable(),
                icon: UserIcon,
              },
              {
                label: intl.formatMessage(adminMessages.teams),
                href: adminRoutes.teamTable(),
                icon: BuildingOffice2Icon,
              },
              {
                label: intl.formatMessage({
                  defaultMessage: "Departments and Agencies",
                  id: "hxaIWa",
                  description: "Link text for all departments page",
                }),
                href: adminRoutes.departmentTable(),
                icon: BuildingOfficeIcon,
              },
              {
                label: intl.formatMessage(adminMessages.skills),
                href: adminRoutes.skillTable(),
                icon: BoltIcon,
              },
              {
                label: intl.formatMessage(adminMessages.skillFamilies),
                href: adminRoutes.skillFamilyTable(),
                icon: CloudIcon,
              },
              {
                label: intl.formatMessage({
                  defaultMessage: "Groups and Classifications",
                  id: "m4hoPL",
                  description: "Link text for all classifications page",
                }),
                href: adminRoutes.classificationTable(),
                icon: PuzzlePieceIcon,
              },
            ]}
          />
        )}
      </div>
    </AdminContentWrapper>
  );
};

const adminDashboardQuery = graphql(/* GraphQL */ `
  query adminDashboardQuery {
    me {
      id
      firstName
      lastName
    }
  }
`);

const DashboardPageApi = () => {
  const [{ data, fetching, error }] = useQuery({
    query: adminDashboardQuery,
  });

  return (
    <Pending fetching={fetching} error={error}>
      <DashboardPage currentUser={data?.me} />
    </Pending>
  );
};

export default DashboardPageApi;
