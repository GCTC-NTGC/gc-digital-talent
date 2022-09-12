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
  UpdatePoolAdvertisementInput,
} from "../../../api/generated";
import { SectionMetadata, Spacer } from "./EditPool";
import { useEditPoolContext } from "./EditPoolContext";

type FormValues = {
  yourImpactEn?: LocalizedString["en"];
  yourImpactFr?: LocalizedString["fr"];
};

export type YourImpactSubmitData = Pick<
  UpdatePoolAdvertisementInput,
  "yourImpact"
>;

interface YourImpactSectionProps {
  poolAdvertisement: PoolAdvertisement;
  sectionMetadata: SectionMetadata;
  onSave: (submitData: YourImpactSubmitData) => void;
}

const TEXT_AREA_MAX_WORDS = 200;
const TEXT_AREA_ROWS = 15;

export const YourImpactSection = ({
  poolAdvertisement,
  sectionMetadata,
  onSave,
}: YourImpactSectionProps): JSX.Element => {
  const intl = useIntl();
  const { isSubmitting } = useEditPoolContext();

  const dataToFormValues = (initialData: PoolAdvertisement): FormValues => ({
    yourImpactEn: initialData.yourImpact?.en ?? "",
    yourImpactFr: initialData.yourImpact?.fr ?? "",
  });

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(poolAdvertisement),
  });
  const { handleSubmit, control } = methods;
  const watchYourImpactEn: FormValues["yourImpactEn"] = useWatch({
    control,
    name: "yourImpactEn",
  });
  const watchYourImpactFr: FormValues["yourImpactFr"] = useWatch({
    control,
    name: "yourImpactFr",
  });

  const handleSave = (formValues: FormValues) => {
    onSave({
      yourImpact: {
        en: formValues.yourImpactEn,
        fr: formValues.yourImpactFr,
      },
    });
  };

  // disabled unless status is draft
  const formDisabled =
    poolAdvertisement.advertisementStatus !== AdvertisementStatus.Draft;

  return (
    <TableOfContents.Section id={sectionMetadata.id}>
      <TableOfContents.Heading>
        <h2 data-h2-margin="base(x3, 0, x1, 0)">{sectionMetadata.title}</h2>
      </TableOfContents.Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "This information lets applicants know what kind of work, and environment they are applying to. Use this space to talk about the area of government this process will aim to improve. And the value this kind of work creates.",
          id: "aGI59+",
          description: "Helper message for filling in the pool introduction",
        })}
      </p>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSave)}>
          <div data-h2-display="base(flex)">
            <Spacer style={{ flex: 1 }}>
              <TextArea
                id="yourImpactEn"
                label={intl.formatMessage({
                  defaultMessage: "English - Your impact",
                  id: "NfRLs/",
                  description:
                    "Label for the English - Your Impact textarea in the edit pool page.",
                })}
                placeholder={intl.formatMessage({
                  defaultMessage:
                    "Write the introduction for this job poster...",
                  id: "XprYVQ",
                  description:
                    "Placeholder message for  the English - Your Impact textarea in the edit pool page.",
                })}
                name="yourImpactEn"
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
                  <div data-h2-align-self="base(flex-end)">
                    <WordCounter
                      text={watchYourImpactEn ?? ""}
                      wordLimit={TEXT_AREA_MAX_WORDS}
                    />
                  </div>
                )}
              </TextArea>
            </Spacer>
            <Spacer style={{ flex: 1 }}>
              <TextArea
                id="yourImpactFr"
                label={intl.formatMessage({
                  defaultMessage: "French - Your impact",
                  id: "fPy7Mg",
                  description:
                    "Label for the French - Your Impact textarea in the edit pool page.",
                })}
                placeholder={intl.formatMessage({
                  defaultMessage:
                    "Write the introduction for this job poster...",
                  id: "cQE6qE",
                  description:
                    "Placeholder message for the French - Your Impact textarea in the edit pool page.",
                })}
                name="yourImpactFr"
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
                  <div data-h2-align-self="base(flex-end)">
                    <WordCounter
                      text={watchYourImpactFr ?? ""}
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
                defaultMessage: "Save introduction",
                id: "UduzGA",
                description: "Text on a button to save the pool introduction",
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

export default YourImpactSection;
