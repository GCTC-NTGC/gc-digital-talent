import { useState } from "react";
import { useIntl } from "react-intl";

import { Dialog, Button } from "@gc-digital-talent/ui";
import { graphql, FragmentType, getFragment } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import { getFullNameLabel } from "~/utils/nameUtils";

export const NominatorInfoDialog_NominationFragment = graphql(/* GraphQL */ `
  fragment NominatorInfoDialog_Nomination on TalentNomination {
    id
    nomineeRelationshipToNominator {
      label {
        localized
      }
    }
    nomineeRelationshipToNominatorOther
    submitterRelationshipToNominator {
      label {
        localized
      }
    }
    submitterRelationshipToNominatorOther
    nominee {
      firstName
    }
    nominator {
      firstName
      lastName
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
      firstName
      lastName
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
            defaultMessage: "Abc",
            id: "agQygy",
            description: "Abc",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Abc",
            id: "agQygy",
            description: "Abc",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <p>
            {intl.formatMessage({
              defaultMessage: "Abc",
              id: "agQygy",
              description: "Abc",
            })}
          </p>
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
