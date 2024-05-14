import React from "react";
import { defineMessage, useIntl } from "react-intl";
import { useMutation } from "urql";
import HandRaisedIcon from "@heroicons/react/20/solid/HandRaisedIcon";

import { Button, Dialog } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import {
  DATE_FORMAT_STRING,
  formatDate,
  parseDateTimeUtc,
} from "@gc-digital-talent/date-helpers";
import {
  commonMessages,
  formMessages,
  getCandidateRemovalReason,
} from "@gc-digital-talent/i18n";

import FormChangeNotifyWell from "~/components/FormChangeNotifyWell/FormChangeNotifyWell";

const ReinstateCandidate_Mutation = graphql(/* GraphQL */ `
  mutation ReinstateCandidate($id: UUID!) {
    reinstateCandidate(id: $id) {
      id
    }
  }
`);

export const ReinstateCandidateDialog_Fragment = graphql(/* GraphQL */ `
  fragment ReinstateCandidateDialog on PoolCandidate {
    id
    removedAt
    removalReason
  }
`);

const title = defineMessage({
  defaultMessage: "Reinstate candidate",
  id: "fP0gCn",
  description: "Title for action to reinstate a candidate",
});

interface ReinstateCandidateDialogProps {
  reinstateQuery: FragmentType<typeof ReinstateCandidateDialog_Fragment>;
  defaultOpen?: boolean;
}

const ReinstateCandidateDialog = ({
  reinstateQuery,
  defaultOpen = false,
}: ReinstateCandidateDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = React.useState<boolean>(defaultOpen);
  const candidate = getFragment(
    ReinstateCandidateDialog_Fragment,
    reinstateQuery,
  );

  const [{ fetching }, reinstateCandidate] = useMutation(
    ReinstateCandidate_Mutation,
  );

  const handleReinstate = async () => {
    await reinstateCandidate({ id: candidate.id })
      .then((res) => {
        if (res.data?.reinstateCandidate?.id) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Candidate reinstate successfully",
              id: "qShZxu",
              description: "Success message for reinstating a candidate",
            }),
          );

          setIsOpen(false);
        }
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Failed to reinstate candidate",
            id: "ohLTJS",
            description: "Error message for reinstating a candidate",
          }),
        );
      });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button mode="inline" icon={HandRaisedIcon}>
          {intl.formatMessage(title)}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{intl.formatMessage(title)}</Dialog.Header>
        <Dialog.Body>
          <p data-h2-margin-bottom="base(x1)">
            {intl.formatMessage(
              {
                defaultMessage:
                  'Candidate was marked as <strong>"Removed"</strong> on <strong>{removedDate}</strong>.',
                id: "ehYGss",
                description: "Date the candidate was removed on",
              },
              {
                removedDate: candidate.removedAt
                  ? formatDate({
                      date: parseDateTimeUtc(candidate.removedAt),
                      formatString: DATE_FORMAT_STRING,
                      intl,
                    })
                  : intl.formatMessage(commonMessages.notAvailable),
              },
            )}
          </p>
          <p data-h2-margin="base(x1 0)">
            {intl.formatMessage({
              defaultMessage: "For the following reason",
              id: "4cN/oN",
              description: "Lead in text for a decisions reason",
            })}
            {intl.formatMessage(commonMessages.dividingColon)}
            <span data-h2-font-weight="base(700)">
              {intl.formatMessage(
                candidate.removalReason
                  ? getCandidateRemovalReason(candidate.removalReason)
                  : commonMessages.notProvided,
              )}
            </span>
          </p>
          <p data-h2-margin="base(x1 0)">
            {intl.formatMessage({
              defaultMessage:
                'Do you wish to revert this decision and set the candidate status to "Under assessment"?',
              id: "Wo+T62",
              description: "Confirmation text for reinstating a candidate",
            })}
          </p>
          <FormChangeNotifyWell />

          <Dialog.Footer>
            <Button
              color="secondary"
              disabled={fetching}
              onClick={handleReinstate}
            >
              {intl.formatMessage({
                defaultMessage: "Reinstate candidate and update status",
                id: "CRcpm4",
                description:
                  "Button text to reinstate a candidate and update their status",
              })}
            </Button>
            <Dialog.Close>
              <Button mode="inline" color="warning">
                {intl.formatMessage(formMessages.cancelGoBack)}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ReinstateCandidateDialog;
