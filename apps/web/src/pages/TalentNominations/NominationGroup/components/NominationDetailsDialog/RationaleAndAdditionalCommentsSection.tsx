import { useIntl } from "react-intl";

import {
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";
import { Heading, Ul } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";

const TalentNominationDetailsDialogRationaleAndAdditionalComments_Fragment =
  graphql(/* GraphQL */ `
    fragment TalentNominationDetailsDialogRationaleAndAdditionalComments on TalentNomination {
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

interface RationaleAndAdditionalCommentsSectionProps {
  query: FragmentType<
    typeof TalentNominationDetailsDialogRationaleAndAdditionalComments_Fragment
  >;
}

const RationaleAndAdditionalCommentsSection = ({
  query,
}: RationaleAndAdditionalCommentsSectionProps) => {
  const intl = useIntl();
  const nomination = getFragment(
    TalentNominationDetailsDialogRationaleAndAdditionalComments_Fragment,
    query,
  );

  const nullMessage = intl.formatMessage(commonMessages.notFound);

  return (
    <div>
      <Heading level="h3" size="h6" className="mt-0 mb-6">
        {intl.formatMessage({
          defaultMessage: "Rationale and additional comments",
          id: "13uPGf",
          description: "Rationale and additional comments section heading",
        })}
      </Heading>
      <div className="flex flex-col gap-6">
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Nomination rationale",
            id: "V+/xH8",
            description: "Nomination rationale field",
          })}
        >
          {nomination.nominationRationale}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Top 3 key leadership competencies",
            id: "LTk61y",
            description: "Top 3 key leadership competencies field",
          })}
        >
          <Ul space="lg" className="mt-1.5">
            {nomination.skills?.filter(notEmpty).map((skill) => (
              <li key={skill.id}>{skill.name.localized ?? nullMessage}</li>
            ))}
          </Ul>
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Additional comments",
            id: "W5B1BZ",
            description: "Additional comments field",
          })}
        >
          {nomination.additionalComments}
        </FieldDisplay>
      </div>
    </div>
  );
};

export default RationaleAndAdditionalCommentsSection;
