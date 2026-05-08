import { useEffect, useState } from "react";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { useIntl } from "react-intl";
import { useMutation } from "urql";

import { Button, Dialog, Heading } from "@gc-digital-talent/ui";
import {
  commonMessages,
  errorMessages,
  formMessages,
} from "@gc-digital-talent/i18n";
import { Checkbox, Combobox } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import { graphql, type Classification } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

const EditProfessionalization_Mutation = graphql(/* GraphQL */ `
  mutation EditProfessionalization(
    $updateCommunityDevelopmentProgram: UpdateCommunityDevelopmentProgramInput!
  ) {
    updateCommunityDevelopmentProgram(
      updateCommunityDevelopmentProgram: $updateCommunityDevelopmentProgram
    ) {
      id
    }
  }
`);

export interface FormValues {
  needForRestrictions: boolean;
  restrictedClassifications: string[];
}

interface EditDialogProps {
  classifications: Pick<Classification, "id" | "group" | "level">[];
  communityDevelopmentProgramId: string;
  defaultValues: FormValues;
  professionalizationName: string;
}

const EditDialog = ({
  classifications,
  communityDevelopmentProgramId,
  defaultValues,
  professionalizationName,
}: EditDialogProps) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);

  const [{ fetching }, executeMutation] = useMutation(
    EditProfessionalization_Mutation,
  );

  const methods = useForm<FormValues>({
    defaultValues,
  });
  const { handleSubmit, resetField } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (values: FormValues) => {
    return executeMutation({
      updateCommunityDevelopmentProgram: {
        id: communityDevelopmentProgramId,
        classifications: { sync: values.restrictedClassifications },
      },
    })
      .then((result) => {
        if (result.data?.updateCommunityDevelopmentProgram?.id) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Professionalization updated successfully!",
              id: "PO94zE",
              description:
                "Message displayed to user after professionalization is updated successfully.",
            }),
          );
          setOpen(false);
          return result.data.updateCommunityDevelopmentProgram.id;
        }
        return Promise.reject(new Error(result.error?.toString()));
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating professionalization failed",
            id: "7Yj7lq",
            description:
              "Message displayed to user after professionalization fails to get updated.",
          }),
        );
      });
  };

  const watchNeedForRestrictions = methods.watch("needForRestrictions");

  useEffect(() => {
    if (watchNeedForRestrictions === false) {
      resetField("restrictedClassifications", { defaultValue: [] });
    }
  }, [watchNeedForRestrictions]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button color="primary" mode="text" className="w-full">
          {intl.formatMessage(formMessages.editDetails)}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage(
            {
              defaultMessage:
                "Update information related to {professionalizationName}",
              id: "JKnhJV",
              description: "Dialog subtitle for editing a professionalization",
            },
            { professionalizationName },
          )}
        >
          {intl.formatMessage({
            defaultMessage: "Edit a professionalization",
            id: "ASIVSx",
            description: "Dialog header for editing a professionalization",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Heading
                level="h3"
                color="black"
                size="h6"
                className="mt-0 font-bold"
              >
                {intl.formatMessage({
                  defaultMessage: "Classification restrictions",
                  id: "V3zpN4",
                  description:
                    "Sub heading for restricted classifications section",
                })}
              </Heading>
              <p className="mb-6">
                {intl.formatMessage({
                  defaultMessage:
                    "In some cases, training or certifications might be limited to individual classification groups or even levels. If this professionalization is restricted, please indicate which groups and levels are allowed to participate.",
                  id: "zq0KlM",
                  description:
                    "Description for restricted classifications section",
                })}
              </p>
              <Checkbox
                id="needForRestrictions"
                name="needForRestrictions"
                boundingBox
                boundingBoxLabel={intl.formatMessage({
                  defaultMessage: "Need for restrictions",
                  id: "2zMuV4",
                  description:
                    "Bounding box label or restricted classifications section",
                })}
                label={intl.formatMessage({
                  defaultMessage:
                    "This program or certification is limited to employees in a specific classification or group of classifications",
                  id: "k34TIE",
                  description:
                    "Label displayed on need for classification restrictions checkbox",
                })}
                context={intl.formatMessage({
                  defaultMessage:
                    "Note: if the program or certification is available to all classifications managed by your community, please leave this field blank.",
                  id: "s6SILv",
                  description:
                    "Additional context for classification restrictions checkbox",
                })}
              />
              {watchNeedForRestrictions ? (
                <div className="mt-6">
                  <Combobox
                    id="restrictedClassifications"
                    name="restrictedClassifications"
                    isMulti
                    label={intl.formatMessage({
                      defaultMessage: "Permitted classifications",
                      id: "OHb3HT",
                      description: "Label for classifications multi select",
                    })}
                    options={unpackMaybes(classifications).map(
                      ({ id, group, level }) => ({
                        value: id,
                        label: `${group}-${level < 10 ? "0" : ""}${level}`,
                      }),
                    )}
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                  />
                </div>
              ) : null}
              <Dialog.Footer>
                <Button color="primary">
                  {fetching
                    ? intl.formatMessage(commonMessages.saving)
                    : intl.formatMessage(formMessages.saveChanges)}
                </Button>
                <Dialog.Close>
                  <Button type="button" color="warning" mode="inline">
                    {intl.formatMessage(commonMessages.cancel)}
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

export default EditDialog;
