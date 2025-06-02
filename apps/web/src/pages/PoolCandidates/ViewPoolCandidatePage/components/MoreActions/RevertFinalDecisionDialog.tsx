import { useState } from "react";
import { useIntl } from "react-intl";
import { useMutation } from "urql";

import { Button, Dialog } from "@gc-digital-talent/ui";
import {
  FragmentType,
  PoolCandidateStatus,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import {
  commonMessages,
  formMessages,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import {
  DATE_FORMAT_STRING,
  formatDate,
  parseDateTimeUtc,
} from "@gc-digital-talent/date-helpers";

import poolCandidateMessages from "~/messages/poolCandidateMessages";
import FormChangeNotifyWell from "~/components/FormChangeNotifyWell/FormChangeNotifyWell";
import { isDisqualifiedStatus, isQualifiedStatus } from "~/utils/poolCandidate";

const RevertFinalDecision_Mutation = graphql(/* GraphQL */ `
  mutation RevertFinalDecision_Mutation($id: UUID!) {
    revertFinalDecision(id: $id) {
      id
    }
  }
`);

export const RevertFinalDecisionDialog_Fragment = graphql(/* GraphQL */ `
  fragment RevertFinalDecisionDialog on PoolCandidate {
    id
    expiryDate
    finalDecisionAt
    status {
      value
      label {
        en
        fr
      }
    }
  }
`);

interface RevertFinalDecisionDialogProps {
  revertFinalDecisionQuery: FragmentType<
    typeof RevertFinalDecisionDialog_Fragment
  >;
  defaultOpen?: boolean;
}

const RevertFinalDecisionDialog = ({
  revertFinalDecisionQuery,
  defaultOpen = false,
}: RevertFinalDecisionDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const [, executeMutation] = useMutation(RevertFinalDecision_Mutation);
  const { id, expiryDate, finalDecisionAt, status } = getFragment(
    RevertFinalDecisionDialog_Fragment,
    revertFinalDecisionQuery,
  );

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: could not revert final decision status",
        id: "Iv1kqA",
        description:
          "Message displayed when an error reverting final decision status of pool candidate",
      }),
    );
  };

  const handleSubmit = async () => {
    await executeMutation({ id })
      .then((result) => {
        if (result.data?.revertFinalDecision) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Final decision reverted successfully",
              id: "T+fhB+",
              description:
                "Message displayed when a pool candidate final decision has been updated by an admin",
            }),
          );
          setIsOpen(false);
        } else {
          handleError();
        }
      })
      .catch(() => {
        handleError();
      });
  };

  const isQualified =
    isQualifiedStatus(status?.value) ||
    status?.value === PoolCandidateStatus.Expired;

  const finalDecisionDate = finalDecisionAt
    ? formatDate({
        date: parseDateTimeUtc(finalDecisionAt),
        formatString: DATE_FORMAT_STRING,
        intl,
      })
    : intl.formatMessage(commonMessages.notAvailable);

  if (!isQualified || !isDisqualifiedStatus(status?.value)) {
    intl.formatMessage(commonMessages.notApplicable);
  }
  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button
          type="button"
          color={isQualified ? "secondary" : "error"}
          mode="inline"
        >
          {isQualified ? (
            <>{intl.formatMessage(poolCandidateMessages.qualified)}</>
          ) : (
            <>{intl.formatMessage(poolCandidateMessages.disqualified)}</>
          )}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "Revert final assessment decision",
            id: "C3YsFy",
            description:
              "Subtitle for view revert final decision dialog on view pool candidate page",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <div data-h2-display="base(grid)" data-h2-gap="base(x1)">
            <p>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "Candidate was marked <strong>{decision}</strong> on <strong>{date}</strong>.",
                  id: "iXgAIb",
                  description:
                    "Qualified candidate details on revert final decision dialog on view pool candidate page",
                },
                {
                  decision: intl.formatMessage(
                    isQualified
                      ? poolCandidateMessages.qualified
                      : poolCandidateMessages.disqualified,
                  ),
                  date: isQualified ? expiryDate : finalDecisionDate,
                },
              )}
            </p>
            {!isQualified && (
              <div data-h2-display="base(grid)" data-h2-gap="base(x.5)">
                <p>
                  {intl.formatMessage({
                    defaultMessage: "For the following reason",
                    id: "E0HXwp",
                    description:
                      "Final decision reason heading on revert final decision dialog on view pool candidate page",
                  })}
                  {intl.formatMessage(commonMessages.dividingColon)}
                </p>
                <p data-h2-font-weight="base(bold)">
                  {getLocalizedName(status?.label, intl)}
                </p>
              </div>
            )}
            <p {...(!isQualified && { "data-h2-font-weight": "base(bold)" })}>
              {intl.formatMessage({
                defaultMessage:
                  "Do you wish to revert this decision and set candidate status to “Under assessment”?",
                id: "5r2C2L",
                description:
                  "Final question on revert final decision dialog on view pool candidate page",
              })}
            </p>
            <FormChangeNotifyWell />
          </div>
          <Dialog.Footer>
            <Button type="submit" color="primary" onClick={handleSubmit}>
              {intl.formatMessage({
                defaultMessage: "Revert decision and update status",
                id: "QJi1ZQ",
                description:
                  "Button label to revert final decision on view pool candidate page",
              })}
            </Button>
            <Dialog.Close>
              <Button color="warning" mode="inline">
                {intl.formatMessage(formMessages.cancelGoBack)}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default RevertFinalDecisionDialog;
