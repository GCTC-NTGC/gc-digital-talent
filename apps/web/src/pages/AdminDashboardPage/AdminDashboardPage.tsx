import React from "react";
import { useIntl } from "react-intl";
import {
  HomeIcon,
  TicketIcon,
  UserIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

import { IconLink, Pending } from "@gc-digital-talent/ui";

import PageHeader from "~/components/PageHeader";
import SEO from "~/components/SEO/SEO";
import { getFullNameHtml } from "~/utils/nameUtils";
import { User, useMeQuery } from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";

import LatestRequestsTable from "./components/LatestRequestsTable";

interface DashboardPageProps {
  currentUser?: User | null;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ currentUser }) => {
  const intl = useIntl();
  const adminRoutes = useRoutes();

  return (
    <>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Admin",
          id: "wHX/8C",
          description: "Title tag for Admin site",
        })}
      />
      <PageHeader icon={HomeIcon}>
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
      <p>
        {intl.formatMessage({
          defaultMessage:
            "On this page you can find a list of active pools along with a few details about their status.",
          id: "7B+1RO",
          description:
            "Description of the content found on the admin portal dashboard page.",
        })}
      </p>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-wrap="base(wrap)"
        data-h2-margin="base(x2, 0, 0, 0)"
      >
        <span data-h2-margin="base(0, x.5, x.5, 0)">
          <IconLink
            mode="solid"
            color="secondary"
            type="button"
            href={adminRoutes.poolTable()}
            icon={Squares2X2Icon}
          >
            {intl.formatMessage({
              defaultMessage: "Manage pools",
              id: "HgQThJ",
              description:
                "Text label for link to pools page on admin dashboard",
            })}
          </IconLink>
        </span>
        <span data-h2-margin="base(0, x.5, x.5, 0)">
          <IconLink
            mode="solid"
            color="secondary"
            type="button"
            href={adminRoutes.userTable()}
            icon={UserIcon}
          >
            {intl.formatMessage({
              defaultMessage: "Manage users",
              id: "U5HvOH",
              description:
                "Text label for link to users page on admin dashboard",
            })}
          </IconLink>
        </span>
        <span data-h2-margin="base(0, x.5, x.5, 0)">
          <IconLink
            mode="solid"
            color="secondary"
            type="button"
            href={adminRoutes.searchRequestTable()}
            icon={TicketIcon}
          >
            {intl.formatMessage({
              defaultMessage: "Manage requests",
              id: "Bvj3zI",
              description:
                "Text label for link to requests page on admin dashboard",
            })}
          </IconLink>
        </span>
      </div>
      <LatestRequestsTable />
    </>
  );
};

const DashboardPageApi: React.FC = () => {
  const [{ data, fetching, error }] = useMeQuery();

  return (
    <Pending fetching={fetching} error={error}>
      <DashboardPage currentUser={data?.me} />
    </Pending>
  );
};

export default DashboardPageApi;
