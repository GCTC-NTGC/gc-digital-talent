import { useIntl } from "react-intl";

import {
  FragmentType,
  getFragment,
  graphql,
  TalentNominationStep,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import { getFullNameLabel } from "~/utils/nameUtils";

import messages from "../../messages";
import ReviewHeading from "./ReviewHeading";

const NominatorReview_Fragment = graphql(/* GraphQL */ `
  fragment NominatorReview on TalentNomination {
    submitter {
      id
    }
    nominator {
      id
      firstName
      lastName
      workEmail
    }
    nominatorFallbackName
    nominatorFallbackWorkEmail
  }
`);

interface NominatorReviewProps {
  nominatorQuery?: FragmentType<typeof NominatorReview_Fragment>;
}

const NominatorReview = ({ nominatorQuery }: NominatorReviewProps) => {
  const intl = useIntl();
  const talentNomination = getFragment(
    NominatorReview_Fragment,
    nominatorQuery,
  );

  const notProvided = intl.formatMessage(commonMessages.notProvided);

  let nominatorName = talentNomination?.nominatorFallbackName ?? notProvided;
  if (talentNomination?.nominator) {
    nominatorName = getFullNameLabel(
      talentNomination.nominator.firstName,
      talentNomination.nominator.lastName,
      intl,
    );
  }

  return (
    <>
      <ReviewHeading
        link={{
          to: TalentNominationStep.NominatorInformation,
          name: intl.formatMessage({
            defaultMessage: "Edit nominator info",
            id: "VUsGFc",
            description:
              "Link text to edit a nominations nominator information",
          }),
        }}
      >
        {intl.formatMessage(messages.nominatorInfo)}
      </ReviewHeading>
      <div
        data-h2-display="base(grid)"
        data-h2-grid-template-columns="base(1fr 1fr)"
        data-h2-gap="base(x1)"
      >
        <FieldDisplay
          data-h2-column-span="base(2)"
          label={intl.formatMessage({
            defaultMessage: "Your role",
            description: "Label for submitters role in a nomination",
            id: "CKofej",
          })}
        >
          {talentNomination?.submitter.id === talentNomination?.nominator?.id
            ? intl.formatMessage({
                defaultMessage: "I'm the nominator",
                id: "Fek9he",
                description:
                  "Message diplsyed when someone is submitting a nomination on anothers behalf",
              })
            : intl.formatMessage({
                defaultMessage: "I’m submitting on the nominator's behalf.",
                id: "ZdpkiP",
                description:
                  "Message displayed when the person submitting a nomination is also the person doing the nominating",
              })}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Nominator's name",
            id: "NPQZgb",
            description: "Label for the name of the nominator",
          })}
        >
          {nominatorName}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Nominator's work email",
            id: "egYVyh",
            description: "Label for the nominator's work email",
          })}
        >
          {talentNomination?.nominator?.workEmail ??
            talentNomination?.nominatorFallbackWorkEmail ??
            intl.formatMessage(commonMessages.notProvided)}
        </FieldDisplay>
      </div>
    </>
  );
};

export default NominatorReview;
