import { useIntl } from "react-intl";

import {
  getFragment,
  graphql,
  TalentNominationLateralMovementOption,
  type FragmentType,
} from "@gc-digital-talent/graphql";
import { Heading, Ul } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { localizedEnumToOptions } from "@gc-digital-talent/forms";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import BoolCheckIcon from "~/components/BoolCheckIcon/BoolCheckIcon";
import talentNominationMessages from "~/messages/talentNominationMessages";
import adminMessages from "~/messages/adminMessages";
import { getFullNameLabel } from "~/utils/nameUtils";

const TalentNominationDetailsDialogNominationDetailsNomination_Fragment =
  graphql(/* GraphQL */ `
    fragment TalentNominationDetailsDialogNominationDetailsNomination on TalentNomination {
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
      lateralMovementOptions {
        value
        label {
          localized
        }
      }
      lateralMovementOptionsOther
      communityDevelopmentPrograms(trashed: WITH) {
        developmentProgram {
          id
          name {
            localized
          }
        }
      }
      developmentProgramOptionsOther
      talentNominationEvent {
        communityDevelopmentPrograms(trashed: WITH) {
          developmentProgram {
            id
            name {
              localized
            }
          }
        }
        includeLeadershipCompetencies
      }
    }
  `);

const TalentNominationDetailsDialogNominationDetailsNominationGroup_Fragment =
  graphql(/* GraphQL */ `
    fragment TalentNominationDetailsDialogNominationDetailsNominationGroup on TalentNominationGroup {
      classificationAtTimeOfAdvancementApproval {
        groupAndLevel
      }
    }
  `);

const TalentNominationDetailsDialogNominationDetailsOptions_Fragment = graphql(
  /* GraphQL */ `
    fragment TalentNominationDetailsDialogNominationDetailsOptions on Query {
      talentNominationLateralMovementOptions: localizedEnumStrings(
        enumName: "TalentNominationLateralMovementOption"
      ) {
        value
        label {
          localized
        }
      }
    }
  `,
);

interface NominationDetailsSectionProps {
  nominationQuery: FragmentType<
    typeof TalentNominationDetailsDialogNominationDetailsNomination_Fragment
  >;
  nominationGroupQuery: FragmentType<
    typeof TalentNominationDetailsDialogNominationDetailsNominationGroup_Fragment
  >;
  optionsQuery: FragmentType<
    typeof TalentNominationDetailsDialogNominationDetailsOptions_Fragment
  >;
}

