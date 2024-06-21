import { useState } from "react";
import { defineMessage, useIntl } from "react-intl";
import { useMutation } from "urql";
import { FormProvider, useForm } from "react-hook-form";

import {
  CandidateRemovalReason,
  FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { Button, Dialog } from "@gc-digital-talent/ui";
import { RadioGroup, TextArea, enumToOptions } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import {
  commonMessages,
  errorMessages,
  formMessages,
  getCandidateRemovalReason,
} from "@gc-digital-talent/i18n";

import FormChangeNotifyWell from "~/components/FormChangeNotifyWell/FormChangeNotifyWell";

type FormValues = {
  removalReason?: CandidateRemovalReason;
  removalReasonOther?: string;
};

const RemoveCandidate_Mutation = graphql(/* GraphQL */ `
  mutation RemoveCandidate(
    $id: UUID!
    $removalReason: CandidateRemovalReason!
    $removalReasonOther: String
  ) {
    removeCandidate(
      id: $id
      removalReason: $removalReason
      removalReasonOther: $removalReasonOther
    ) {
      id
    }
  }
`);

export const RemoveCandidateDialog_Fragment = graphql(/* GraphQL */ `
  fragment RemoveCandidateDialog on PoolCandidate {
    id
    removalReason {
      value
    }
    removalReasonOther
  }
`);

const title = defineMessage({
  defaultMessage: "Remove candidate",
  id: "4Z3/xp",
  description: "Title for action to remove a candidate",
});

interface RemoveCandidateDialogProps {
  removalQuery: FragmentType<typeof RemoveCandidateDialog_Fragment>;
  defaultOpen?: boolean;
}

const RemoveCandidateDialog = ({
  removalQuery,
  defaultOpen = false,
}: RemoveCandidateDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const candidate = getFragment(RemoveCandidateDialog_Fragment, removalQuery);

  const [{ fetching }, removeCandidate] = useMutation(RemoveCandidate_Mutation);

  const methods = useForm<FormValues>({
    defaultValues: {
      removalReason: candidate.removalReason ?? undefined,
      removalReasonOther: candidate.removalReasonOther ?? undefined,
    },
  });

  const removalReason = methods.watch("removalReason");

  const submitHandler = async (data: FormValues) => {
    await removeCandidate({
      id: candidate.id,
      removalReason: data.removalReason ?? CandidateRemovalReason.Other,
      removalReasonOther: data.removalReasonOther ?? "",
    })
      .then((res) => {
        if (res.data?.removeCandidate?.id) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Candidate removed successfully",
              id: "slQ7q5",
              description: "Success message for removing a candidate",
            }),
          );
        }

        setIsOpen(false);
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Failed to remove candidate",
            id: "0Ic6ql",
            description: "Error message for removing a candidate",
          }),
        );
      });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button mode="inline" color="error" block>
          {intl.formatMessage(title)}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{intl.formatMessage(title)}</Dialog.Header>
        <Dialog.Body>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(submitHandler)}>
              <div
                data-h2-display="base(flex)"
                data-h2-flex-direction="base(column)"
                data-h2-gap="base(x1 0)"
              >
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "If you wish to remove this candidate from consideration based on reasons outside the assessment process, please specify on the following fields",
                    id: "jI3Kfv",
                    description: "Help text for removing a candidate",
                  })}
                  {intl.formatMessage(commonMessages.dividingColon)}
                </p>
                <RadioGroup
                  idPrefix="removalReason"
                  name="removalReason"
                  legend={intl.formatMessage({
                    defaultMessage: "Reason",
                    id: "4Ahswu",
                    description:
                      "Label for the reason why a candidate is being removed",
                  })}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  items={enumToOptions(CandidateRemovalReason, [
                    CandidateRemovalReason.RequestedToBeWithdrawn,
                    CandidateRemovalReason.NotResponsive,
                    CandidateRemovalReason.Other,
                  ]).map(({ value }) => ({
                    value,
                    label: intl.formatMessage(getCandidateRemovalReason(value)),
                  }))}
                />
                {removalReason === CandidateRemovalReason.Other && (
                  <TextArea
                    id="removalReasonOther"
                    name="removalReasonOther"
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                    label={intl.formatMessage(
                      getCandidateRemovalReason(CandidateRemovalReason.Other),
                    )}
                  />
                )}
                <FormChangeNotifyWell />
              </div>
              <Dialog.Footer>
                <Button type="submit" color="error" disabled={fetching}>
                  {intl.formatMessage({
                    defaultMessage: "Remove candidate and update status",
                    id: "pErNfb",
                    description:
                      "Button text to remove a candidate and update their status",
                  })}
                </Button>
                <Dialog.Close>
                  <Button mode="inline" color="warning">
                    {intl.formatMessage(formMessages.cancelGoBack)}
                  </Button>
                </Dialog.Close>
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default RemoveCandidateDialog;
