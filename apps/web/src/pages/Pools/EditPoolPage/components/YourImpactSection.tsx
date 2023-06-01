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
  yourImpactEn?: LocalizedString["en"];
  yourImpactFr?: LocalizedString["fr"];
};

export type YourImpactSubmitData = Pick<
  UpdatePoolAdvertisementInput,
  "yourImpact"
>;

interface YourImpactSectionProps {
  poolAdvertisement: PoolAdvertisement;
  sectionMetadata: EditPoolSectionMetadata;
  onSave: (submitData: YourImpactSubmitData) => void;
}

const TEXT_AREA_MAX_WORDS_EN = 200;
const TEXT_AREA_MAX_WORDS_FR = TEXT_AREA_MAX_WORDS_EN + 100;
const TEXT_AREA_ROWS = 15;

const YourImpactSection = ({
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
            "This information lets applicants know what kind of work and environment they are applying to. Use this space to talk about the area of government this process will aim to improve and the value this work creates.",
          id: "HbzGOJ",
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
                name="yourImpactEn"
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
                      text={watchYourImpactEn ?? ""}
                      wordLimit={TEXT_AREA_MAX_WORDS_EN}
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
                name="yourImpactFr"
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
                      text={watchYourImpactFr ?? ""}
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
