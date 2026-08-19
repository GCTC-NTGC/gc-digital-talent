import { useIntl } from "react-intl";

import {
  getFragment,
  graphql,
  TalentNominationSubmitterRelationshipToNominator,
  type FragmentType,
} from "@gc-digital-talent/graphql";
import { Heading } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import {
  DATE_FORMAT_LOCALIZED,
  formatDate,
  parseDateTimeUtc,
} from "@gc-digital-talent/date-helpers";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import { getFullNameLabel } from "~/utils/nameUtils";

const TalentNominationDetailsDialogSubmissionInformation_Fragment = graphql(
  /* GraphQL */ `
    fragment TalentNominationDetailsDialogSubmissionInformation on TalentNomination {
      submittedAt
      submitter {
        firstName
        lastName
        workEmail
        classification {
          groupAndLevel
        }
        department {
          name {
            localized
          }
        }
      }
      submitterRelationshipToNominator {
        value
        label {
          localized
        }
      }
      submitterRelationshipToNominatorOther
      submitter {
        id
      }
      nominator {
        id
      }
    }
  `,
);

interface SubmissionInformationSectionProps {
  query: FragmentType<
    typeof TalentNominationDetailsDialogSubmissionInformation_Fragment
  >;
}

const SubmissionInformationSection = ({
  query,
}: SubmissionInformationSectionProps) => {
  const intl = useIntl();
  const nomination = getFragment(
    TalentNominationDetailsDialogSubmissionInformation_Fragment,
    query,
  );

  const nullMessage = intl.formatMessage(commonMessages.notFound);

  const relationshipLabel =
    nomination.submitterRelationshipToNominator?.value ===
    TalentNominationSubmitterRelationshipToNominator.Other
      ? nomination.submitterRelationshipToNominatorOther
      : nomination.submitterRelationshipToNominator?.label.localized;

  const submitterName = nomination.submitter
    ? getFullNameLabel(
        nomination.submitter.firstName,
        nomination.submitter.lastName,
        intl,
      )
    : nullMessage;

  const shouldShowSubmitterFields =
    !!nomination.submitter?.id &&
    nomination.nominator?.id !== nomination.submitter?.id;

  return (
    <div>
      <Heading level="h3" size="h6" className="mt-0 mb-6">
        {intl.formatMessage({
          defaultMessage: "Submission information",
          id: "avQilV",
          description: "Submission information section heading",
        })}
      </Heading>
      <div className="grid gap-6 xs:grid-cols-2">
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Date received",
            id: "m0Qcow",
            description:
              "Title displayed on the search request table requested date column.",
          })}
          className="xs:col-span-2"
        >
          {nomination.submittedAt
            ? formatDate({
                date: parseDateTimeUtc(nomination.submittedAt),
                formatString: DATE_FORMAT_LOCALIZED,
                intl,
              })
            : nullMessage}
        </FieldDisplay>
        {shouldShowSubmitterFields ? (
          <>
            <FieldDisplay
              label={intl.formatMessage({
                defaultMessage: "Submitter's name",
                id: "rgmr0x",
                description: "Label for the submitter's name",
              })}
            >
              {submitterName ?? nullMessage}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage({
                defaultMessage: "Submitter's work email",
                id: "/Wgawu",
                description: "Label for the submitter's work email",
              })}
            >
              {nomination.submitter?.workEmail ?? nullMessage}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage({
                defaultMessage: "Submitter's classification",
                id: "iC/wHw",
                description: "Label for the submitter's classification",
              })}
            >
              {nomination.submitter?.classification?.groupAndLevel ??
                nullMessage}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage({
                defaultMessage: "Submitter's department or agency",
                id: "oljVrD",
                description: "Label for the submitter's department/agency",
              })}
            >
              {nomination.submitter?.department?.name.localized ?? nullMessage}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage({
                defaultMessage: "Submitter’s relationship to the nominator",
                id: "w4FBPx",
                description: "Submitter’s relationship to the nominator field",
              })}
              className="xs:col-span-2"
            >
              {relationshipLabel ?? nullMessage}
            </FieldDisplay>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default SubmissionInformationSection;
