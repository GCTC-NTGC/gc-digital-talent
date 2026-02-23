import { defineMessage, useIntl } from "react-intl";
import { useMutation } from "urql";
import { FormProvider, useForm } from "react-hook-form";

import {
  FragmentType,
  getFragment,
  graphql,
  Scalars,
} from "@gc-digital-talent/graphql";
import { Dialog } from "@gc-digital-talent/ui";
import { HiddenInput } from "@gc-digital-talent/forms";
import { commonMessages } from "@gc-digital-talent/i18n";

import { ApplicationStatusFormProps, MutationMessages } from "./types";
import { ReinstateCandidate_Mutation } from "./mutations";
import { Content } from "./StatusContent";

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
  id: Scalars["UUID"]["input"];
}

const mutationMessages: MutationMessages = {
  success: defineMessage({
    defaultMessage: "Candidate reinstated successfully!",
    id: "be0Dm6",
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
              label: intl.formatMessage({
                defaultMessage: "Reinstate candidate and update status",
                id: "AA3OTc",
                description: "Button text to reinstate a candidate",
              }),
            }}
          />
        </Dialog.Body>
      </form>
    </FormProvider>
  );
};

export default RemovedStatusForm;
