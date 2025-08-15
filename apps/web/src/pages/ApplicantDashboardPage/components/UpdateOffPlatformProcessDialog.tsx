import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "urql";
import uniqBy from "lodash/uniqBy";
import PencilSquareIcon from "@heroicons/react/24/outline/PencilSquareIcon";

import { Dialog, Button, IconButton } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import {
  commonMessages,
  errorMessages,
  formMessages,
  uiMessages,
} from "@gc-digital-talent/i18n";
import {
  FragmentType,
  getFragment,
  graphql,
  HiringPlatform,
  OffPlatformRecruitmentProcess,
  UpdateOffPlatformRecruitmentProcessInput,
} from "@gc-digital-talent/graphql";
import {
  Combobox,
  Input,
  localizedEnumToOptions,
  objectsToSortedOptions,
  RadioGroup,
  Select,
} from "@gc-digital-talent/forms";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import processMessages from "~/messages/processMessages";
import { splitAndJoin } from "~/utils/nameUtils";
import { getClassificationName } from "~/utils/poolUtils";

import { OffPlatformProcessDialog_Fragment } from "./CreateOffPlatformProcessDialog";

const UpdateOffPlatformProcess_Mutation = graphql(/* GraphQL */ `
  mutation updateOffPlatformRecruitmentProcess(
    $process: UpdateOffPlatformRecruitmentProcessInput!
  ) {
    updateOffPlatformRecruitmentProcess(process: $process) {
      id
    }
  }
`);

const DeleteOffPlatformProcess_Mutation = graphql(/* GraphQL */ `
  mutation deleteOffPlatformRecruitmentProcess($id: UUID!) {
    deleteOffPlatformRecruitmentProcess(id: $id) {
      id
    }
  }
`);

interface FormValues {
  processNumber: string | null | undefined;
  department: string;
  classificationGroup: string;
  classificationLevel: string;
  platform: HiringPlatform;
  platformOther: string | null | undefined;
}

interface UpdateOffPlatformProcessDialogProps {
  query?: FragmentType<typeof OffPlatformProcessDialog_Fragment>;
  process: Omit<OffPlatformRecruitmentProcess, "user">;
}

