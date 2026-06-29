import { defineMessage, useIntl } from "react-intl";
import { useMutation } from "urql";
import { FormProvider, useForm } from "react-hook-form";

import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { Dialog } from "@gc-digital-talent/ui";
import { HiddenInput } from "@gc-digital-talent/forms";
import { commonMessages } from "@gc-digital-talent/i18n";

import type { ApplicationStatusFormProps, MutationMessages } from "../types";
import { ReinstateCandidate_Mutation } from "./mutations";
import { Content } from "./StatusContent";
import messages from "./messages";

const RemovedStatusForm_Fragment = graphql(/** GraphQL */ `
  fragment RemovedStatusForm on PoolCandidate {
    ...ApplicationStatusDialogContent
    removalReason {
      label {
        localized
      }
    }
  }
`);

interface FormValues {
  id: string;
}

const mutationMessages: MutationMessages = {
  success: defineMessage({
    defaultMessage: "Candidate reinstated successfully.",
    id: "SFf5/H",
    description: "Success message after reinstating a candidate",
  }),
  error: defineMessage({
    defaultMessage: "Error: Could not reinstate candidate",
    id: "0qOTwx",
    description: "Error message when candidate could not be reinstated",
  }),
};

interface RemovedStatusFormProps extends ApplicationStatusFormProps {
  query: FragmentType<typeof RemovedStatusForm_Fragment>;
}

const RemovedStatusForm = ({ id, onSubmit, query }: RemovedStatusFormProps) => {
  const intl = useIntl();
  const application = getFragment(RemovedStatusForm_Fragment, query);
  const [, reinstateCandidate] = useMutation(ReinstateCandidate_Mutation);

  const methods = useForm<FormValues>({
    defaultValues: { id },
  });

  const handleSubmit = async () => {
    await onSubmit(reinstateCandidate({ id }), mutationMessages);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <Dialog.Body>
          <HiddenInput name="id" />
          <Content
            query={application}
            reason={
              application.removalReason?.label.localized ??
              intl.formatMessage(commonMessages.notAvailable)
            }
            submitProps={{
              color: "warning",
              label: intl.formatMessage(messages.revertSubmit),
            }}
          />
        </Dialog.Body>
      </form>
    </FormProvider>
  );
};

export default RemovedStatusForm;