const NominationDetailsSection = ({
  nominationQuery,
  nominationGroupQuery,
  optionsQuery,
}: NominationDetailsSectionProps) => {
  const intl = useIntl();
  const nomination = getFragment(
    TalentNominationDetailsDialogNominationDetailsNomination_Fragment,
    nominationQuery,
  );
  const nominationGroup = getFragment(
    TalentNominationDetailsDialogNominationDetailsNominationGroup_Fragment,
    nominationGroupQuery,
  );
  const options = getFragment(
    TalentNominationDetailsDialogNominationDetailsOptions_Fragment,
    optionsQuery,
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

  const lateralMovementOptionValuesInThisNomination =
    nomination.lateralMovementOptions?.map((option) => option.value) ?? [];

  // I don't actually need a set of options but the sort is handy
  const lateralMovementListItems = localizedEnumToOptions(
    options?.talentNominationLateralMovementOptions,
    intl,
    [
      TalentNominationLateralMovementOption.SmallDepartment,
      TalentNominationLateralMovementOption.LargeDepartment,
      TalentNominationLateralMovementOption.CentralDepartment,
      TalentNominationLateralMovementOption.NewDepartment,
      TalentNominationLateralMovementOption.ProgramExperience,
      TalentNominationLateralMovementOption.PolicyExperience,
      TalentNominationLateralMovementOption.Other,
    ],
  ).map((option) => ({
    key: option.value,
    value: lateralMovementOptionValuesInThisNomination.includes(
      option.value as TalentNominationLateralMovementOption,
    ),
    label: option.label,
  }));

  const developmentProgramIdsInThisNomination =
    nomination.communityDevelopmentPrograms?.map(
      (cdp) => cdp.developmentProgram.id,
    ) ?? [];

  const developmentProgramListItems =
    nomination.talentNominationEvent.communityDevelopmentPrograms?.map(
      (cdp) => ({
        key: cdp.developmentProgram.id,
        value: developmentProgramIdsInThisNomination.includes(
          cdp.developmentProgram.id,
        ),
        label:
          cdp.developmentProgram.name?.localized ??
          intl.formatMessage(commonMessages.notFound),
      }),
    ) ?? [];

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
        {/* advancement-only fields */}
        {nomination.nominateForAdvancement ? (
          <>
            <FieldDisplay
              label={intl.formatMessage({
                defaultMessage:
                  "Nominee’s classification at the time of nomination",
                id: "qwqI/Y",
                description:
                  "Label for nominee’s classification at the time of advancement",
              })}
              className="xs:col-span-2"
            >
              {/* this mismatch, time of nomination vs time of approval, is intentional */}
              {nominationGroup.classificationAtTimeOfAdvancementApproval
                ?.groupAndLevel ?? nullMessage}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage({
                defaultMessage: "Reference’s name",
                id: "x4/XMp",
                description:
                  "Label for the text input for the reference's name",
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
          </>
        ) : null}
        {/* lateral-only fields */}
        {nomination.nominateForLateralMovement ? (
          <>
            <FieldDisplay
              label={intl.formatMessage({
                defaultMessage: "Lateral experience recommendations",
                id: "syqHHS",
                description: "Label for the lateral movement options",
              })}
              className="xs:col-span-2"
            >
              {lateralMovementListItems.length > 0 ? (
                <Ul space="sm" unStyled>
                  {lateralMovementListItems.map((item) => (
                    <li key={item.key}>
                      <BoolCheckIcon value={item.value}>
                        {item.label}
                      </BoolCheckIcon>
                    </li>
                  ))}
                </Ul>
              ) : null}
            </FieldDisplay>
            {/* only display the OTHER option if it is selected */}
            {lateralMovementOptionValuesInThisNomination.includes(
              TalentNominationLateralMovementOption.Other,
            ) ? (
              <FieldDisplay
                label={intl.formatMessage(commonMessages.other)}
                className="xs:col-span-2"
              >
                {nomination.lateralMovementOptionsOther ? (
                  <BoolCheckIcon value={true}>
                    {nomination.lateralMovementOptionsOther}
                  </BoolCheckIcon>
                ) : (
                  intl.formatMessage(commonMessages.notFound)
                )}
              </FieldDisplay>
            ) : null}
          </>
        ) : null}
        {/* development-only fields */}
        {nomination.nominateForDevelopmentPrograms ? (
          <>
            <FieldDisplay
              label={intl.formatMessage({
                defaultMessage: "Recommended development opportunities",
                id: "uNQzDO",
                description: "Label for Recommended development opportunities",
              })}
              className="xs:col-span-2"
            >
              {developmentProgramListItems.length > 0 ? (
                <Ul space="sm" unStyled>
                  {developmentProgramListItems.map((item) => (
                    <li key={item.key}>
                      <BoolCheckIcon value={item.value}>
                        {item.label}
                      </BoolCheckIcon>
                    </li>
                  ))}
                </Ul>
              ) : null}
            </FieldDisplay>
            {/* only display the OTHER option if it is selected */}
            {nomination.developmentProgramOptionsOther ? (
              <FieldDisplay
                label={intl.formatMessage(commonMessages.other)}
                className="xs:col-span-2"
              >
                <BoolCheckIcon value={true}>
                  {nomination.developmentProgramOptionsOther}
                </BoolCheckIcon>
              </FieldDisplay>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default NominationDetailsSection;
