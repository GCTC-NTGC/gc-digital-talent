import React from "react";
import { defineMessages, useIntl } from "react-intl";
import { useMutation } from "urql";
import ArrowUturnLeftIcon from "@heroicons/react/24/outline/ArrowUturnLeftIcon";

import { Button, Dialog } from "@gc-digital-talent/ui";
import {
  Maybe,
  PoolCandidateStatus,
  graphql,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import {
  commonMessages,
  formMessages,
  getPoolCandidateStatus,
} from "@gc-digital-talent/i18n";

import Important from "./components/Important";

const messages = defineMessages({
  qualified: {
    defaultMessage: "Qualified candidate",
    id: "Q8ta9H",
    description: "Message for qualified candidate",
  },
  disqualified: {
    defaultMessage: "Disqualified",
    id: "NQkEC9",
    description: "Message for disqualified candidate",
  },
});

const FinalDecision_RevertMutation = graphql(/* GraphQL */ `
  mutation FinalDecision_RevertMutation($id: UUID!) {
    revertFinalDecision(id: $id) {
      id
    }
  }
`);

interface RevertFinalDecisionDialogProps {
  poolCandidateId: string;
  poolCandidateStatus: Maybe<PoolCandidateStatus> | undefined;
  expiryDate?: Maybe<string> | undefined;
  finalDecisionAt?: Maybe<string> | undefined;
  defaultOpen?: boolean;
}

const RevertFinalDecisionDialog = ({
  poolCandidateId,
  poolCandidateStatus,
  expiryDate,
  finalDecisionAt,
  defaultOpen = false,
}: RevertFinalDecisionDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = React.useState<boolean>(defaultOpen);
  const [, executeMutation] = useMutation(FinalDecision_RevertMutation);

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
    await executeMutation({ id: poolCandidateId })
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

  const isQualified = () => {
    if (
      poolCandidateStatus === PoolCandidateStatus.QualifiedAvailable ||
      poolCandidateStatus === PoolCandidateStatus.Expired
    ) {
      return true;
    }

    if (
      poolCandidateStatus === PoolCandidateStatus.ScreenedOutApplication ||
      poolCandidateStatus === PoolCandidateStatus.ScreenedOutAssessment
    ) {
      return false;
    }

    return null; // mutation should throw an error if it's any other status
  };

  const finalDecisionDate = finalDecisionAt
    ? new Date(finalDecisionAt).toISOString().split("T")[0]
    : intl.formatMessage(commonMessages.notFound);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button
          icon={ArrowUturnLeftIcon}
          type="button"
          color="primary"
          mode="inline"
        >
          {intl.formatMessage({
            defaultMessage: "Revert final decision",
            id: "AGRCgy",
            description:
              "Button label for revert final decision on view pool candidate page",
          })}
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
                    "Candidate was marked <strong>{decision}</strong> on <strong>{date}</strong>",
                  id: "jxH8bt",
                  description:
                    "Qualified candidate details on revert final decision dialog on view pool candidate page",
                },
                {
                  decision: intl.formatMessage(
                    isQualified() ? messages.qualified : messages.disqualified,
                  ),
                  date: isQualified() ? expiryDate : finalDecisionDate,
                },
              )}
            </p>
            {!isQualified() && (
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
                  {intl.formatMessage(
                    poolCandidateStatus
                      ? getPoolCandidateStatus(poolCandidateStatus)
                      : commonMessages.notFound,
                  )}
                </p>
              </div>
            )}
            <p {...(!isQualified() && { "data-h2-font-weight": "base(bold)" })}>
              {intl.formatMessage({
                defaultMessage:
                  "Do you wish to revert this decision and set candidate status to “Under assessment”?",
                id: "5r2C2L",
                description:
                  "Final question on revert final decision dialog on view pool candidate page",
              })}
            </p>
            <Important />
          </div>
          <Dialog.Footer data-h2-justify-content="base(flex-start)">
            <Dialog.Close>
              <Button type="button" color="primary" mode="inline">
                {intl.formatMessage(formMessages.cancelGoBack)}
              </Button>
            </Dialog.Close>
            <Button
              type="submit"
              color="primary"
              mode="solid"
              onClick={handleSubmit}
            >
              {intl.formatMessage({
                defaultMessage: "Revert decision and update status",
                id: "QJi1ZQ",
                description:
                  "Button label to revert final decision on view pool candidate page",
              })}
            </Button>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default RevertFinalDecisionDialog;
