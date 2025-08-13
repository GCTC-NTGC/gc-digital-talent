import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "urql";
import uniqBy from "lodash/uniqBy";

import { Dialog, Button } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import {
  commonMessages,
  errorMessages,
  formMessages,
  uiMessages,
} from "@gc-digital-talent/i18n";
import {
  CreateOffPlatformRecruitmentProcessInput,
  FragmentType,
  getFragment,
  graphql,
  HiringPlatform,
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

export const OffPlatformProcessDialog_Fragment = graphql(/* GraphQL */ `
  fragment OffPlatformProcessDialog on Query {
    me {
      id
    }
    departments {
      id
      name {
        en
        fr
      }
    }
    classifications {
      id
      name {
        localized
      }
      group
      level
    }
    hiringPlatforms: localizedEnumStrings(enumName: "HiringPlatform") {
      value
      label {
        en
        fr
      }
    }
  }
`);

const CreateOffPlatformProcess_Mutation = graphql(/* GraphQL */ `
  mutation createOffPlatformRecruitmentProcess(
    $process: CreateOffPlatformRecruitmentProcessInput!
  ) {
    createOffPlatformRecruitmentProcess(process: $process) {
      id
    }
  }
`);

interface FormValues {
  processNumber: string;
  department: string;
  classificationGroup: string;
  classificationLevel: string;
  platform: HiringPlatform;
  platformOther: string | null | undefined;
}

interface CreateOffPlatformProcessDialogProps {
  query?: FragmentType<typeof OffPlatformProcessDialog_Fragment>;
}

const CreateOffPlatformProcessDialog = ({
  query,
}: CreateOffPlatformProcessDialogProps) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const methods = useForm<FormValues>();
  const { watch, handleSubmit, resetField, reset } = methods;
  const [groupSelection, platformSelection] = watch([
    "classificationGroup",
    "platform",
  ]);

  const data = getFragment(OffPlatformProcessDialog_Fragment, query);
  const user = data?.me;
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

  const [{ fetching }, executeMutation] = useMutation(
    CreateOffPlatformProcess_Mutation,
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
    userId: string,
    values: FormValues,
  ): CreateOffPlatformRecruitmentProcessInput => {
    const classificationId = classificationFormToId(
      values.classificationGroup,
      values.classificationLevel,
    );

    return {
      userId,
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
    process: CreateOffPlatformRecruitmentProcessInput,
  ) => {
    const result = await executeMutation({ process });
    if (result.data?.createOffPlatformRecruitmentProcess?.id) {
      return result.data.createOffPlatformRecruitmentProcess.id;
    }
    return Promise.reject(new Error(result.error?.toString()));
  };

  const submitForm: SubmitHandler<FormValues> = async (
    formValues: FormValues,
  ) => {
    await requestMutation(formValuesToSubmitData(user?.id ?? "", formValues))
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
      <Dialog.Trigger>
        <Button color="primary" mode="inline" size="sm">
          {intl.formatMessage({
            defaultMessage: "Add an off-platform process",
            id: "cik7wX",
            description: "Button to open dialog to create off-platform process",
          })}
        </Button>
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
                <Button disabled={fetching} type="submit" color="primary">
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

export default CreateOffPlatformProcessDialog;
