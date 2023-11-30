import React from "react";
import { useIntl } from "react-intl";
import InformationCircleIcon from "@heroicons/react/24/solid/InformationCircleIcon";

import { Button, Dialog, Link, LinkProps } from "@gc-digital-talent/ui";
import { formatDate } from "@gc-digital-talent/date-helpers";

import useRoutes from "~/hooks/useRoutes";

const generateLink = (
  href: LinkProps["href"],
  state: LinkProps["state"],
  chunks: React.ReactNode,
) => (
  <Link newTab external href={href} state={state}>
    {chunks}
  </Link>
);

type DeadlineDialogProps = {
  deadline: Date;
};

const DeadlineDialog = ({ deadline }: DeadlineDialogProps): JSX.Element => {
  const intl = useIntl();
  const routes = useRoutes();
  // https://stackoverflow.com/a/34602679
  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button
          mode="icon_only"
          color="secondary"
          icon={InformationCircleIcon}
          aria-label={intl.formatMessage({
            defaultMessage: "Learn about how application deadlines work.",
            id: "8YKsal",
            description:
              "Info button label for pool application deadline details.",
          })}
        />
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "About application deadlines",
            id: "mQkyM8",
            description: "Heading for the pool deadlines dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <div
            data-h2-display="base(flex)"
            data-h2-gap="base(x.5)"
            data-h2-flex-direction="base(column)"
            data-h2-align-items="base(flex-start)"
          >
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "In order to provide an equitable opportunity for all Canadians to apply to a position, deadlines close at <strong>11:59 PM Pacific Time</strong> on the date specified.",
                id: "L6MgeM",
                description: "First paragraph for the pool deadlines dialog",
              })}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "For this opportunity, applications must be submitted no later than:",
                id: "IOtzp7",
                description: "Second paragraph for pool deadlines dialog",
              })}
              <div
                data-h2-font-weight="base(700)"
                data-h2-margin="base(x.5 0 0 x.75)"
              >
                {`${intl.formatMessage(
                  {
                    defaultMessage: "{time} on {date}",
                    id: "TomxAe",
                    description:
                      "A datetime formatted as a certain time on a certain date",
                  },
                  {
                    time: formatDate({
                      date: deadline,
                      formatString: "p zzzz",
                      intl,
                      timeZone: "Canada/Pacific",
                    }),
                    date: formatDate({
                      date: deadline,
                      formatString: "MMMM do",
                      intl,
                      timeZone: "Canada/Pacific",
                    }),
                  },
                )}.`}
              </div>
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "In your current time zone, that means applications will be accepted until:",
                id: "kzd/yK",
                description: "Third paragraph for pool deadlines dialog",
              })}
              <div
                data-h2-font-weight="base(700)"
                data-h2-margin="base(x.5 0 0 x.75)"
              >
                {`${intl.formatMessage(
                  {
                    defaultMessage: "{time} on {date}",
                    id: "TomxAe",
                    description:
                      "A datetime formatted as a certain time on a certain date",
                  },
                  {
                    time: formatDate({
                      date: deadline,
                      formatString: "p zzzz",
                      intl,
                      timeZone: localTimeZone,
                    }),
                    date: formatDate({
                      date: deadline,
                      formatString: "MMMM do",
                      intl,
                      timeZone: localTimeZone,
                    }),
                  },
                )}.`}
              </div>
            </p>
            <p>
              {intl.formatMessage(
                {
                  defaultMessage: "Have questions? <link>Get in touch</link>.",
                  id: "H+83NU",
                  description: "Fourth paragraph for pool deadlines dialog",
                },
                {
                  link: (chunks: React.ReactNode) =>
                    generateLink(
                      routes.support(),
                      { referrer: window.location.href },
                      chunks,
                    ),
                },
              )}
            </p>
          </div>
          <Dialog.Footer>
            <Dialog.Close>
              <Button color="secondary">
                {intl.formatMessage({
                  defaultMessage: "Close",
                  id: "4p0QdF",
                  description: "Button text used to close an open modal",
                })}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default DeadlineDialog;
