import TagIcon from "@heroicons/react/24/outline/TagIcon";
import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";

import {
  FragmentType,
  getFragment,
  graphql,
  Maybe,
  PoolStatus,
  UpdatePoolInput,
} from "@gc-digital-talent/graphql";
import { Button, ToggleSection } from "@gc-digital-talent/ui";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import { Input, Submit } from "@gc-digital-talent/forms";

import processMessages from "~/messages/processMessages";
import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import ToggleForm from "~/components/ToggleForm/ToggleForm";
import useCanUserEditPool from "~/hooks/useCanUserEditPool";

import { useEditPoolContext } from "./EditPoolContext";
import { PublishedEditableSectionProps, SectionProps } from "../types";
import UpdatePublishedProcessDialog, {
  type FormValues as UpdateFormValues,
} from "./UpdatePublishedProcessDialog/UpdatePublishedProcessDialog";
import ActionWrapper from "./ActionWrapper";

export type ProcessNumberSubmitData = Pick<UpdatePoolInput, "processNumber">;

interface FormValues {
  processNumber?: string;
}

const dataToFormValues = (initialData: {
  processNumber?: Maybe<string>;
}): FormValues => ({
  processNumber: initialData.processNumber ?? "",
});

const formValuesToSubmitData = (
  formValues: FormValues,
): ProcessNumberSubmitData => ({
  processNumber: formValues.processNumber ?? null,
});

const EditPoolProcessNumber_Fragment = graphql(/** GraphQL */ `
  fragment EditPoolProcessNumber on Pool {
    ...UpdatePublishedProcessDialog
    processNumber
    status {
      value
    }
  }
`);

interface ProcessNumberSectionProps
  extends SectionProps<
      ProcessNumberSubmitData,
      FragmentType<typeof EditPoolProcessNumber_Fragment>
    >,
    PublishedEditableSectionProps {}

const ProcessNumberSection = ({
  poolQuery,
  onSave,
  sectionMetadata,
  onUpdatePublished,
}: ProcessNumberSectionProps) => {
  const intl = useIntl();
  const pool = getFragment(EditPoolProcessNumber_Fragment, poolQuery);
  const isNull = !pool?.processNumber;
  const canEdit = useCanUserEditPool(pool.status?.value);
  const { isSubmitting } = useEditPoolContext();
  const { isEditing, setIsEditing, icon } = useToggleSectionInfo({
    isNull,
    emptyRequired: isNull,
    fallbackIcon: TagIcon,
  });

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(pool),
  });
  const { handleSubmit, watch } = methods;
  const values = watch();

  const onSuccess = (formValues: FormValues) => {
    methods.reset(formValues, { keepDirty: true });
    setIsEditing(false);
  };

  const handleSave = async (formValues: FormValues) => {
    return onSave(formValuesToSubmitData(formValues))
      .then(() => onSuccess(formValues))
      .catch(() => methods.reset(formValues));
  };

  const handleUpdatePublished = async (formValues: UpdateFormValues) => {
    await onUpdatePublished({
      ...formValues,
      processNumber: values.processNumber,
    }).then(() => onSuccess({ ...values }));
  };

  return (
    <ToggleSection.Root
      id={`${sectionMetadata.id}-form`}
      open={isEditing}
      onOpenChange={setIsEditing}
    >
      <ToggleSection.Header
        icon={icon.icon}
        color={icon.color}
        level="h3"
        size="h4"
        toggle={
          <ToggleForm.LabelledTrigger
            disabled={!canEdit}
            sectionTitle={sectionMetadata.title}
          />
        }
        className="font-bold"
      >
        {sectionMetadata.title}
      </ToggleSection.Header>
      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          {isNull ? (
            <ToggleForm.NullDisplay />
          ) : (
            <ToggleForm.FieldDisplay
              label={intl.formatMessage(processMessages.processNumber)}
            >
              {pool.processNumber ??
                intl.formatMessage(commonMessages.notProvided)}
            </ToggleForm.FieldDisplay>
          )}
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleSave)}>
              <div className="mb-6">
                <Input
                  id="processNumber"
                  name="processNumber"
                  type="text"
                  label={intl.formatMessage(processMessages.processNumber)}
                  context={intl.formatMessage({
                    defaultMessage:
                      "This process number is obtained from your HR advisor",
                    id: "teUR2H",
                    description:
                      "Additional context describing the pools process number.",
                  })}
                />
              </div>
              <ActionWrapper>
                {canEdit && pool.status?.value === PoolStatus.Draft && (
                  <Submit
                    text={intl.formatMessage(formMessages.saveChanges)}
                    aria-label={intl.formatMessage({
                      defaultMessage: "Save process number",
                      id: "WBvYyt",
                      description:
                        "Text on a button to save the process number",
                    })}
                    color="secondary"
                    mode="solid"
                    isSubmitting={isSubmitting}
                  />
                )}
                {canEdit && pool.status?.value === PoolStatus.Published && (
                  <UpdatePublishedProcessDialog
                    poolQuery={pool}
                    onUpdatePublished={handleUpdatePublished}
                  />
                )}
                <ToggleSection.Close>
                  <Button mode="inline" type="button" color="warning">
                    {intl.formatMessage(commonMessages.cancel)}
                  </Button>
                </ToggleSection.Close>
              </ActionWrapper>
            </form>
          </FormProvider>
        </ToggleSection.OpenContent>
      </ToggleSection.Content>
    </ToggleSection.Root>
  );
};

export default ProcessNumberSection;
