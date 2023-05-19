import * as React from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import { TableOfContents } from "@gc-digital-talent/ui";
import {
  Submit,
  TextArea,
  WordCounter,
  countNumberOfWords,
} from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";

import {
  AdvertisementStatus,
  LocalizedString,
  PoolAdvertisement,
  UpdatePoolAdvertisementInput,
} from "~/api/generated";
import { EditPoolSectionMetadata } from "~/types/pool";
import Spacer from "~/components/Spacer/Spacer";

import { useEditPoolContext } from "./EditPoolContext";

type FormValues = {
  YourWorkEn?: LocalizedString["en"];
  YourWorkFr?: LocalizedString["fr"];
};

export type WorkTasksSubmitData = Pick<
  UpdatePoolAdvertisementInput,
  "keyTasks"
>;

interface WorkTasksSectionProps {
  poolAdvertisement: PoolAdvertisement;
  sectionMetadata: EditPoolSectionMetadata;
  onSave: (submitData: WorkTasksSubmitData) => void;
}

const TEXT_AREA_MAX_WORDS_EN = 400;
const TEXT_AREA_MAX_WORDS_FR = TEXT_AREA_MAX_WORDS_EN + 100;
const TEXT_AREA_ROWS = 15;

const WorkTasksSection = ({
  poolAdvertisement,
  sectionMetadata,
  onSave,
}: WorkTasksSectionProps): JSX.Element => {
  const intl = useIntl();
  const { isSubmitting } = useEditPoolContext();

  const dataToFormValues = (initialData: PoolAdvertisement): FormValues => ({
    YourWorkEn: initialData.keyTasks?.en ?? "",
    YourWorkFr: initialData.keyTasks?.fr ?? "",
  });

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(poolAdvertisement),
  });
  const { handleSubmit, control } = methods;
  const watchYourWorkEn: FormValues["YourWorkEn"] = useWatch({
    control,
    name: "YourWorkEn",
  });
  const watchYourWorkFr: FormValues["YourWorkFr"] = useWatch({
    control,
    name: "YourWorkFr",
  });

  const handleSave = (formValues: FormValues) => {
    onSave({
      keyTasks: {
        en: formValues.YourWorkEn,
        fr: formValues.YourWorkFr,
      },
    });
    methods.reset(formValues, {
      keepDirty: false,
    });
  };

  // disabled unless status is draft
  const formDisabled =
    poolAdvertisement.advertisementStatus !== AdvertisementStatus.Draft;

  return (
    <TableOfContents.Section id={sectionMetadata.id}>
      <TableOfContents.Heading data-h2-margin="base(x3, 0, x1, 0)">
        {sectionMetadata.title}
      </TableOfContents.Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "This information lets applicants know the type of work they will be expected to perform. Talk about the tasks and expectations related to this work.",
          id: "k9nAP5",
          description: "Helper message for filling in the pool work tasks",
        })}
      </p>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSave)}>
          <div data-h2-display="base(flex)">
            <Spacer style={{ flex: 1 }}>
              <TextArea
                id="YourWorkEn"
                label={intl.formatMessage({
                  defaultMessage: "English - Your work",
                  id: "lb7SoP",
                  description:
                    "Label for the English - Your Work textarea in the edit pool page.",
                })}
                placeholder={intl.formatMessage({
                  defaultMessage: "Write the key tasks for this job poster...",
                  id: "PCuQMN",
                  description:
                    "Placeholder message for  the English - Your Work textarea in the edit pool page.",
                })}
                name="YourWorkEn"
                rules={{
                  validate: {
                    wordCount: (value: string) =>
                      countNumberOfWords(value) <= TEXT_AREA_MAX_WORDS_EN ||
                      intl.formatMessage(errorMessages.overWordLimit, {
                        value: TEXT_AREA_MAX_WORDS_EN,
                      }),
                  },
                }}
                rows={TEXT_AREA_ROWS}
                disabled={formDisabled}
              >
                {!formDisabled && (
                  <div data-h2-align-self="base(flex-end)">
                    <WordCounter
                      text={watchYourWorkEn ?? ""}
                      wordLimit={TEXT_AREA_MAX_WORDS_EN}
                    />
                  </div>
                )}
              </TextArea>
            </Spacer>
            <Spacer style={{ flex: 1 }}>
              <TextArea
                id="YourWorkFr"
                label={intl.formatMessage({
                  defaultMessage: "French - Your work",
                  id: "8bJgxK",
                  description:
                    "Label for the French - Your Work textarea in the edit pool page.",
                })}
                placeholder={intl.formatMessage({
                  defaultMessage: "Write the key tasks for this job poster...",
                  id: "Xsxvql",
                  description:
                    "Placeholder message for the French - Your Work textarea in the edit pool page.",
                })}
                name="YourWorkFr"
                rules={{
                  validate: {
                    wordCount: (value: string) =>
                      countNumberOfWords(value) <= TEXT_AREA_MAX_WORDS_FR ||
                      intl.formatMessage(errorMessages.overWordLimit, {
                        value: TEXT_AREA_MAX_WORDS_FR,
                      }),
                  },
                }}
                rows={TEXT_AREA_ROWS}
                disabled={formDisabled}
              >
                {!formDisabled && (
                  <div data-h2-align-self="base(flex-end)">
                    <WordCounter
                      text={watchYourWorkFr ?? ""}
                      wordLimit={TEXT_AREA_MAX_WORDS_FR}
                    />
                  </div>
                )}
              </TextArea>
            </Spacer>
          </div>

          {!formDisabled && (
            <Submit
              text={intl.formatMessage({
                defaultMessage: "Save work tasks",
                id: "tiv5J7",
                description: "Text on a button to save the pool work tasks",
              })}
              color="cta"
              mode="solid"
              isSubmitting={isSubmitting}
            />
          )}
        </form>
      </FormProvider>
    </TableOfContents.Section>
  );
};

export default WorkTasksSection;
