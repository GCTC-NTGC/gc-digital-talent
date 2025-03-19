import { useIntl } from "react-intl";

import {
  FragmentType,
  getFragment,
  graphql,
  TalentNominationStep,
} from "@gc-digital-talent/graphql";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";

import messages from "../../messages";
import ReviewHeading from "./ReviewHeading";

const NominationDetailsReview_Fragment = graphql(/* GraphQL */ `
  fragment NominationDetailsReview on TalentNomination {
    id
  }
`);

interface NominationDetailsReviewProps {
  detailsQuery?: FragmentType<typeof NominationDetailsReview_Fragment>;
}

const NominationDetailsReview = ({
  detailsQuery,
}: NominationDetailsReviewProps) => {
  const intl = useIntl();
  const talentNomination = getFragment(
    NominationDetailsReview_Fragment,
    detailsQuery,
  );

  return (
    <>
      <ReviewHeading
        link={{
          to: TalentNominationStep.NominationDetails,
          name: intl.formatMessage({
            defaultMessage: "Edit nomination details",
            id: "0r1Pr3",
            description: "Link text to edit a nominations details information",
          }),
        }}
      >
        {intl.formatMessage(messages.nominationDetails)}
      </ReviewHeading>
      <div
        data-h2-display="base(grid)"
        data-h2-grid-template-columns="base(1fr 1fr)"
        data-h2-gap="base(x1)"
      >
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Your role",
            description: "Label for submitters role in a nomination",
            id: "CKofej",
          })}
        ></FieldDisplay>
      </div>
    </>
  );
};

export default NominationDetailsReview;
