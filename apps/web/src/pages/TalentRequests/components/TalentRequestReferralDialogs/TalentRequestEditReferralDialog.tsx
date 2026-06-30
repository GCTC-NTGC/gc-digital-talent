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
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages, narrowEnumType } from "@gc-digital-talent/i18n";

import { getFullNameLabel } from "~/utils/nameUtils";

import ReferralDialogFooter from "./ReferralDialogFooter";
import ReferralFormFields, {
  type FormValues,
  type TalentRequestReferralDialogOptions,
} from "./ReferralFormFields";
import ReferralDialogHeader from "./ReferralDialogHeader";
import ReferralHistory from "./ReferralHistory";
import ReferralMatchingSources from "./ReferralMatchingSources";

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

export const TalentRequestEditReferralDialogSourceOptions_Fragment = graphql(
  /* GraphQL */ `
    fragment TalentRequestEditReferralDialogSourceOptions on Query {
      talentRequestSources: localizedEnumOptions(
        enumName: "TalentRequestSource"
      ) {
        ... on LocalizedTalentRequestSource {
          value
          label {
            localized
          }
        }
      }
    }
  `,
);

export type TalentRequestEditReferralDialogSourceOptions = FragmentType<
  typeof TalentRequestEditReferralDialogSourceOptions_Fragment
>;

export const TalentRequestEditReferralDialog_Fragment = graphql(/* GraphQL */ `
  fragment TalentRequestEditReferralDialog on TalentRequestTrackedUser {
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
    sources {
      value
      label {
        localized
      }
    }
    matchingQualifiedInPoolSources {
      ...ReferralMatchingPoolSource
    }
    referralSummary {
      ...ReferralHistory
    }
    user {
      id
      firstName
      lastName
    }
  }
`);

interface TalentRequestEditReferralDialogProps {
  query: FragmentType<typeof TalentRequestEditReferralDialog_Fragment>;
  optionsQuery?: TalentRequestReferralDialogOptions;
  sourceOptionsQuery?: TalentRequestEditReferralDialogSourceOptions;
  trigger?: ReactNode;
  defaultOpen?: boolean;
}

const TalentRequestEditReferralDialog = ({
  query,
  optionsQuery,
  sourceOptionsQuery,
  trigger,
  defaultOpen = false,
}: TalentRequestEditReferralDialogProps) => {
  const intl = useIntl();
  const [isOpen, setOpen] = useState(defaultOpen);
  const trackedUser = getFragment(
    TalentRequestEditReferralDialog_Fragment,
    query,
  );
  const [{ fetching }, executeMutation] = useMutation(
    UpdateTalentRequestTrackedUser_Mutation,
  );

  const userName = getFullNameLabel(
    trackedUser.user.firstName,
    trackedUser.user.lastName,
    intl,
  );

  const sourceOptions = narrowEnumType(
    unpackMaybes(
      getFragment(
        TalentRequestEditReferralDialogSourceOptions_Fragment,
        sourceOptionsQuery,
      )?.talentRequestSources,
    ),
    "TalentRequestSource",
  );
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);
  const sourceLabels = trackedUser.sources.map(
    (value) =>
      sourceOptions.find((o) => o.value === value)?.label.localized ??
      notAvailable,
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
        notReferredReason: values.notReferredReason,
        selectionDecision: values.selectionDecision,
        notSelectedReason: values.notSelectedReason,
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

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Trigger>
        {trigger ?? <Button mode="text">{userName}</Button>}
      </Dialog.Trigger>
      <Dialog.Content>
        <ReferralDialogHeader userName={userName} />
        <Dialog.Body>
          <ReferralMatchingSources
            sourceLabels={sourceLabels}
            matchingPoolSources={trackedUser.matchingQualifiedInPoolSources}
          />
          <ReferralHistory query={trackedUser.referralSummary} />
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

export default TalentRequestEditReferralDialog;
