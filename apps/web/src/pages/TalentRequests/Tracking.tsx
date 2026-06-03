import { useIntl } from "react-intl";
import MapPinIcon from "@heroicons/react/24/outline/MapPinIcon";
import MagnifyingGlassPlusIcon from "@heroicons/react/24/outline/MagnifyingGlassPlusIcon";

import { Card, Heading, Notice } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import RequireAuth from "~/components/RequireAuth/RequireAuth";
import talentRequestMessages from "~/messages/talentRequestMessages";

const Tracking = () => {
  const intl = useIntl();
  const trackedUsers = [];

  return (
    <div className="flex flex-col gap-y-6">
      <Card>
        <Heading
          color="primary"
          size="h4"
          icon={MapPinIcon}
          className="mt-0 font-normal"
        >
          {intl.formatMessage(talentRequestMessages.candidateTracking)}
        </Heading>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "Track and manage all candidates that have matched this request.",
            id: "T0+7FE",
            description:
              "Description of the candidates being tracked by a talent request",
          })}
        </p>
        <Card.Separator className="my-6" />
        {trackedUsers.length > 0 ? null : (
          <Notice.Root mode="inline">
            <Notice.Title>
              {intl.formatMessage({
                defaultMessage: "You are not tracking any candidates yet",
                id: "uQqsKm",
                description:
                  "Title displayed when there are no tracked users for a talent request",
              })}
            </Notice.Title>
            <Notice.Content>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Use the ‘<italic>Find matching candidates</italic>’ table to start tracking possible matching candidates to this request.",
                  id: "nmXd3e",
                  description:
                    "Help message displayed when there are no tracked users for a talent request",
                })}
              </p>
            </Notice.Content>
          </Notice.Root>
        )}
      </Card>

      <Card>
        <Heading
          color="warning"
          size="h4"
          icon={MagnifyingGlassPlusIcon}
          className="mt-0 font-normal"
        >
          {intl.formatMessage({
            defaultMessage: "Find matching candidates",
            id: "CtcCZj",
            description:
              "Heading for the table that contains users who match talent request criteria",
          })}
        </Heading>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "This list is always up-to-date, find new candidates that match to this talent request.",
            id: "JT8Azd",
            description:
              "Description of the table showing users who match talent request criteria",
          })}
        </p>
        <Card.Separator className="my-6" />
      </Card>
    </div>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.CommunityRecruiter, ROLE_NAME.CommunityAdmin]}>
    <Tracking />
  </RequireAuth>
);

Component.displayName = "AdminTalentRequestcTracking";

export default Component;
