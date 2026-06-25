import { useIntl } from "react-intl";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";

import {
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import talentRequestMessages from "~/messages/talentRequestMessages";

import TalentRequestSectionCard from "./TalentRequestSectionCard";

const TalentRequestDetailsCard_Fragment = graphql(/** GraphQL */ `
  fragment TalentRequestDetailsCard on TalentRequest {
    jobTitle
    additionalComments
    positionType {
      label {
        localized
      }
    }
    reason {
      label {
        localized
      }
    }
  }
`);

interface TalentRequestDetailsCardProps {
  query: FragmentType<typeof TalentRequestDetailsCard_Fragment>;
}

const TalentRequestDetailsCard = ({ query }: TalentRequestDetailsCardProps) => {
  const intl = useIntl();
  const talentRequest = getFragment(TalentRequestDetailsCard_Fragment, query);
  const notProvided = intl.formatMessage(commonMessages.notProvided);

  return (
    <TalentRequestSectionCard
      title={intl.formatMessage({
        defaultMessage: "Request details",
        id: "lW30Pe",
        description: "Heading for details submitted with a talent request",
      })}
      subtitle={intl.formatMessage({
        defaultMessage:
          "This section provides context about the requirements for this request.",
        id: "Ay4Syt",
        description:
          "Description of the details submitted with a talent request",
      })}
      icon={IdentificationIcon}
      color="secondary"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Position job title",
            id: "OI7Bc7",
            description: "Label for an opportunity's job title.",
          })}
        >
          {talentRequest.jobTitle ?? notProvided}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Type of position",
            id: "nZT/WM",
            description: "Label for an opportunity's position type.",
          })}
        >
          {talentRequest.positionType?.label.localized ?? notProvided}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Reason for talent request",
            id: "enffKD",
            description: "Label for the reason for submitting the request.",
          })}
        >
          {talentRequest.reason?.label.localized ?? notProvided}
        </FieldDisplay>
      </div>
      <TalentRequestSectionCard.Separator />
      <FieldDisplay
        label={intl.formatMessage(talentRequestMessages.additionalComments)}
      >
        {talentRequest.additionalComments ?? notProvided}
      </FieldDisplay>
    </TalentRequestSectionCard>
  );
};

export default TalentRequestDetailsCard;
