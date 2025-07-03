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
import labels from "../../labels";

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
    nominatorFallbackName
    nominatorFallbackWorkEmail
    nominatorFallbackDepartment {
      name {
        localized
      }
    }
    nominatorFallbackClassification {
      group
      level
    }
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

  const nominatorClassification =
    talentNomination?.nominator?.classification ??
    talentNomination?.nominatorFallbackClassification;

  const nominatorDepartment =
    talentNomination?.nominator?.department ??
    talentNomination?.nominatorFallbackDepartment;

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
      <div className="grid grid-cols-2 gap-6">
        <FieldDisplay
          className="col-span-2"
          label={intl.formatMessage(labels.yourRole)}
        >
          {talentNomination?.submitter?.id === talentNomination?.nominator?.id
            ? intl.formatMessage(labels.imNominator)
            : intl.formatMessage(labels.onBehalf)}
        </FieldDisplay>
        <FieldDisplay label={intl.formatMessage(labels.nominatorName)}>
          {nominatorName}
        </FieldDisplay>
        <FieldDisplay label={intl.formatMessage(labels.nominatorWorkEmail)}>
          {talentNomination?.nominator?.workEmail ??
            talentNomination?.nominatorFallbackWorkEmail ??
            intl.formatMessage(commonMessages.notProvided)}
        </FieldDisplay>

        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Nominator's classification",
            id: "sjxFxr",
            description: "Label for the nominators's classification",
          })}
        >
          {nominatorClassification
            ? stringifyGroupLevel(
                nominatorClassification.group,
                nominatorClassification.level,
              )
            : intl.formatMessage(commonMessages.notProvided)}
        </FieldDisplay>
        <FieldDisplay label={intl.formatMessage(labels.nominatorDepartment)}>
          {nominatorDepartment?.name.localized ??
            intl.formatMessage(commonMessages.notProvided)}
        </FieldDisplay>
      </div>
    </>
  );
};

export default NominatorReview;
