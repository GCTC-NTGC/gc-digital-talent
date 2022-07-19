import * as React from "react";
import TableOfContents from "@common/components/TableOfContents";
import { useIntl } from "react-intl";
import { Submit, TextArea } from "@common/components/form";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import WordCounter from "@common/components/WordCounter/WordCounter";
import { countNumberOfWords } from "@common/helpers/formUtils";
import { errorMessages } from "@common/messages";
import {
  AdvertisementStatus,
  LocalizedString,
  PoolAdvertisement,
} from "../../../api/generated";
import { SectionMetadata, Spacer } from "./EditPool";

type FormValues = {
  YourWorkEn?: LocalizedString["en"];
  YourWorkFr?: LocalizedString["fr"];
};

interface WorkTasksSectionProps {
  poolAdvertisement: PoolAdvertisement;
  sectionMetadata: SectionMetadata;
  onSave: (submitData: unknown) => void;
}

const TEXT_AREA_MAX_WORDS = 200;
const TEXT_AREA_ROWS = 15;

export const WorkTasksSection = ({
  poolAdvertisement,
  sectionMetadata,
  onSave,
}: WorkTasksSectionProps): JSX.Element => {
  const intl = useIntl();

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

  // disabled unless status is draft
  const formDisabled =
    poolAdvertisement.advertisementStatus !== AdvertisementStatus.Draft;

  return (
    <TableOfContents.Section id={sectionMetadata.id}>
      <TableOfContents.Heading>
        <h2 data-h2-margin="b(top, l)" data-h2-font-size="b(p)">
          {sectionMetadata.title}
        </h2>
      </TableOfContents.Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "This information lets applicants know the type of work they will be expected to perform. Talk about the tasks and expectations related to this work.",
          description: "Helper message for filling in the pool work tasks",
        })}
      </p>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSave)}>
          <div data-h2-display="b(flex)">
            <Spacer style={{ flex: 1 }}>
              <TextArea
                id="YourWorkEn"
                label={intl.formatMessage({
                  defaultMessage: "English - Your work",
                  description:
                    "Label for the English - Your Work textarea in the edit pool page.",
                })}
                placeholder={intl.formatMessage({
                  defaultMessage: "Write the key tasks for this job poster...",
                  description:
                    "Placeholder message for  the English - Your Work textarea in the edit pool page.",
                })}
                name="YourWorkEn"
                rules={{
                  validate: {
                    wordCount: (value: string) =>
                      countNumberOfWords(value) <= TEXT_AREA_MAX_WORDS ||
                      intl.formatMessage(errorMessages.overWordLimit, {
                        value: TEXT_AREA_MAX_WORDS,
                      }),
                  },
                }}
                rows={TEXT_AREA_ROWS}
                disabled={formDisabled}
              >
                {!formDisabled && (
                  <div data-h2-align-self="b(flex-end)">
                    <WordCounter
                      text={watchYourWorkEn ?? ""}
                      wordLimit={TEXT_AREA_MAX_WORDS}
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
                  description:
                    "Label for the French - Your Work textarea in the edit pool page.",
                })}
                placeholder={intl.formatMessage({
                  defaultMessage: "Write the key tasks for this job poster...",
                  description:
                    "Placeholder message for the French - Your Work textarea in the edit pool page.",
                })}
                name="YourWorkFr"
                rules={{
                  validate: {
                    wordCount: (value: string) =>
                      countNumberOfWords(value) <= TEXT_AREA_MAX_WORDS ||
                      intl.formatMessage(errorMessages.overWordLimit, {
                        value: TEXT_AREA_MAX_WORDS,
                      }),
                  },
                }}
                rows={TEXT_AREA_ROWS}
                disabled={formDisabled}
              >
                {!formDisabled && (
                  <div data-h2-align-self="b(flex-end)">
                    <WordCounter
                      text={watchYourWorkFr ?? ""}
                      wordLimit={TEXT_AREA_MAX_WORDS}
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
                description: "Text on a button to save the pool work tasks",
              })}
              color="cta"
              mode="solid"
            />
          )}
        </form>
      </FormProvider>
    </TableOfContents.Section>
  );
};

export default WorkTasksSection;
