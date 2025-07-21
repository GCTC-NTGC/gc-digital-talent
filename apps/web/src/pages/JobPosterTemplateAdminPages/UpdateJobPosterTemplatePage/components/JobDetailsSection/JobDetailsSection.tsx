import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import QuestionMarkCircleIcon from "@heroicons/react/24/outline/QuestionMarkCircleIcon";
import { useMutation } from "urql";
import { useEffect, useId } from "react";
import uniqBy from "lodash/uniqBy";

import { Button, CardSeparator, ToggleSection } from "@gc-digital-talent/ui";
import {
  Input,
  localizedEnumToOptions,
  Option,
  RadioGroup,
  Select,
  Submit,
  TextArea,
} from "@gc-digital-talent/forms";
import {
  commonMessages,
  errorMessages,
  formMessages,
  Locales,
  uiMessages,
} from "@gc-digital-talent/i18n";
import {
  graphql,
  FragmentType,
  getFragment,
  UpdateJobPosterTemplateJobDetailsFragment,
  Classification,
  UpdateJobPosterTemplateInput,
  SupervisoryStatus,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { toast } from "@gc-digital-talent/toast";

import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import ToggleForm from "~/components/ToggleForm/ToggleForm";
import Trigger from "~/components/ToggleForm/Trigger";
import { splitAndJoin } from "~/utils/nameUtils";
import { FRENCH_WORDS_PER_ENGLISH_WORD } from "~/constants/talentSearchConstants";

import Display from "./Display";
import { labels } from "./labels";
import { hasAllEmptyFields, hasEmptyRequiredFields } from "./validators";

const TEXT_AREA_MAX_WORDS_EN = 65;

const descriptionWordCountLimits: Record<Locales, number> = {
  en: TEXT_AREA_MAX_WORDS_EN,
  fr: Math.round(TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD),
} as const;

export const InitialData_Fragment = graphql(/* GraphQL */ `
  fragment UpdateJobPosterTemplateJobDetails on JobPosterTemplate {
    id
    name {
      en
      fr
    }
    description {
      en
      fr
    }
    supervisoryStatus {
      value
      label {
        en
        fr
      }
    }
    workDescription {
      en
      fr
    }
    keywords {
      en
      fr
    }
    classification {
      id
      group
      level
    }
    workStream {
      id
      name {
        en
        fr
      }
      community {
        name {
          en
          fr
        }
      }
    }
  }
`);

const Options_Fragment = graphql(/* GraphQL */ `
  fragment UpdateJobPosterTemplateJobDetailsOptions on Query {
    classifications {
      id
      group
      level
      name {
        localized
      }
    }
    supervisoryStatuses: localizedEnumStrings(enumName: "SupervisoryStatus") {
      value
      label {
        localized
      }
    }
    workStreams {
      id
      name {
        localized
      }
    }
  }
`);

const UpdateJobPosterTemplateJobDetails_Mutation = graphql(/* GraphQL */ `
  mutation UpdateJobPosterTemplateJobDetails(
    $jobPosterTemplate: UpdateJobPosterTemplateInput!
  ) {
    updateJobPosterTemplate(jobPosterTemplate: $jobPosterTemplate) {
      id
    }
  }
`);

export interface FormValues {
  id: string | null;
  jobTitleEn: string | null;
  jobTitleFr: string | null;
  descriptionEn: string | null;
  descriptionFr: string | null;
  supervisoryStatus: string | null;
  workStreamId: string | null;
  workDescriptionEn: string | null;
  workDescriptionFr: string | null;
  keywordsEn: string | null;
  keywordsFr: string | null;
  classificationGroup: Classification["group"] | null;
  classificationLevel: Classification["id"] | null;
}

const initialDataToFormValues = ({
  id,
  name,
  description,
  supervisoryStatus,
  workStream,
  workDescription,
  keywords,
  classification,
}: UpdateJobPosterTemplateJobDetailsFragment): FormValues => ({
  id: id,
  jobTitleEn: name?.en ?? null,
  jobTitleFr: name?.fr ?? null,
  descriptionEn: description?.en ?? null,
  descriptionFr: description?.fr ?? null,
  supervisoryStatus: supervisoryStatus?.value ?? null,
  workStreamId: workStream?.id ?? null,
  workDescriptionEn: workDescription?.en ?? null,
  workDescriptionFr: workDescription?.fr ?? null,
  keywordsEn: (keywords?.en ?? []).join(", "),
  keywordsFr: (keywords?.fr ?? []).join(", "),
  classificationGroup: classification?.group ?? null,
  classificationLevel: classification?.id ?? null,
});

const formValuesToMutationInput = ({
  id,
  jobTitleEn,
  jobTitleFr,
  descriptionEn,
  descriptionFr,
  supervisoryStatus,
  workStreamId,
  workDescriptionEn,
  workDescriptionFr,
  keywordsEn,
  keywordsFr,
  classificationLevel,
}: FormValues): UpdateJobPosterTemplateInput => {
  if (!id) {
    throw new Error("Can not submit without an ID"); // should not be possible
  }
  return {
    id: id,
    name: {
      en: jobTitleEn,
      fr: jobTitleFr,
    },
    description: {
      en: descriptionEn,
      fr: descriptionFr,
    },
    supervisoryStatus: supervisoryStatus as SupervisoryStatus,
    workStream: {
      connect: workStreamId,
    },
    workDescription: {
      en: workDescriptionEn,
      fr: workDescriptionFr,
    },
    keywords: {
      en: keywordsEn?.split(",").map((s) => s.trim()),
      fr: keywordsFr?.split(",").map((s) => s.trim()),
    },
    classification: {
      connect: classificationLevel, // the ID for the group-level is in the level input
    },
  };
};

interface JobDetailsSectionProps {
  initialDataQuery: FragmentType<typeof InitialData_Fragment>;
  optionsQuery: FragmentType<typeof Options_Fragment>;
}

const JobDetailsSection = ({
  initialDataQuery,
  optionsQuery,
}: JobDetailsSectionProps) => {
  const intl = useIntl();

  const keywordDescriptionParagraphId = useId();

  const [{ fetching }, executeMutation] = useMutation(
    UpdateJobPosterTemplateJobDetails_Mutation,
  );

  const initialData = getFragment(InitialData_Fragment, initialDataQuery);

  const optionsData = getFragment(Options_Fragment, optionsQuery);

  const classifications = unpackMaybes(optionsData?.classifications);

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

  const workStreams = unpackMaybes(optionsData.workStreams);
  const workStreamOptions = workStreams.map<Option>((workStream) => ({
    value: workStream.id,
    label: workStream.name?.localized,
  }));

  const isNull = hasAllEmptyFields(initialData);
  const { isEditing, setIsEditing } = useToggleSectionInfo({
    isNull,
    emptyRequired: hasEmptyRequiredFields(initialData),
    fallbackIcon: QuestionMarkCircleIcon,
  });

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Failed updating job details",
        id: "0XtxFu",
        description:
          "Message displayed when a user fails to update the job details",
      }),
    );
  };

  const initialFormValues = initialDataToFormValues(initialData);
  const methods = useForm<FormValues>({
    defaultValues: initialFormValues,
  });
  const { watch, resetField, handleSubmit, reset: resetForm } = methods;

  const watchGroupSelection = watch("classificationGroup");

  const handleOpenChange = (open: boolean) => {
    resetForm(initialFormValues);
    setIsEditing(open);
  };

  /**
   * Reset classification level when group changes
   * because level options change
   */
  useEffect(() => {
    resetField("classificationLevel", {
      keepDirty: false,
    });
  }, [resetField, watchGroupSelection]);

  // generate classification levels from the selected group
  const levelOptions = classifications
    .filter((x) => x.group === watchGroupSelection)
    .map((iterator) => {
      return {
        value: iterator.id.toString(), // change the value to id for the query
        label: iterator.level.toString().padStart(2, "0"),
        numericValue: iterator.level, // just used for sorting
      };
    })
    .sort((a, b) => a.numericValue - b.numericValue);

  const handleSave: SubmitHandler<FormValues> = async (
    formValues: FormValues,
  ) => {
    const mutationInput = formValuesToMutationInput(formValues);

    return executeMutation({
      jobPosterTemplate: mutationInput,
    })
      .then((result) => {
        if (result.data?.updateJobPosterTemplate) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Job details updated successfully!",
              id: "qDYel8",
              description:
                "Message displayed when a user successfully updates the job details",
            }),
          );
          setIsEditing(false);
        } else {
          handleError();
        }
      })
      .catch(handleError);
  };

  return (
    <ToggleSection.Root open={isEditing} onOpenChange={handleOpenChange}>
      <Trigger className="flex flex-row justify-end">
        {intl.formatMessage({
          defaultMessage: "Edit job details",
          id: "iZZMzR",
          description: "Trigger to edit the job details",
        })}
      </Trigger>
      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          {isNull ? (
            <ToggleForm.NullDisplay
              displayMode={["content"]}
              content={intl.formatMessage({
                defaultMessage: `This section hasn't been completed yet. Use the "Edit job details" button to get started.`,
                id: "5DZSz/",
                description: "Null message for job details form",
              })}
            />
          ) : (
            <Display initialDataQuery={initialDataQuery} />
          )}
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleSave)}>
              <div className="grid gap-6 xs:grid-cols-1 sm:grid-cols-2">
                <div>
                  <Select
                    id="classificationGroup"
                    label={intl.formatMessage(labels.classificationGroup)}
                    name="classificationGroup"
                    nullSelection={intl.formatMessage(
                      uiMessages.nullSelectionOptionGroup,
                    )}
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                    options={groupOptions}
                  />
                </div>
                <div>
                  <Select
                    id="classificationLevel"
                    label={intl.formatMessage(labels.classificationLevel)}
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
                <div>
                  <Input
                    id="jobTitleEn"
                    label={intl.formatMessage(labels.jobTitleEn)}
                    name="jobTitleEn"
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                    type="text"
                  />
                </div>
                <div>
                  <Input
                    id="jobTitleFr"
                    label={intl.formatMessage(labels.jobTitleFr)}
                    name="jobTitleFr"
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                    type="text"
                  />
                </div>
                <div className="sm:col-span-2">
                  <RadioGroup
                    idPrefix="supervisoryStatus"
                    name="supervisoryStatus"
                    legend={intl.formatMessage(labels.supervisoryStatus)}
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                    items={localizedEnumToOptions(
                      optionsData?.supervisoryStatuses,
                      intl,
                    )}
                  />
                </div>
                <div>
                  <TextArea
                    id="descriptionEn"
                    name="descriptionEn"
                    wordLimit={descriptionWordCountLimits.en}
                    label={intl.formatMessage(labels.descriptionEn)}
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                  />
                </div>
                <div>
                  <TextArea
                    id="descriptionFr"
                    name="descriptionFr"
                    wordLimit={descriptionWordCountLimits.fr}
                    label={intl.formatMessage(labels.descriptionFr)}
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    id="workDescriptionEn"
                    label={intl.formatMessage(labels.workDescriptionEn)}
                    name="workDescriptionEn"
                    type="url"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    id="workDescriptionFr"
                    label={intl.formatMessage(labels.workDescriptionFr)}
                    name="workDescriptionFr"
                    type="url"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Select
                    id="workStreamId"
                    label={intl.formatMessage(labels.workStream)}
                    name="workStreamId"
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                    nullSelection={intl.formatMessage(
                      uiMessages.nullSelectionOption,
                    )}
                    options={workStreamOptions}
                  />
                </div>
                <p className="sm:col-span-2" id={keywordDescriptionParagraphId}>
                  {intl.formatMessage({
                    defaultMessage:
                      "While keywords are optional, they can significantly increase the visibility of a template. Consider using common industry terms of similar job titles.",
                    id: "m02tm1",
                    description: "Description for the keywords inputs",
                  })}
                </p>
                <div>
                  <Input
                    id="keywordsEn"
                    label={intl.formatMessage(labels.keywordsEn)}
                    name="keywordsEn"
                    type="text"
                    context={intl.formatMessage({
                      defaultMessage:
                        "This field accepts a comma separated list of keywords related to the job.",
                      id: "evoQw5",
                      description: "Context for the keywords inputs",
                    })}
                    aria-describedby={keywordDescriptionParagraphId}
                  />
                </div>
                <div>
                  <Input
                    id="keywordsFr"
                    label={intl.formatMessage(labels.keywordsFr)}
                    name="keywordsFr"
                    type="text"
                    context={intl.formatMessage({
                      defaultMessage:
                        "This field accepts a comma separated list of keywords related to the job.",
                      id: "evoQw5",
                      description: "Context for the keywords inputs",
                    })}
                    aria-describedby={keywordDescriptionParagraphId}
                  />
                </div>
              </div>
              <CardSeparator decorative orientation="horizontal" />
              <div className="flex flex-wrap items-center gap-6">
                <Submit
                  text={intl.formatMessage(formMessages.saveChanges)}
                  aria-label={intl.formatMessage({
                    defaultMessage: "Save job details",
                    id: "/1JrDR",
                    description: "Text on a button to save th job details form",
                  })}
                  color="primary"
                  mode="solid"
                  isSubmitting={fetching}
                />
                <ToggleSection.Close>
                  <Button mode="inline" type="button" color="warning">
                    {intl.formatMessage(commonMessages.cancel)}
                  </Button>
                </ToggleSection.Close>
              </div>
            </form>
          </FormProvider>
        </ToggleSection.OpenContent>
      </ToggleSection.Content>
    </ToggleSection.Root>
  );
};

export default JobDetailsSection;
