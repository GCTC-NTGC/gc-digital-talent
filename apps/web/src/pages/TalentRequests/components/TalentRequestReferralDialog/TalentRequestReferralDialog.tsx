import { useState, type ChangeEventHandler, type ReactNode } from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation } from "urql";

import {
  type FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Button, Dialog } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";

import { getFullNameLabel } from "~/utils/nameUtils";

import ReferralDialogFooter from "./ReferralDialogFooter";
import ReferralFormFields, {
  type FormValues,
  type TalentRequestReferralDialogOptions,
} from "./ReferralFormFields";

const UpdateTalentRequestTrackedUser_Mutation = graphql(/* GraphQL */ `
  mutation UpdateTalentRequestTrackedUser(
    $id: UUID!
    $input: UpdateTalentRequestTrackedUserInput!
  ) {
    updateTalentRequestTrackedUser(id: $id, input: $input) {
      id
      referralDecision {
        value
      }
      selectionDecision {
        value
      }
      notReferredReason {
        value
      }
      notSelectedReason {
        value
      }
    }
  }
`);

export const TalentRequestReferralDialog_Fragment = graphql(/* GraphQL */ `
  fragment TalentRequestReferralDialog on TalentRequestTrackedUser {
    id
    referralDecision {
      value
    }
    selectionDecision {
      value
    }
    notReferredReason {
      value
    }
    notSelectedReason {
      value
    }
    user {
      id
      firstName
      lastName
    }
  }
`);

interface TalentRequestReferralDialogProps {
  query: FragmentType<typeof TalentRequestReferralDialog_Fragment>;
  optionsQuery?: TalentRequestReferralDialogOptions;
  trigger?: ReactNode;
  defaultOpen?: boolean;
}

const TalentRequestReferralDialog = ({
  query,
  optionsQuery,
  trigger,
  defaultOpen = false,
}: TalentRequestReferralDialogProps) => {
  const intl = useIntl();
  const [isOpen, setOpen] = useState(defaultOpen);
  const trackedUser = getFragment(TalentRequestReferralDialog_Fragment, query);
  const [{ fetching }, executeMutation] = useMutation(
    UpdateTalentRequestTrackedUser_Mutation,
  );

  const userName = getFullNameLabel(
    trackedUser.user.firstName,
    trackedUser.user.lastName,
    intl,
  );

  const methods = useForm<FormValues>({
    defaultValues: {
      referralDecision: trackedUser.referralDecision?.value ?? undefined,
      notReferredReason: trackedUser.notReferredReason?.value ?? null,
      selectionDecision: trackedUser.selectionDecision?.value ?? null,
      notSelectedReason: trackedUser.notSelectedReason?.value ?? null,
    },
  });

  const handleFormChange: ChangeEventHandler<HTMLFormElement> = (e) => {
    if (e.target.name === "referralDecision") {
      const config = { shouldValidate: true, shouldDirty: true };
      methods.setValue("notReferredReason", null, config);
      methods.setValue("selectionDecision", null, config);
      methods.setValue("notSelectedReason", null, config);
    }
    if (e.target.name === "selectionDecision") {
      methods.setValue("notSelectedReason", null, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const handleSubmit = async (values: FormValues) => {
    if (fetching) return;

    await executeMutation({
      id: trackedUser.id,
      input: {
        referralDecision: values.referralDecision,
        notReferredReason: values.notReferredReason ?? undefined,
        selectionDecision: values.selectionDecision ?? undefined,
        notSelectedReason: values.notSelectedReason ?? undefined,
      },
    })
      .then((res) => {
        if (res.error || !res.data?.updateTalentRequestTrackedUser?.id) {
          throw new Error();
        }
        toast.success(
          intl.formatMessage({
            defaultMessage: "Referral decision updated.",
            id: "fHSoZb",
            description:
              "Success message after updating a tracked user referral decision",
          }),
        );
        methods.reset(values);
        setOpen(false);
      })
      .catch(() =>
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: Failed to update referral decision",
            id: "zdEnPY",
            description:
              "Error message when updating a tracked user referral decision fails",
          }),
        ),
      );
  };

  const defaultTrigger = (
    <Button mode="inline">
      {trackedUser.referralDecision?.value
        ? userName
        : intl.formatMessage(commonMessages.notProvided)}
    </Button>
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Trigger>{trigger ?? defaultTrigger}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{userName}</Dialog.Header>
        <Dialog.Body>
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(handleSubmit)}
              onChange={handleFormChange}
            >
              <ReferralFormFields
                optionsQuery={optionsQuery}
                showSelectionDecision
              />
              <ReferralDialogFooter
                fetching={fetching}
                userId={trackedUser.user.id}
              />
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default TalentRequestReferralDialog;
