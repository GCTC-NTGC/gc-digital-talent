import { useIntl } from "react-intl";

import {
  FragmentType,
  getFragment,
  graphql,
  TalentNominationStep,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";

import messages from "../../messages";
import ReviewHeading from "./ReviewHeading";

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
        label={intl.formatMessage({
          defaultMessage: "Nomination rationale",
          description: "Label for the rationale of a specific nomination",
          id: "gjQpW3",
        })}
      >
        {talentNomination?.nominationRationale ?? notProvided}
      </FieldDisplay>
      <FieldDisplay
        data-h2-margin-bottom="base(x1)"
        label={intl.formatMessage({
          defaultMessage: "Top 3 key leadership competencies",
          id: "/MDg+f",
          description:
            "Label for the leadership skills associated with the nominee",
        })}
      >
        {skills.length > 0 ? (
          <ul>
            {skills.map((skill) => (
              <li key={skill.id}>{skill?.name.localized}</li>
            ))}
          </ul>
        ) : (
          notProvided
        )}
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage({
          defaultMessage: "Additional comments",
          description:
            "Label for the additional comments for a specific nomination",
          id: "XloV0z",
        })}
      >
        {talentNomination?.additionalComments ?? notProvided}
      </FieldDisplay>
    </>
  );
};

export default RationaleReview;
