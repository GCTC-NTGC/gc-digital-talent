import * as React from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";

import { TableOfContents } from "@gc-digital-talent/ui";
import { Input, Submit } from "@gc-digital-talent/forms";
import {
  convertDateTimeToDate,
  convertDateTimeZone,
} from "@gc-digital-talent/date-helpers";

import { useDeepCompareEffect } from "~/hooks/useDeepCompareEffect";
import {
  AdvertisementStatus,
  PoolAdvertisement,
  UpdatePoolAdvertisementInput,
} from "~/api/generated";
import { EditPoolSectionMetadata } from "~/types/pool";
import Spacer from "~/components/Spacer/Spacer";

import { useEditPoolContext } from "./EditPoolContext";

type FormValues = {
  endDate?: PoolAdvertisement["closingDate"];
};

export type ClosingDateSubmitData = Pick<
  UpdatePoolAdvertisementInput,
  "closingDate"
>;
interface ClosingDateSectionProps {
  poolAdvertisement: PoolAdvertisement;
  sectionMetadata: EditPoolSectionMetadata;
  onSave: (submitData: ClosingDateSubmitData) => void;
}

const ClosingDateSection = ({
  poolAdvertisement,
  sectionMetadata,
  onSave,
}: ClosingDateSectionProps): JSX.Element => {
  const intl = useIntl();
  const { isSubmitting } = useEditPoolContext();

  const dataToFormValues = (initialData: PoolAdvertisement): FormValues => {
    const closingDateInPacific = initialData.closingDate
      ? convertDateTimeToDate(
          convertDateTimeZone(initialData.closingDate, "UTC", "Canada/Pacific"),
        )
      : null;

    return {
      endDate: closingDateInPacific,
    };
  };

  const suppliedValues = dataToFormValues(poolAdvertisement);
  const methods = useForm<FormValues>({
    defaultValues: suppliedValues,
  });
  const { handleSubmit, reset } = methods;

  useDeepCompareEffect(() => {
    reset(suppliedValues);
  }, [suppliedValues, reset]);

  const handleSave = (formValues: FormValues) => {
    const closingDateInUtc = formValues.endDate
      ? convertDateTimeZone(
          `${formValues.endDate} 23:59:59`,
          "Canada/Pacific",
          "UTC",
        )
      : null;

    onSave({
      closingDate: closingDateInUtc,
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
            "The closing time will be automatically set to 11:59 PM in the Pacific time zone.",
          id: "Aaas0w",
          description: "Helper message for changing the pool closing date",
        })}
      </p>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSave)}>
          <div data-h2-display="base(flex)">
            <Spacer style={{ flex: 1 }}>
              <Input
                id="endDate"
                label={intl.formatMessage({
                  defaultMessage: "End Date",
                  id: "80DOGy",
                  description:
                    "Label displayed on the pool candidate form end date field.",
                })}
                type="date"
                name="endDate"
                disabled={formDisabled}
              />
            </Spacer>
            <Spacer style={{ flex: 1 }} />
          </div>

          {!formDisabled && (
            <Submit
              text={intl.formatMessage({
                defaultMessage: "Save closing date",
                id: "jttjmJ",
                description: "Text on a button to save the pool closing date",
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

export default ClosingDateSection;
