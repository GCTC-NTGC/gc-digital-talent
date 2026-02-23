import { useIntl } from "react-intl";
import { useMutation } from "urql";
import { FormProvider, useForm } from "react-hook-form";

import {
  FragmentType,
  getFragment,
  graphql,
  Scalars,
} from "@gc-digital-talent/graphql";
import { Dialog } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { HiddenInput } from "@gc-digital-talent/forms";

import { ApplicationStatusFormProps, MutationMessages } from "./types";
import { RevertDecision_Mutation } from "./mutations";
import messages from "./messages";
import { Content } from "./StatusContent";

const DisqualifiedStatusForm_Fragment = graphql(/** GraphQL */ `
  fragment DisqualifiedStatusForm on PoolCandidate {
    ...ApplicationStatusDialogContent
    disqualificationReason {
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
  success: messages.revertSuccess,
  error: messages.revertError,
};

interface DisqualifiedStatusFormProps extends ApplicationStatusFormProps {
  query: FragmentType<typeof DisqualifiedStatusForm_Fragment>;
}

const DisqualifiedStatusForm = ({
  id,
  onSubmit,
  query,
}: DisqualifiedStatusFormProps) => {
  const intl = useIntl();
  const application = getFragment(DisqualifiedStatusForm_Fragment, query);
  const [, revertDecision] = useMutation(RevertDecision_Mutation);

  const methods = useForm<FormValues>({
    defaultValues: { id },
  });

  const handleSubmit = async () => {
    await onSubmit(revertDecision({ id }), mutationMessages);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <Dialog.Body>
          <HiddenInput name="id" />
          <Content
            query={application}
            reason={
              application.disqualificationReason?.label.localized ??
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

export default DisqualifiedStatusForm;
