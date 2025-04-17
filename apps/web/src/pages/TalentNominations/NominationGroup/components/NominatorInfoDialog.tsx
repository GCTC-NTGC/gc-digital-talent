import { useState } from "react";
import { IntlShape, useIntl } from "react-intl";

import { Dialog, Button, Separator } from "@gc-digital-talent/ui";
import {
  graphql,
  FragmentType,
  getFragment,
  TalentNominationNomineeRelationshipToNominator,
  NominatorInfoDialog_NominationFragment as NominatorInfoDialogNominationFragmentType,
  TalentNominationSubmitterRelationshipToNominator,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import { getFullNameLabel } from "~/utils/nameUtils";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import messages from "~/messages/talentNominationMessages";
import { getClassificationName } from "~/utils/poolUtils";
import {
  getNominatorClassification,
  getNominatorDepartment,
  getNominatorName,
  getNominatorWorkEmail,
} from "~/utils/talentNominations";

const NominatorInfoDialog_NominationFragment = graphql(/* GraphQL */ `
  fragment NominatorInfoDialog_Nomination on TalentNomination {
    id
    nominatorFallbackName
    nominatorFallbackWorkEmail
    nomineeRelationshipToNominatorOther
    submitterRelationshipToNominatorOther
    nomineeRelationshipToNominator {
      value
      label {
        localized
      }
    }
    submitterRelationshipToNominator {
      value
      label {
        localized
      }
    }
    nominee {
      firstName
    }
    nominator {
      id
      firstName
      lastName
      workEmail
      department {
        id
        departmentNumber
        name {
          localized
        }
      }
      classification {
        id
        group
        level
      }
    }
    nominatorFallbackClassification {
      id
      group
      level
    }
    nominatorFallbackDepartment {
      id
      departmentNumber
      name {
        localized
      }
    }
    submitter {
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
  }
`);

const displaySubmitterSection = (
  nominatorId: string | undefined,
  submitterId: string | undefined,
): boolean => {
  if (submitterId && nominatorId !== submitterId) {
    return true;
  }

  return false;
};

const generateNominatorNomineeRelation = (
  relationEnumObject: NominatorInfoDialogNominationFragmentType["nomineeRelationshipToNominator"],
  otherValue: string | null | undefined,
  intlShape: IntlShape,
): string => {
  if (!!relationEnumObject?.label?.localized && !!relationEnumObject.value) {
    if (
      relationEnumObject.value !==
      TalentNominationNomineeRelationshipToNominator.Other
    ) {
      return relationEnumObject.label.localized;
    } else if (otherValue) {
      return otherValue;
    }
  }

  return intlShape.formatMessage(commonMessages.notProvided);
};

const generateNominatorSubmitterRelation = (
  relationEnumObject: NominatorInfoDialogNominationFragmentType["submitterRelationshipToNominator"],
  otherValue: string | null | undefined,
  intlShape: IntlShape,
): string => {
  if (!!relationEnumObject?.label?.localized && !!relationEnumObject.value) {
    if (
      relationEnumObject.value !==
      TalentNominationSubmitterRelationshipToNominator.Other
    ) {
      return relationEnumObject.label.localized;
    } else if (otherValue) {
      return otherValue;
    }
  }

  return intlShape.formatMessage(commonMessages.notProvided);
};

interface NominatorInfoDialogProps {
  nominationQuery: FragmentType<typeof NominatorInfoDialog_NominationFragment>;
}

const NominatorInfoDialog = ({ nominationQuery }: NominatorInfoDialogProps) => {
  const intl = useIntl();

  const [open, setOpen] = useState(false);

  const nomination = getFragment(
    NominatorInfoDialog_NominationFragment,
    nominationQuery,
  );

  const classificationToShow = getNominatorClassification(
    nomination.nominator,
    nomination.nominatorFallbackClassification,
  );
  const departmentToShow = getNominatorDepartment(
    nomination.nominator,
    nomination.nominatorFallbackDepartment,
  );

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button color="black" mode="inline" data-h2-padding="base(0)">
          <span data-h2-text-decoration="base(underline)">
            {getNominatorName(
              nomination.nominator,
              nomination.nominatorFallbackName,
              intl,
            )}
          </span>
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage:
              "Review the nominator's information and, when applicable, information on the employee who submitted the nomination on their behalf.",
            id: "YvFsW9",
            description: "Nominator information view subtitle for dialog",
          })}
        >
          {intl.formatMessage(
            {
              defaultMessage: "{nomineeName}'s nominator",
              id: "J6HyzP",
              description: "Dialog header, nominee's nominator",
            },
            {
              nomineeName:
                nomination.nominee?.firstName ??
                intl.formatMessage(commonMessages.notProvided),
            },
          )}
        </Dialog.Header>
        <Dialog.Body>
          <div
            data-h2-display="base(grid)"
            data-h2-grid-template-columns="base(repeat(1, 1fr)) p-tablet(repeat(2, 1fr))"
            data-h2-gap="base(x1)"
            data-h2-overflow-wrap="base(anywhere)"
          >
            <FieldDisplay label={intl.formatMessage(messages.nominatorName)}>
              {getNominatorName(
                nomination.nominator,
                nomination.nominatorFallbackName,
                intl,
              )}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(messages.nominatorWorkEmail)}
            >
              {getNominatorWorkEmail(
                nomination.nominator,
                nomination.nominatorFallbackWorkEmail,
                intl,
              )}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(messages.nominatorClassification)}
            >
              {classificationToShow?.group && classificationToShow.level
                ? getClassificationName(
                    {
                      group: classificationToShow.group,
                      level: classificationToShow.level,
                    },
                    intl,
                  )
                : intl.formatMessage(commonMessages.notProvided)}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(messages.nominatorDepartmentAgency)}
            >
              {departmentToShow?.name?.localized ??
                intl.formatMessage(commonMessages.notProvided)}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(messages.nominatorRelationNominee)}
            >
              {generateNominatorNomineeRelation(
                nomination.nomineeRelationshipToNominator,
                nomination.nomineeRelationshipToNominatorOther,
                intl,
              )}
            </FieldDisplay>
          </div>
          {displaySubmitterSection(
            nomination.nominator?.id,
            nomination.submitter?.id,
          ) && (
            <>
              <Separator space="none" data-h2-margin="base(x1 0)" />
              <p data-h2-margin-bottom="base(x1)">
                {intl.formatMessage({
                  defaultMessage:
                    "Someone else submitted this nomination on behalf of the nominator. Their information can be found here.",
                  id: "Xb11ag",
                  description:
                    "Information in dialog about submitter being different from nominator",
                })}
              </p>
              <div
                data-h2-display="base(grid)"
                data-h2-grid-template-columns="base(repeat(1, 1fr)) p-tablet(repeat(2, 1fr))"
                data-h2-gap="base(x1)"
                data-h2-overflow-wrap="base(anywhere)"
              >
                <FieldDisplay
                  label={intl.formatMessage(messages.submitterName)}
                >
                  {getFullNameLabel(
                    nomination.submitter?.firstName,
                    nomination.submitter?.lastName,
                    intl,
                  )}
                </FieldDisplay>
                <FieldDisplay
                  label={intl.formatMessage(messages.submitterWorkEmail)}
                >
                  {nomination.submitter?.workEmail ??
                    intl.formatMessage(commonMessages.notProvided)}
                </FieldDisplay>
                <FieldDisplay
                  label={intl.formatMessage(messages.submitterClassification)}
                >
                  {!!nomination.submitter?.classification?.group &&
                  !!nomination.submitter.classification.level
                    ? getClassificationName(
                        {
                          group: nomination.submitter.classification.group,
                          level: nomination.submitter.classification.level,
                        },
                        intl,
                      )
                    : intl.formatMessage(commonMessages.notProvided)}
                </FieldDisplay>
                <FieldDisplay
                  label={intl.formatMessage(messages.submitterDepartmentAgency)}
                >
                  {nomination.submitter?.department?.name?.localized ??
                    intl.formatMessage(commonMessages.notProvided)}
                </FieldDisplay>
                <FieldDisplay
                  label={intl.formatMessage(
                    messages.submitterRelationNominator,
                  )}
                >
                  {generateNominatorSubmitterRelation(
                    nomination.submitterRelationshipToNominator,
                    nomination.submitterRelationshipToNominatorOther,
                    intl,
                  )}
                </FieldDisplay>
              </div>
            </>
          )}
          <Dialog.Footer
            data-h2-gap="base(x1 0) p-tablet(0 x1)"
            data-h2-flex-direction="base(column) p-tablet(row)"
          >
            <Dialog.Close>
              <Button color="secondary" mode="solid">
                {intl.formatMessage(commonMessages.close)}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default NominatorInfoDialog;
