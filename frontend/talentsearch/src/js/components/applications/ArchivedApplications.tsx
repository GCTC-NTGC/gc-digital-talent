import { Button } from "@common/components";
import React from "react";
import { useIntl } from "react-intl";

import type { Application } from "./ApplicationCard";
import ApplicationCard from "./ApplicationCard";

interface ArchivedApplicationsProps {
  applications: Array<Application>;
}

const ArchivedApplications = ({ applications }: ArchivedApplicationsProps) => {
  const intl = useIntl();
  const [isOpen, setOpen] = React.useState<boolean>(false);

  const id = "archive-panel";

  return (
    <>
      <div
        data-h2-display="base(flex)"
        data-h2-margin="base(x2, 0, x1, 0)"
        data-h2-justify-content="base(space-between)"
      >
        <h2>
          {intl.formatMessage({
            defaultMessage: "Archived Applications",
            description: "Title for a users archived applications",
          })}
        </h2>
        <Button
          aria-controls={id}
          aria-expanded={isOpen}
          mode="solid"
          color="secondary"
          onClick={() => setOpen(!isOpen)}
        >
          {isOpen
            ? intl.formatMessage({
                defaultMessage: "Hide archived applications",
                description:
                  "Button text to hide a users archived applications.",
              })
            : intl.formatMessage({
                defaultMessage: "Show archived applications",
                description:
                  "Button text to show a users archived applications.",
              })}
        </Button>
      </div>
      <div id={id} style={{ display: isOpen ? "block" : "none" }}>
        {applications.length > 0 ? (
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
            data-h2-gap="base(x0.5, row)"
          >
            {applications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        ) : (
          <p>
            {intl.formatMessage({
              defaultMessage: "You currently have no archived applications.",
              description:
                "Messaged displayed when a user has no archived applications.",
            })}
          </p>
        )}
      </div>
    </>
  );
};

export default ArchivedApplications;
