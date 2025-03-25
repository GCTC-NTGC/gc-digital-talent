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
import { stringifyGroupLevel } from "~/utils/classification";

import messages from "../../messages";
import ReviewHeading from "./ReviewHeading";

const NomineeReview_Fragment = graphql(/* GraphQL */ `
  fragment NomineeReview on TalentNomination {
    nominee {
      firstName
      lastName
      workEmail
      department {
        name {
          localized
        }
      }
      classification {
        group
        level
      }
    }
  }
`);

interface NomineeReviewProps {
  nomineeQuery?: FragmentType<typeof NomineeReview_Fragment>;
}

const NomineeReview = ({ nomineeQuery }: NomineeReviewProps) => {
  const intl = useIntl();
  const talentNomination = getFragment(NomineeReview_Fragment, nomineeQuery);

  return (
    <>
      <ReviewHeading
        link={{
          to: TalentNominationStep.NomineeInformation,
          name: intl.formatMessage({
            defaultMessage: "Edit nominee info",
            id: "DePuGA",
            description: "Link text to edit a nominations nominee information",
          }),
        }}
      >
        {intl.formatMessage(messages.nomineeInfo)}
      </ReviewHeading>
      <div
        data-h2-display="base(grid)"
        data-h2-grid-template-columns="base(1fr 1fr)"
        data-h2-gap="base(x1)"
      >
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Nominee's name",
            description: "Label for nominees name in a nomination",
            id: "Usof4a",
          })}
        >
          {getFullNameLabel(
            talentNomination?.nominee?.firstName,
            talentNomination?.nominee?.lastName,
            intl,
          )}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Nominee's work email",
            id: "u+qPJf",
            description: "Label for the nominee's work email",
          })}
        >
          {talentNomination?.nominee?.workEmail ??
            intl.formatMessage(commonMessages.notProvided)}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Nominee's classification",
            id: "sj+5RI",
            description: "Label for the nominee's classification",
          })}
        >
          {talentNomination?.nominee?.classification
            ? stringifyGroupLevel(
                talentNomination.nominee.classification.group,
                talentNomination.nominee.classification.level,
              )
            : intl.formatMessage(commonMessages.notProvided)}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Nominee's department or agency",
            id: "ksBmA2",
            description: "Label for the nominee's department",
          })}
        >
          {talentNomination?.nominee?.department?.name.localized ??
            intl.formatMessage(commonMessages.notProvided)}
        </FieldDisplay>
      </div>
    </>
  );
};

export default NomineeReview;
