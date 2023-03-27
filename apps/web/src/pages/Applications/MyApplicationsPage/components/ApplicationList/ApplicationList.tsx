import React from "react";
import { useIntl } from "react-intl";

import { Accordion, Heading, Link, Well } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";

import ApplicationCard from "../ApplicationCard/ApplicationCard";
import ApplicationGroup from "./ApplicationGroup";

import { groupApplicationsByStatus } from "./utils";
import { Application } from "../../../ApplicantDashboardPage/types";

interface ApplicationListProps {
  applications: Array<Application>;
}

const ApplicationList = ({ applications }: ApplicationListProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const groupedApplications = groupApplicationsByStatus(applications);
  const drafts = groupedApplications.drafts || [];
  const submitted = groupedApplications.submitted || [];
  const historical = groupedApplications.historical || [];

  return (
    <>
      <Heading data-h2-font-weight="base(400)">
        {intl.formatMessage({
          defaultMessage: "My applications",
          id: "wzScZA",
          description: "Title for the list of a users applications",
        })}
      </Heading>
      <p data-h2-margin="base(x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            "This section lists all of your applications to recruitment processes. Applications are sorted into three distinct categories:",
          id: "X35OfB",
          description:
            "Text explaining there are three different groups of applications",
        })}
      </p>
      <ul data-h2-margin="base(x1, 0)">
        <li data-h2-margin="base(x.25, 0)">
          {intl.formatMessage({
            defaultMessage:
              "<strong>Drafts</strong> are applications you've begun but have not yet submitted.",
            id: "ItdSG1",
            description: "Explainer for draft applications",
          })}
        </li>
        <li data-h2-margin="base(x.25, 0)">
          {intl.formatMessage({
            defaultMessage:
              "<strong>Submitted</strong> applications are pending assessment or are currently being reviewed.",
            id: "jBUwoU",
            description: "Explainer for submitted applications",
          })}
        </li>
        <li data-h2-margin="base(x.25, 0)">
          {intl.formatMessage({
            defaultMessage:
              "Your <strong>application history</strong> includes applications that are complete or missed the submission deadline.",
            id: "v8gO9Z",
            description: "Explainer for application history section",
          })}
        </li>
      </ul>
      <Accordion.Root type="multiple" mode="simple">
        <Accordion.Item value="drafts">
          <Accordion.Trigger headerAs="h3">
            {intl.formatMessage({
              defaultMessage: "Draft applications",
              id: "5isFkb",
              description: "Title for the draft applications section",
            })}
          </Accordion.Trigger>
          <Accordion.Content>
            {drafts.length ? (
              <ApplicationGroup>
                {drafts.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                  />
                ))}
              </ApplicationGroup>
            ) : (
              <Well data-h2-text-align="base(center)">
                <p
                  data-h2-font-size="base(h6)"
                  data-h2-font-weight="base(700)"
                  data-h2-margin="base(0, 0, x.25, 0)"
                >
                  {intl.formatMessage({
                    defaultMessage:
                      "Applications that are in progress will appear here.",
                    id: "W/s+MH",
                    description:
                      "Text displayed in draft applications section when there are no drafts.",
                  })}
                </p>
                <p data-h2-font-weight="base(700)">
                  <Link data-h2-color="base(primary)" href={paths.browse()}>
                    {intl.formatMessage({
                      defaultMessage:
                        "Check our available opportunities to start an application.",
                      id: "O63upZ",
                      description:
                        "Link text to browse opportunities when there are no draft applications",
                    })}
                  </Link>
                </p>
              </Well>
            )}
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="submitted">
          <Accordion.Trigger headerAs="h3">
            {intl.formatMessage({
              defaultMessage: "Submitted applications",
              id: "acCyP9",
              description: "Title for the submitted applications section",
            })}
          </Accordion.Trigger>
          <Accordion.Content>
            {submitted.length ? (
              <ApplicationGroup>
                {submitted.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                  />
                ))}
              </ApplicationGroup>
            ) : (
              <Well data-h2-text-align="base(center)">
                <p
                  data-h2-font-size="base(h6)"
                  data-h2-font-weight="base(700)"
                  data-h2-margin="base(0, 0, x.25, 0)"
                >
                  {intl.formatMessage({
                    defaultMessage:
                      "After submitting an application, it will appear here.",
                    id: "tqIOKb",
                    description:
                      "Text displayed in submitted applications section when there are no submitted applications.",
                  })}
                </p>
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "Applications in this section will allow you to track their progress.",
                    id: "U5WfKm",
                    description:
                      "Text describing that the submitted applications section is used for",
                  })}
                </p>
              </Well>
            )}
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="historical">
          <Accordion.Trigger headerAs="h3">
            {intl.formatMessage({
              defaultMessage: "Application history",
              id: "MTSArs",
              description: "Title for the historical applications section",
            })}
          </Accordion.Trigger>
          <Accordion.Content>
            {historical.length ? (
              <ApplicationGroup>
                {historical.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                  />
                ))}
              </ApplicationGroup>
            ) : (
              <Well data-h2-text-align="base(center)">
                <p
                  data-h2-font-weight="base(700)"
                  data-h2-margin="base(0, 0, x.25, 0)"
                >
                  {intl.formatMessage({
                    defaultMessage:
                      "All applications that are no longer active will appear here.",
                    id: "KBa7RY",
                    description:
                      "Text displayed in historical applications section when there are no historical applications.",
                  })}
                </p>
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "This section will include applications that have missed the submission deadline as well as applications that have been fully assessed.",
                    id: "+hrTzd",
                    description:
                      "Text describing that the historical applications section is used for",
                  })}
                </p>
              </Well>
            )}
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </>
  );
};

export default ApplicationList;
