import { useIntl } from "react-intl";
import ClipboardDocumentListIcon from "@heroicons/react/24/outline/ClipboardDocumentListIcon";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";

import { Card, Heading } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import RequireAuth from "~/components/RequireAuth/RequireAuth";

const Details = () => {
  const intl = useIntl();

  return (
    <div className="flex flex-col gap-y-6">
      <Card>
        <Heading
          color="secondary"
          icon={IdentificationIcon}
          size="h4"
          className="mt-0 font-normal"
        >
          {intl.formatMessage({
            defaultMessage: "Request details",
            id: "lW30Pe",
            description: "Heading for details submitted with a talent request",
          })}
        </Heading>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "The details tab provides the specific information and context about the requirements for this request.",
            id: "M0hPlm",
            description:
              "Description of the details submitted with a talent request",
          })}
        </p>
        <Card.Separator className="my-6" />
      </Card>

      <Card>
        <Heading
          color="secondary"
          icon={ClipboardDocumentListIcon}
          size="h4"
          className="mt-0 font-normal"
        >
          {intl.formatMessage({
            defaultMessage: "Source of talent",
            id: "jg4bu1",
            description:
              "Heading for section outling the source criteria for users in a talent request",
          })}
        </Heading>
        <p>
          {intl.formatMessage({
            defaultMessage: "This is where your candidates come from.",
            id: "RBSXa2",
            description: "Description of the talent request users sources",
          })}
        </p>
        <Card.Separator className="my-6" />
      </Card>

      <Card>
        <Heading
          color="secondary"
          size="h4"
          icon={ClipboardDocumentListIcon}
          className="mt-0 font-normal"
        >
          {intl.formatMessage({
            defaultMessage: "Candidate criteria",
            id: "33ENCz",
            description:
              "Heading for section outlining the criteria submitted for a talent request",
          })}
        </Heading>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "The details tab provides the specific information and context about the requirements for this request.",
            id: "TgVsZ4",
            description: "Description of the talent request criteria submitted",
          })}
        </p>
        <Card.Separator className="my-6" />
      </Card>
    </div>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.CommunityRecruiter, ROLE_NAME.CommunityAdmin]}>
    <Details />
  </RequireAuth>
);

Component.displayName = "AdminTalentRequestDetails";

export default Component;
