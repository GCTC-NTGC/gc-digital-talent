import { useIntl } from "react-intl";

import {
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";
import { Heading } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import BoolCheckIcon from "~/components/BoolCheckIcon/BoolCheckIcon";
import talentNominationMessages from "~/messages/talentNominationMessages";
import adminMessages from "~/messages/adminMessages";

const TalentNominationDetailsDialogNominationDetails_Fragment = graphql(
  /* GraphQL */ `
    fragment TalentNominationDetailsDialogNominationDetails on TalentNomination {
      nominateForAdvancement
      nominateForLateralMovement
      nominateForDevelopmentPrograms
      advancementReference {
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
      advancementReferenceFallbackName
      advancementReferenceFallbackWorkEmail
      advancementReferenceFallbackClassification {
        groupAndLevel
      }
      advancementReferenceFallbackDepartment {
        name {
          localized
        }
      }
    }
  `,
);

interface NominationDetailsSectionProps {
  query: FragmentType<
    typeof TalentNominationDetailsDialogNominationDetails_Fragment
  >;
}

const NominationDetailsSection = ({ query }: NominationDetailsSectionProps) => {
  const intl = useIntl();
  const nomination = getFragment(
    TalentNominationDetailsDialogNominationDetails_Fragment,
    query,
  );

  const referenceName = nomination.advancementReference
    ? `${nomination.advancementReference.firstName} ${nomination.advancementReference.lastName}`.trim()
    : nomination.advancementReferenceFallbackName;

  const referenceWorkEmail = nomination.advancementReference
    ? nomination.advancementReference.workEmail
    : nomination.advancementReferenceFallbackWorkEmail;

  const referenceClassification = nomination.advancementReference
    ? nomination.advancementReference.classification?.groupAndLevel
    : nomination.advancementReferenceFallbackClassification?.groupAndLevel;

  const referenceDepartment = nomination.advancementReference
    ? nomination.advancementReference.department?.name.localized
    : nomination.advancementReferenceFallbackDepartment?.name.localized;

  const nullMessage = intl.formatMessage(commonMessages.notFound);

  return (
    <div>
      <Heading level="h3" size="h6" className="mt-0 mb-6">
        {intl.formatMessage({
          defaultMessage: "Nomination details",
          id: "zGyHtH",
          description: "Nomination details section heading",
        })}
      </Heading>
      <div className="grid gap-6 xs:grid-cols-2">
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Nomination options",
            id: "itUHim",
            description: "Nomination options field",
          })}
          className="xs:col-span-2"
        >
          <div className="mt-1.5 flex flex-col gap-1.5">
            <BoolCheckIcon value={nomination.nominateForAdvancement}>
              {intl.formatMessage(
                talentNominationMessages.nominateForAdvancement,
              )}
            </BoolCheckIcon>
            <BoolCheckIcon value={nomination.nominateForLateralMovement}>
              {intl.formatMessage(
                talentNominationMessages.nominateForLateralMovement,
              )}
            </BoolCheckIcon>
            <BoolCheckIcon value={nomination.nominateForDevelopmentPrograms}>
              {intl.formatMessage(adminMessages.developmentProgram)}
            </BoolCheckIcon>
          </div>
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Reference’s name",
            id: "zZVYD0",
            description: "Reference’s name field",
          })}
        >
          {referenceName ?? nullMessage}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Reference’s work email",
            id: "712zpF",
            description: "Reference’s work email field",
          })}
        >
          {referenceWorkEmail ?? nullMessage}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Reference’s classification",
            id: "xzN9C5",
            description: "Reference’s classification field",
          })}
        >
          {referenceClassification ?? nullMessage}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Reference’s department or agency",
            id: "vmU8ug",
            description: "Reference’s department or agency field",
          })}
        >
          {referenceDepartment ?? nullMessage}
        </FieldDisplay>
      </div>
    </div>
  );
};

export default NominationDetailsSection;