const UpdateOffPlatformProcessDialog = ({
  query,
  process,
}: UpdateOffPlatformProcessDialogProps) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const methods = useForm<FormValues>({
    defaultValues: {
      processNumber: process.processNumber,
      department: process.department?.id,
      classificationGroup: process.classification?.group,
      classificationLevel: process.classification?.level?.toString(),
      platform: process.platform?.value,
      platformOther: process.platformOther,
    },
  });
  const { watch, handleSubmit, resetField, reset } = methods;
  const [groupSelection, platformSelection] = watch([
    "classificationGroup",
    "platform",
  ]);

  const data = getFragment(OffPlatformProcessDialog_Fragment, query);
  const departments = unpackMaybes(data?.departments);
  const classifications = unpackMaybes(data?.classifications);
  const hiringPlatforms = data?.hiringPlatforms;

  const classGroupsWithDupes: {
    label: string;
    ariaLabel: string;
  }[] = classifications.map((classification) => {
    return {
      label:
        classification.group ||
        intl.formatMessage({
          defaultMessage: "Error: classification group not found.",
          id: "YA/7nb",
          description: "Error message if classification group is not defined.",
        }),
      ariaLabel: `${classification.name?.localized} ${splitAndJoin(
        classification.group,
      )}`,
    };
  });
  const noDupes = uniqBy(classGroupsWithDupes, "label");
  const groupOptions = noDupes.map(({ label, ariaLabel }) => {
    return {
      value: label,
      label,
      ariaLabel,
    };
  });

  // generate classification levels from the selected group
  const levelOptions = classifications
    .filter((x) => x.group === groupSelection)
    .map((iterator) => {
      return {
        value: iterator.level,
        label: iterator.level.toString(),
      };
    })
    .sort((a, b) => a.value - b.value);

  const [{ fetching: fetchingUpdate }, executeUpdateMutation] = useMutation(
    UpdateOffPlatformProcess_Mutation,
  );
  const [{ fetching: fetchingDelete }, executeDeleteMutation] = useMutation(
    DeleteOffPlatformProcess_Mutation,
  );

  /**
   * Reset form when dialog is closed
   */
  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  /**
   * Reset classification level when group changes
   * because level options change
   */
  useEffect(() => {
    resetField("classificationLevel", {
      keepDirty: false,
    });
  }, [resetField, groupSelection]);

  // take classification group + level from data, return the matching classification from API
  // need to fit to the expected type when this function is called in formToData
  const classificationFormToId = (
    group: string | undefined,
    level: string | undefined,
  ): string | undefined => {
    return classifications.find(
      (classification) =>
        classification.group === group &&
        classification.level === Number(level),
    )?.id;
  };

  const formValuesToSubmitData = (
    values: FormValues,
  ): UpdateOffPlatformRecruitmentProcessInput => {
    const classificationId = classificationFormToId(
      values.classificationGroup,
      values.classificationLevel,
    );

    return {
      id: process.id,
      processNumber: values.processNumber,
      department: values.department ? { connect: values.department } : null,
      classification: classificationId
        ? {
            connect: classificationId,
          }
        : null,
      platform: values.platform,
      platformOther:
        values.platform === HiringPlatform.Other ? values.platformOther : null,
    };
  };

  const requestMutation = async (
    input: UpdateOffPlatformRecruitmentProcessInput,
  ) => {
    const result = await executeUpdateMutation({ process: input });
    if (result.data?.updateOffPlatformRecruitmentProcess?.id) {
      return result.data.updateOffPlatformRecruitmentProcess.id;
    }
    return Promise.reject(new Error(result.error?.toString()));
  };

  const submitForm: SubmitHandler<FormValues> = async (
    formValues: FormValues,
  ) => {
    await requestMutation(formValuesToSubmitData(formValues))
      .then(() => {
        toast.success(
          intl.formatMessage(commonMessages.accountUpdateSuccessful),
        );
        reset(formValues);
        setOpen(false);
      })
      .catch(() => {
        toast.error(intl.formatMessage(commonMessages.accountUpdateFailed));
      });
  };

  const deleteMutation = async (id: string) => {
    const result = await executeDeleteMutation({ id });
    if (result.data?.deleteOffPlatformRecruitmentProcess?.id) {
      return result.data.deleteOffPlatformRecruitmentProcess.id;
    }
    return Promise.reject(new Error(result.error?.toString()));
  };

  const removeProcess = async () => {
    await deleteMutation(process.id)
      .then(() => {
        toast.success(
          intl.formatMessage(commonMessages.accountUpdateSuccessful),
        );
        setOpen(false);
      })
      .catch(() => {
        toast.error(intl.formatMessage(commonMessages.accountUpdateFailed));
      });
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <IconButton
          color="black"
          icon={PencilSquareIcon}
          className="mr-6 justify-self-end after:absolute after:inset-0 after:content-[''] xs:mr-9"
          label={
            process?.department
              ? intl.formatMessage(
                  {
                    defaultMessage:
                      "{classification} with {departmentName} <hidden>off platform process</hidden>",
                    id: "pBRz2q",
                    description:
                      "Title for an off platform recruitment process if department is given.",
                  },
                  {
                    classification: process.classification
                      ? getClassificationName(process.classification, intl)
                      : intl.formatMessage(commonMessages.notFound),
                    departmentName: process.department.name.localized,
                  },
                )
              : intl.formatMessage(
                  {
                    defaultMessage:
                      "{classification} <hidden>off platform process</hidden>",
                    id: "QtDQkD",
                    description:
                      "Title for an off platform recruitment process if department is not given.",
                  },
                  {
                    classification: process.classification
                      ? getClassificationName(process.classification, intl)
                      : intl.formatMessage(commonMessages.notFound),
                  },
                )
          }
        />
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage:
              "Tell us about recruitment processes you're qualified in on other Government of Canada platforms.",
            id: "knm4b3",
            description: "Dialog subtitle informing of purpose",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Add or edit off-platform process information",
            id: "oiD77w",
            description: "Dialog header informing of purpose",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <p className="mb-4.5">
            {intl.formatMessage({
              defaultMessage:
                "Help recruitment staff better understand your qualifications by adding information about other Government of Canada recruitment processes in which you've qualified. This information will be verified.",
              id: "yO+tlM",
              description: "Explanation of dialog",
            })}
          </p>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(submitForm)}>
              <Input
                id="processNumber"
                type="text"
                label={intl.formatMessage(processMessages.processNumber)}
                name="processNumber"
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
                className="mb-4.5"
              />
              <div className="mb-4.5">
                <Combobox
                  id="department"
                  name="department"
                  label={intl.formatMessage(commonMessages.organization)}
                  options={objectsToSortedOptions(departments, intl)}
                  doNotSort
                />
              </div>
              <div className="mb-4.5 grid gap-6 sm:grid-cols-2">
                <Combobox
                  id="classificationGroup"
                  label={intl.formatMessage({
                    defaultMessage: "Classification group",
                    id: "LF6QNw",
                    description:
                      "Label displayed on for classification group input",
                  })}
                  name="classificationGroup"
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  options={groupOptions}
                />
                <Select
                  id="classificationLevel"
                  label={intl.formatMessage({
                    defaultMessage: "Classification level",
                    id: "5kfun9",
                    description:
                      "Label displayed on for classification level input",
                  })}
                  name="classificationLevel"
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  nullSelection={intl.formatMessage(
                    uiMessages.nullSelectionOptionLevel,
                  )}
                  options={levelOptions}
                  doNotSort
                />
              </div>
              <RadioGroup
                idPrefix="platform"
                legend={intl.formatMessage({
                  defaultMessage: "Platform",
                  id: "rYKGn/",
                  description:
                    "Label displayed on off platform process form for platform input",
                })}
                id="platform"
                name="platform"
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
                items={localizedEnumToOptions(hiringPlatforms, intl)}
              />
              {platformSelection === HiringPlatform.Other && (
                <div className="mt-4.5">
                  <Input
                    id="platformOther"
                    type="text"
                    label={intl.formatMessage({
                      defaultMessage: "Other platform",
                      id: "YK4XOI",
                      description:
                        "Label displayed on off platform process form for other platform input",
                    })}
                    name="platformOther"
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                  />
                </div>
              )}
              <Dialog.Footer>
                <Button disabled={fetchingUpdate} type="submit" color="primary">
                  {fetchingUpdate
                    ? intl.formatMessage(commonMessages.saving)
                    : intl.formatMessage(formMessages.saveChanges)}
                </Button>
                <Dialog.Close>
                  <Button type="button" color="warning" mode="inline">
                    {intl.formatMessage(commonMessages.cancel)}
                  </Button>
                </Dialog.Close>
                <Button
                  type="button"
                  color="error"
                  mode="inline"
                  onClick={removeProcess}
                  disabled={fetchingDelete}
                >
                  {intl.formatMessage({
                    defaultMessage: "Remove process",
                    id: "9x6s5N",
                    description:
                      "Label displayed on off platform process form for remove process button",
                  })}
                </Button>
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default UpdateOffPlatformProcessDialog;
