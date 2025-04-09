import { useState } from "react";
import { IntlShape, useIntl } from "react-intl";

import { Dialog, Button } from "@gc-digital-talent/ui";
import {
  graphql,
  FragmentType,
  getFragment,
  TalentNominationNomineeRelationshipToNominator,
  NominatorInfoDialog_NominationFragment as NominatorInfoDialogNominationFragmentType,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import { getFullNameLabel } from "~/utils/nameUtils";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import messages from "~/messages/talentNominationMessages";
import { getClassificationName } from "~/utils/poolUtils";

const NominatorInfoDialog_NominationFragment = graphql(/* GraphQL */ `
  fragment NominatorInfoDialog_Nomination on TalentNomination {
    id
    nomineeRelationshipToNominator {
      value
      label {
        localized
      }
    }
    nomineeRelationshipToNominatorOther
    submitterRelationshipToNominator {
      value
      label {
        localized
      }
    }
    submitterRelationshipToNominatorOther
    nominee {
      firstName
    }
    nominator {
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

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button color="black" mode="inline" data-h2-padding="base(0)">
          <span data-h2-text-decoration="base(underline)">
            {getFullNameLabel(
              nomination.nominator?.firstName,
              nomination.nominator?.lastName,
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
              {getFullNameLabel(
                nomination.nominator?.firstName,
                nomination.nominator?.lastName,
                intl,
              )}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(messages.nominatorWorkEmail)}
            >
              {nomination.nominator?.workEmail ??
                intl.formatMessage(commonMessages.notProvided)}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(messages.nominatorClassification)}
            >
              {!!nomination.nominator?.classification?.group &&
              !!nomination.nominator.classification.level
                ? getClassificationName(
                    {
                      group: nomination.nominator.classification.group,
                      level: nomination.nominator.classification.level,
                    },
                    intl,
                  )
                : intl.formatMessage(commonMessages.notProvided)}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(messages.nominatorDepartmentAgency)}
            >
              {nomination.nominator?.department?.name?.localized ??
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
