import React from "react";
import { useIntl } from "react-intl";
import { HomeIcon } from "@heroicons/react/outline";
import PageHeader from "@common/components/PageHeader";

const DashboardPage: React.FC = () => {
  const intl = useIntl();

  return (
    <div data-h2-padding="b(all, m)">
      <PageHeader icon={HomeIcon}>
        {intl.formatMessage(
          {
            defaultMessage: "Welcome back, {name}",
            description:
              "Title for dashboard on the talent cloud admin portal.",
          },
          {
            name: "Jane Doe", // Placeholder name
          },
        )}
      </PageHeader>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "On this page you can find a list of active pools along with a few details about their status.",
          description:
            "Description of the content found on the admin portal dashboard page.",
        })}
      </p>
    </div>
  );
};

export default DashboardPage;
