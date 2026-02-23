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
import { HiddenInput } from "@gc-digital-talent/forms";

import { RevertDecision_Mutation } from "./mutations";
import messages from "./messages";
import { Content } from "./StatusContent";
import { ApplicationStatusFormProps, MutationMessages } from "../types";

const QualifiedStatusForm_Fragment = graphql(/** GraphQL */ `
  fragment QualifiedStatusForm on PoolCandidate {
    ...ApplicationStatusDialogContent
  }
`);

interface FormValues {
  id: Scalars["UUID"]["input"];
}

const mutationMessages: MutationMessages = {
  success: messages.revertSuccess,
  error: messages.revertError,
};

interface QualifiedStatusFormProps extends ApplicationStatusFormProps {
  query: FragmentType<typeof QualifiedStatusForm_Fragment>;
}

const QualifiedStatusForm = ({
  id,
  onSubmit,
  query,
}: QualifiedStatusFormProps) => {
  const intl = useIntl();
  const application = getFragment(QualifiedStatusForm_Fragment, query);
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

export default QualifiedStatusForm;
