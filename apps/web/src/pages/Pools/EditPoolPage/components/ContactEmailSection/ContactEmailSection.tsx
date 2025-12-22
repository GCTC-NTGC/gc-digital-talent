import InboxIcon from "@heroicons/react/24/outline/InboxIcon";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import {
  FragmentType,
  getFragment,
  graphql,
  Pool,
  PoolStatus,
  UpdatePoolInput,
} from "@gc-digital-talent/graphql";
import { Button, ToggleSection } from "@gc-digital-talent/ui";
import { Input, Submit } from "@gc-digital-talent/forms";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";

import useCanUserEditPool from "~/hooks/useCanUserEditPool";
import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import ToggleForm from "~/components/ToggleForm/ToggleForm";

import { PublishedEditableSectionProps, SectionProps } from "../../types";
import { useEditPoolContext } from "../EditPoolContext";
import UpdatePublishedProcessDialog, {
  type FormValues as UpdateFormValues,
} from "../UpdatePublishedProcessDialog/UpdatePublishedProcessDialog";
import ActionWrapper from "../ActionWrapper";
import Display from "./Display";

const EditPoolContactEmail_Fragment = graphql(/* GraphQL */ `
  fragment EditPoolContactEmail on Pool {
    ...UpdatePublishedProcessDialog
    id
    status {
      value
      label {
        en
        fr
      }
    }
    contactEmail
  }
`);

interface FormValues {
  contactEmail?: string;
}

export type ContactEmailSubmitData = Pick<UpdatePoolInput, "contactEmail">;

type ContactEmailSectionProps = SectionProps<
  ContactEmailSubmitData,
  FragmentType<typeof EditPoolContactEmail_Fragment>
> &
  PublishedEditableSectionProps;

const ContactEmailSection = ({
  poolQuery,
  sectionMetadata,
  onSave,
  onUpdatePublished,
}: ContactEmailSectionProps) => {
  const intl = useIntl();
  const pool = getFragment(EditPoolContactEmail_Fragment, poolQuery);
  const isNull = !pool?.contactEmail;
  const emptyRequired = !pool?.contactEmail;
  const canEdit = useCanUserEditPool(pool.status?.value);
  const { isSubmitting } = useEditPoolContext();
  const { isEditing, setIsEditing, icon } = useToggleSectionInfo({
    isNull,
    emptyRequired,
    fallbackIcon: InboxIcon,
  });

  const dataToFormValues = (
    initialData: Pick<Pool, "contactEmail">,
  ): FormValues => ({
    contactEmail: initialData.contactEmail ?? "",
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
    return onSave({
      contactEmail: formValues.contactEmail,
    })
      .then(() => onSuccess(formValues))
      .catch(() => methods.reset(formValues));
  };

  const handleUpdatePublished = async (formValues: UpdateFormValues) => {
    await onUpdatePublished({
      ...formValues,
      contactEmail: values.contactEmail,
    }).then(() => onSuccess({ ...values }));
  };

  const subtitle = intl.formatMessage({
    defaultMessage:
      "This will be the contact information provided to candidates for questions and accommodation requests, and to employees who want to discuss their unsuccessful application.",
    id: "OoYh86",
    description:
      "Describes the 'contact email' section of a process' advertisement",
  });

  const canEditAndIsDraft = canEdit && pool.status?.value === PoolStatus.Draft;
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
      <p>{subtitle}</p>
      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          {isNull ? <ToggleForm.NullDisplay /> : <Display pool={pool} />}
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          <FormProvider {...methods}>
            <form
              onSubmit={
                canEditAndIsDraft
                  ? handleSubmit(handleSave)
                  : (e) => {
                      // This prevents the admin from submitting, when pressing enter on the contact email input,
                      // and receiving an error when trying to update a published pool.
                      e.preventDefault();
                      handleSubmit(handleSave);
                    }
              }
            >
              <div className="grid gap-6">
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  label={intl.formatMessage({
                    defaultMessage: "Contact email",
                    id: "etD6Xy",
                    description: "Title for contact email input",
                  })}
                />
                <ActionWrapper>
                  {canEditAndIsDraft && (
                    <Submit
                      text={intl.formatMessage(formMessages.saveChanges)}
                      aria-label={intl.formatMessage({
                        defaultMessage: "Save contact email",
                        id: "ovpjav",
                        description:
                          "Text on a button to save the pool contact email",
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
              </div>
            </form>
          </FormProvider>
        </ToggleSection.OpenContent>
      </ToggleSection.Content>
    </ToggleSection.Root>
  );
};

export default ContactEmailSection;
