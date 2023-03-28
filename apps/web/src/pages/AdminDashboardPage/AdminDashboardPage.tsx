import React from "react";
import { useIntl } from "react-intl";
import {
  BoltIcon,
  HomeIcon,
  BuildingOfficeIcon,
  BuildingOffice2Icon,
  TicketIcon,
  UserGroupIcon,
  UserIcon,
  Squares2X2Icon,
  PuzzlePieceIcon,
} from "@heroicons/react/24/outline";

import { Heading, Pending } from "@gc-digital-talent/ui";
import { useAuthorization, hasRole } from "@gc-digital-talent/auth";

import PageHeader from "~/components/PageHeader";
import SEO from "~/components/SEO/SEO";
import { getFullNameHtml } from "~/utils/nameUtils";
import { User, useMeQuery } from "~/api/generated";
import adminMenuMessages from "~/messages/adminMenuMessages";
import useRoutes from "~/hooks/useRoutes";

import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";

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
        icon={HomeIcon}
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
        {hasRole("pool_operator", roleAssignments || []) && (
          <LinkWell
            title={intl.formatMessage({
              defaultMessage: "Managing a recruitment process",
              id: "293bsq",
              description: "Heading for pool operator dashboard links",
            })}
            links={[
              {
                label: intl.formatMessage(adminMenuMessages.pools),
                href: adminRoutes.allPools(),
                icon: Squares2X2Icon,
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
        {hasRole("request_responder", roleAssignments || []) && (
          <LinkWell
            title={intl.formatMessage({
              defaultMessage: "Responding to talent requests",
              id: "ijUT7N",
              description: "Heading for request responder dashboard links",
            })}
            links={[
              {
                label: intl.formatMessage(adminMenuMessages.requests),
                href: adminRoutes.searchRequestTable(),
                icon: TicketIcon,
              },
            ]}
          />
        )}
        {hasRole("platform_admin", roleAssignments || []) && (
          <LinkWell
            title={intl.formatMessage({
              defaultMessage: "Maintaining the platform",
              id: "ipSk4R",
              description: "Heading for platform dashboard links",
            })}
            links={[
              {
                label: intl.formatMessage(adminMenuMessages.users),
                href: adminRoutes.userTable(),
                icon: UserIcon,
              },
              {
                label: intl.formatMessage(adminMenuMessages.teams),
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
                label: intl.formatMessage(adminMenuMessages.skills),
                href: adminRoutes.skillTable(),
                icon: BoltIcon,
              },
              {
                label: intl.formatMessage(adminMenuMessages.skillFamilies),
                href: adminRoutes.skillFamilyTable(),
                icon: UserGroupIcon,
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

const DashboardPageApi = () => {
  const [{ data, fetching, error }] = useMeQuery();

  return (
    <Pending fetching={fetching} error={error}>
      <DashboardPage currentUser={data?.me} />
    </Pending>
  );
};

export default DashboardPageApi;
