import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";
import { useState } from "react";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { useIntl } from "react-intl";
import { useMutation } from "urql";

import { Button, Dialog, Heading, Ul } from "@gc-digital-talent/ui";
import {
  commonMessages,
  errorMessages,
  uiMessages,
} from "@gc-digital-talent/i18n";
import {
  Checkbox,
  Combobox,
  Select,
  type OptGroupOrOption,
} from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import {
  graphql,
  type Classification,
  type DevelopmentProgram,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

const CreateOrRestoreProfessionalization_Mutation = graphql(/* GraphQL */ `
  mutation CreateOrRestoreProfessionalization(
    $createCommunityDevelopmentProgram: CreateCommunityDevelopmentProgramInput!
  ) {
    createOrRestoreCommunityDevelopmentProgram(
      createCommunityDevelopmentProgram: $createCommunityDevelopmentProgram
    ) {
      id
    }
  }
`);

export interface FormValues {
  professionalization: string;
  needForRestrictions: boolean;
  restrictedClassifications: string[];
}

interface AddDialogProps {
  communityId: string;
  communityName: string;
  classifications: Pick<Classification, "id" | "group" | "level">[];
  developmentPrograms: Pick<DevelopmentProgram, "id" | "name">[];
}

const AddDialog = ({
  communityId,
  communityName,
  classifications,
  developmentPrograms,
}: AddDialogProps) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);

  const [{ fetching }, executeMutation] = useMutation(
    CreateOrRestoreProfessionalization_Mutation,
  );

  const methods = useForm<FormValues>();
  const { handleSubmit, reset } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (values: FormValues) => {
    return executeMutation({
      createCommunityDevelopmentProgram: {
        communityId,
        developmentProgramId: values.professionalization,
        classifications: { sync: values.restrictedClassifications },
      },
    })
      .then((result) => {
        if (result.data?.createOrRestoreCommunityDevelopmentProgram?.id) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Professionalization created successfully!",
              id: "GmGDq8",
              description:
                "Message displayed to user after professionalization is created successfully.",
            }),
          );
          setOpen(false);
          reset();
          return result.data.createOrRestoreCommunityDevelopmentProgram.id;
        }
        return Promise.reject(new Error(result.error?.toString()));
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: creating professionalization failed",
            id: "jNDO+4",
            description:
              "Message displayed to user after professionalization fails to get created.",
          }),
        );
      });
  };

  const watchNeedForRestrictions = methods.watch("needForRestrictions");

  const professionalizations: OptGroupOrOption[] = developmentPrograms.map(
    (program) => ({
      label: program.name.localized,
      value: program.id,
    }),
  );

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button
          color="primary"
          mode={"placeholder"}
          icon={PlusCircleIcon}
          block
        >
          {intl.formatMessage({
            defaultMessage: "Add a professionalization",
            id: "1c2UAL",
            description: "Label for adding a professionalization",
          })}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage(
            {
              defaultMessage:
                "Link a program, certification or license to the {communityName}",
              id: "yYQ9yi",
              description: "Dialog subtitle for adding a professionalization",
            },
            { communityName },
          )}
        >
          {intl.formatMessage({
            defaultMessage: "Add a professionalization",
            id: "1c2UAL",
            description: "Label for adding a professionalization",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <p className="mb-3">
            {intl.formatMessage({
              defaultMessage:
                "Adding a professionalization to the community offers two important benefits",
              id: "IIH8L+",
              description: "Dialog body text for adding a professionalization",
            })}
            {intl.formatMessage(commonMessages.dividingColon)}
          </p>
          <Ul className="mb-6">
            <li>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Highlighting important programs, certifications or licenses that will be presented to users who join the community, where they can then indicate their interest or credentials",
                  id: "CZqu7B",
                  description:
                    "Dialog body text for highlighting important programs, certifications or licenses",
                })}
              </p>
            </li>
            <li>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Providing development opportunity options during Talent Management nominations",
                  id: "WpoUnf",
                  description:
                    "Dialog body text for providing development opportunity options during Talent Management nominations",
                })}
              </p>
            </li>
          </Ul>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Select
                id="professionalization"
                name="professionalization"
                label={intl.formatMessage({
                  defaultMessage: "Select a professionalization",
                  id: "3mjCGy",
                  description:
                    "Label for the select a professionalization input",
                })}
                nullSelection={intl.formatMessage(
                  uiMessages.nullSelectionOption,
                )}
                options={professionalizations}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
                className="mb-6"
              />
              <div className="mb-6">
                <Heading
                  level="h3"
                  color="black"
                  className="mt-0 text-base font-bold"
                >
                  {intl.formatMessage({
                    defaultMessage: "Classification restrictions",
                    id: "V3zpN4",
                    description:
                      "Sub heading for restricted classifications section",
                  })}
                </Heading>
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "In some cases, training or certifications might be limited to individual classification groups or even levels. If this professionalization is restricted, please indicate which groups and levels are allowed to participate.",
                    id: "zq0KlM",
                    description:
                      "Description for restricted classifications section",
                  })}
                </p>
              </div>
              <div className="mb-6">
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
                      "<strong>Note</strong>: if the program or certification is available to all classifications managed by your community, please leave this field blank.",
                    id: "YeS9xM",
                    description:
                      "Additional context for classification restrictions checkbox",
                  })}
                />
              </div>
              {watchNeedForRestrictions ? (
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
                />
              ) : null}
              <Dialog.Footer>
                <Button color="primary" disabled={fetching}>
                  {fetching
                    ? intl.formatMessage(commonMessages.saving)
                    : intl.formatMessage({
                        defaultMessage: "Add professionalization",
                        id: "fg0pzd",
                        description: "Button to add a professionalization",
                      })}
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

export default AddDialog;
