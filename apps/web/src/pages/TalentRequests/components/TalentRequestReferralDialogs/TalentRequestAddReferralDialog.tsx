import { useState, type ChangeEventHandler, type ReactNode } from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation } from "urql";

import {
  type FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { Button, Dialog } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";

import { getFullNameLabel } from "~/utils/nameUtils";

import ReferralDialogFooter from "./ReferralDialogFooter";
import ReferralFormFields, {
  type FormValues,
  type TalentRequestReferralDialogOptions,
} from "./ReferralFormFields";
import ReferralDialogHeader from "./ReferralDialogHeader";

const CreateTalentRequestTrackedUser_Mutation = graphql(/* GraphQL */ `
  mutation CreateTalentRequestTrackedUser(
    $input: CreateTalentRequestTrackedUserInput!
  ) {
    createTalentRequestTrackedUser(input: $input) {
      id
      referralDecision {
        value
      }
      notReferredReason {
        value
      }
    }
  }
`);

export const TalentRequestAddReferralDialog_Fragment = graphql(/* GraphQL */ `
  fragment TalentRequestAddReferralDialog on User {
    id
    firstName
    lastName
  }
`);

interface TalentRequestAddReferralDialogProps {
  query: FragmentType<typeof TalentRequestAddReferralDialog_Fragment>;
  talentRequestId: string;
  optionsQuery?: TalentRequestReferralDialogOptions;
  trigger?: ReactNode;
  defaultOpen?: boolean;
}

const TalentRequestAddReferralDialog = ({
  query,
  talentRequestId,
  optionsQuery,
  trigger,
  defaultOpen = false,
}: TalentRequestAddReferralDialogProps) => {
  const intl = useIntl();
  const [isOpen, setOpen] = useState(defaultOpen);
  const user = getFragment(TalentRequestAddReferralDialog_Fragment, query);
  const [{ fetching }, executeMutation] = useMutation(
    CreateTalentRequestTrackedUser_Mutation,
  );

  const userName = getFullNameLabel(user.firstName, user.lastName, intl);

  const methods = useForm<FormValues>({
    defaultValues: {
      referralDecision: undefined,
      notReferredReason: null,
      selectionDecision: null,
      notSelectedReason: null,
    },
  });

  const handleFormChange: ChangeEventHandler<HTMLFormElement> = (e) => {
    if (e.target.name === "referralDecision") {
      methods.setValue("notReferredReason", null, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const handleSubmit = async (values: FormValues) => {
    if (fetching) return;

    await executeMutation({
      input: {
        userId: user.id,
        talentRequestId,
        referralDecision: values.referralDecision,
        notReferredReason: values.notReferredReason,
      },
    })
      .then((res) => {
        if (res.error || !res.data?.createTalentRequestTrackedUser?.id) {
          throw new Error();
        }
        toast.success(
          intl.formatMessage({
            defaultMessage: "User added to tracking.",
            id: "Z0WKY2",
            description:
              "Success message after adding a user to a talent request's tracking list",
          }),
        );
        methods.reset();
        setOpen(false);
      })
      .catch(() =>
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: Failed to add user to tracking",
            id: "tNTSEV",
            description: "Error message when adding a user to tracking fails",
          }),
        ),
      );
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Trigger>
        {trigger ?? <Button mode="text">{userName}</Button>}
      </Dialog.Trigger>
      <Dialog.Content>
        <ReferralDialogHeader userName={userName} />
        <Dialog.Body>
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(handleSubmit)}
              onChange={handleFormChange}
            >
              <ReferralFormFields
                optionsQuery={optionsQuery}
                showSelectionDecision={false}
              />
              <ReferralDialogFooter fetching={fetching} userId={user.id} />
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default TalentRequestAddReferralDialog;
