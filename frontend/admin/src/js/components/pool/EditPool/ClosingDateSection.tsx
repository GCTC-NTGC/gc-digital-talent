import * as React from "react";
import TableOfContents from "@common/components/TableOfContents";
import { useIntl } from "react-intl";
import { Input, Submit } from "@common/components/form";
import { FormProvider, useForm } from "react-hook-form";
import { strToDateTimeTz } from "@common/helpers/dateUtils";
import {
  AdvertisementStatus,
  PoolAdvertisement,
  UpdatePoolAdvertisementInput,
} from "../../../api/generated";
import { SectionMetadata, Spacer } from "./EditPool";
import { useEditPoolContext } from "./EditPoolContext";

type FormValues = {
  endDate?: PoolAdvertisement["expiryDate"];
};

export type ClosingDateSubmitData = Pick<
  UpdatePoolAdvertisementInput,
  "expiryDate"
>;
interface ClosingDateSectionProps {
  poolAdvertisement: PoolAdvertisement;
  sectionMetadata: SectionMetadata;
  onSave: (submitData: ClosingDateSubmitData) => void;
}

export const ClosingDateSection = ({
  poolAdvertisement,
  sectionMetadata,
  onSave,
}: ClosingDateSectionProps): JSX.Element => {
  const intl = useIntl();
  const { isSubmitting } = useEditPoolContext();

  const dataToFormValues = (initialData: PoolAdvertisement): FormValues => {
    const parsedDate = new Date(initialData.expiryDate);
    return { endDate: parsedDate.toISOString().split("T")[0] };
  };

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(poolAdvertisement),
  });
  const { handleSubmit } = methods;

  const handleSave = (formValues: FormValues) => {
    onSave({
      expiryDate: strToDateTimeTz(formValues.endDate),
    });
  };

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
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSave)}>
          <div data-h2-display="b(flex)">
            <Spacer style={{ flex: 1 }}>
              <Input
                id="endDate"
                label={intl.formatMessage({
                  defaultMessage: "End Date",
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
