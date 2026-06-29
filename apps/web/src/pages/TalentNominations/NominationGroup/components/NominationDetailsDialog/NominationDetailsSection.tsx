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
import { getFullNameLabel } from "~/utils/nameUtils";

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
    ? getFullNameLabel(
        nomination.advancementReference.firstName,
        nomination.advancementReference.lastName,
        intl,
      )
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
          id: "gD98oQ",
          description: "Heading for details step of a talent nomination",
        })}
      </Heading>
      <div className="grid gap-6 xs:grid-cols-2">
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Nomination options",
            id: "khfdlt",
            description:
              "Label for the nomination options checklist on the details step",
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
            id: "x4/XMp",
            description: "Label for the text input for the reference's name",
          })}
        >
          {referenceName ?? nullMessage}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Reference’s work email",
            id: "aqlXBz",
            description: "Reference work email field",
          })}
        >
          {referenceWorkEmail ?? nullMessage}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Reference's classification",
            id: "TiDfH2",
            description:
              "Label for the reference's input field in nominations details step",
          })}
        >
          {referenceClassification ?? nullMessage}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Reference's department or agency",
            id: "lgF8zK",
            description: "Label for a reference's department",
          })}
        >
          {referenceDepartment ?? nullMessage}
        </FieldDisplay>
      </div>
    </div>
  );
};

export default NominationDetailsSection;
