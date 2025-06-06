import { useIntl } from "react-intl";

import {
  FragmentType,
  getFragment,
  graphql,
  TalentNominationStep,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { Ul } from "@gc-digital-talent/ui";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";

import messages from "../../messages";
import ReviewHeading from "./ReviewHeading";
import labels from "../../labels";

const RationaleReview_Fragment = graphql(/* GraphQL */ `
  fragment RationaleReview on TalentNomination {
    nominationRationale
    skills {
      id
      name {
        localized
      }
    }
    additionalComments
  }
`);

interface RationaleReviewProps {
  rationaleQuery?: FragmentType<typeof RationaleReview_Fragment>;
}

const RationaleReview = ({ rationaleQuery }: RationaleReviewProps) => {
  const intl = useIntl();
  const talentNomination = getFragment(
    RationaleReview_Fragment,
    rationaleQuery,
  );

  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const skills = unpackMaybes(talentNomination?.skills);

  return (
    <>
      <ReviewHeading
        link={{
          to: TalentNominationStep.Rationale,
          name: intl.formatMessage({
            defaultMessage: "Edit rationale",
            id: "o1qvlP",
            description: "Link text to edit a nominations rationale",
          }),
        }}
      >
        {intl.formatMessage(messages.rationale)}
      </ReviewHeading>
      <FieldDisplay
        data-h2-margin-bottom="base(x1)"
        label={intl.formatMessage(labels.nominationRationale)}
      >
        {talentNomination?.nominationRationale ?? notProvided}
      </FieldDisplay>
      <FieldDisplay
        data-h2-margin-bottom="base(x1)"
        label={intl.formatMessage(labels.leadershipCompetencies)}
      >
        {skills.length > 0 ? (
          <Ul>
            {skills.map((skill) => (
              <li key={skill.id}>{skill?.name.localized}</li>
            ))}
          </Ul>
        ) : (
          notProvided
        )}
      </FieldDisplay>
      <FieldDisplay label={intl.formatMessage(labels.additionalComments)}>
        {talentNomination?.additionalComments ?? notProvided}
      </FieldDisplay>
    </>
  );
};

export default RationaleReview;
