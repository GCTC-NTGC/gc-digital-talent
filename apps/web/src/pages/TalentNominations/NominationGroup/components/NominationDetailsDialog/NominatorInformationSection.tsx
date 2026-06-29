import { useIntl } from "react-intl";

import {
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";
import { Heading } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import { getFullNameLabel } from "~/utils/nameUtils";

const TalentNominationDetailsDialogNominatorInformation_Fragment = graphql(
  /* GraphQL */ `
    fragment TalentNominationDetailsDialogNominatorInformation on TalentNomination {
      nominator {
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
      nominatorFallbackWorkEmail
      nominatorFallbackName
      nominatorFallbackClassification {
        groupAndLevel
      }
      nominatorFallbackDepartment {
        name {
          localized
        }
      }
    }
  `,
);

interface NominatorInformationSectionProps {
  query: FragmentType<
    typeof TalentNominationDetailsDialogNominatorInformation_Fragment
  >;
}

const NominatorInformationSection = ({
  query,
}: NominatorInformationSectionProps) => {
  const intl = useIntl();
  const nomination = getFragment(
    TalentNominationDetailsDialogNominatorInformation_Fragment,
    query,
  );

  const nominatorName = nomination.nominator
    ? getFullNameLabel(
        nomination.nominator.firstName,
        nomination.nominator.lastName,
        intl,
      )
    : nomination.nominatorFallbackName;

  const nominatorWorkEmail = nomination.nominator
    ? nomination.nominator.workEmail
    : nomination.nominatorFallbackWorkEmail;

  const nominatorClassification = nomination.nominator
    ? nomination.nominator.classification?.groupAndLevel
    : nomination.nominatorFallbackClassification?.groupAndLevel;

  const nominatorDepartment = nomination.nominator
    ? nomination.nominator.department?.name.localized
    : nomination.nominatorFallbackDepartment?.name.localized;

  const nullMessage = intl.formatMessage(commonMessages.notFound);

  return (
    <div>
      <Heading level="h3" size="h6" className="mt-0 mb-6">
        {intl.formatMessage({
          defaultMessage: "Nominator information",
          id: "vJD6dl",
          description: "Heading for nominator step of a talent nomination",
        })}
      </Heading>
      <div className="grid gap-6 xs:grid-cols-2">
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Nominator’s name",
            id: "exPEA1",
            description: "Label for the text input for the nominators name",
          })}
        >
          {nominatorName ?? nullMessage}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Nominator’s work email",
            id: "5HhVG9",
            description:
              "Label for the text input for the nominators work email",
          })}
        >
          {nominatorWorkEmail ?? nullMessage}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Nominator's classification",
            id: "b44Vd5",
            description: "Label for the nominator's classification",
          })}
        >
          {nominatorClassification ?? nullMessage}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Nominator’s department or agency",
            id: "AdmbBO",
            description: "Label for a nominators department",
          })}
        >
          {nominatorDepartment ?? nullMessage}
        </FieldDisplay>
      </div>
    </div>
  );
};

export default NominatorInformationSection;
