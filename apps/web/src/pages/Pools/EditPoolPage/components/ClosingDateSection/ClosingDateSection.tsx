import * as React from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import CalendarIcon from "@heroicons/react/24/outline/CalendarIcon";

import { Button, ToggleSection } from "@gc-digital-talent/ui";
import { DateInput, Submit } from "@gc-digital-talent/forms";
import {
  DATE_FORMAT_STRING,
  convertDateTimeToDate,
  convertDateTimeZone,
  formatDate,
} from "@gc-digital-talent/date-helpers";
import { commonMessages } from "@gc-digital-talent/i18n";

import useDeepCompareEffect from "~/hooks/useDeepCompareEffect";
import { PoolStatus, Pool, UpdatePoolInput } from "~/api/generated";
import { getExperienceFormLabels } from "~/utils/experienceUtils";
import { hasEmptyRequiredFields } from "~/validators/process/closingDate";
import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import ToggleForm from "~/components/ToggleForm/ToggleForm";

import { useEditPoolContext } from "../EditPoolContext";
import Display from "./Display";
import { SectionProps } from "../../types";
import ActionWrapper from "../ActionWrapper";

type FormValues = {
  endDate?: Pool["closingDate"];
};

export type ClosingDateSubmitData = Pick<UpdatePoolInput, "closingDate">;
type ClosingDateSectionProps = SectionProps<ClosingDateSubmitData>;

const ClosingDateSection = ({
  pool,
  sectionMetadata,
  onSave,
}: ClosingDateSectionProps): JSX.Element => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);
  const emptyRequired = hasEmptyRequiredFields(pool);
  const { isSubmitting } = useEditPoolContext();
  const { isEditing, setIsEditing, icon } = useToggleSectionInfo({
    isNull: emptyRequired, // Only one field
    emptyRequired,
    fallbackIcon: CalendarIcon,
  });

  const dataToFormValues = (initialData: Pool): FormValues => {
    const closingDateInPacific = initialData.closingDate
      ? convertDateTimeToDate(
          convertDateTimeZone(initialData.closingDate, "UTC", "Canada/Pacific"),
        )
      : null;

    return {
      endDate: closingDateInPacific,
    };
  };

  const suppliedValues = dataToFormValues(pool);
  const methods = useForm<FormValues>({
    defaultValues: suppliedValues,
  });
  const { handleSubmit, reset } = methods;

  useDeepCompareEffect(() => {
    reset(suppliedValues);
  }, [suppliedValues, reset]);

  const handleSave = async (formValues: FormValues) => {
    const closingDateInUtc = formValues.endDate
      ? convertDateTimeZone(
          `${formValues.endDate} 23:59:59`,
          "Canada/Pacific",
          "UTC",
        )
      : null;

    await onSave({
      closingDate: closingDateInUtc,
    }).then(() => {
      methods.reset(formValues, {
        keepDirty: false,
      });
      setIsEditing(false);
    });
  };

  // disabled unless status is draft
  const formDisabled = pool.status !== PoolStatus.Draft;

  const subtitle = intl.formatMessage({
    defaultMessage:
      "Select a closing date for your process. The closing time will be automatically set to 11:59 PM in the Pacific time zone.",
    id: "3aiqQT",
    description: "Describes what the selecting a closing date for a process.",
  });

  return (
    <ToggleSection.Root
      id={`${sectionMetadata.id}-form`}
      open={isEditing}
      onOpenChange={setIsEditing}
    >
      <ToggleSection.Header
        Icon={icon.icon}
        color={icon.color}
        level="h3"
        size="h5"
        toggle={
          <ToggleForm.LabelledTrigger
            disabled={formDisabled}
            sectionTitle={sectionMetadata.title}
          />
        }
      >
        {sectionMetadata.title}
      </ToggleSection.Header>
      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          {emptyRequired ? (
            <ToggleForm.NullDisplay
              title={sectionMetadata.id}
              content={subtitle}
            />
          ) : (
            <Display pool={pool} subtitle={subtitle} />
          )}
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          <p>{subtitle}</p>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleSave)}>
              <div data-h2-margin="base(x1 0)">
                <DateInput
                  id="endDate"
                  legend={experienceFormLabels.endDate}
                  name="endDate"
                  disabled={formDisabled}
                  rules={{
                    min: {
                      value: formatDate({
                        date: new Date(),
                        formatString: DATE_FORMAT_STRING,
                        intl,
                      }),
                      message: intl.formatMessage({
                        defaultMessage: "Closing date must be after today.",
                        id: "RXOgrq",
                        description:
                          "Error message for closing date on a process advertisement.",
                      }),
                    },
                  }}
                />
              </div>

              <ActionWrapper>
                {!formDisabled && (
                  <Submit
                    text={intl.formatMessage({
                      defaultMessage: "Save closing date",
                      id: "jttjmJ",
                      description:
                        "Text on a button to save the pool closing date",
                    })}
                    color="tertiary"
                    mode="solid"
                    isSubmitting={isSubmitting}
                  />
                )}
                <ToggleSection.Close>
                  <Button mode="inline" type="button" color="quaternary">
                    {intl.formatMessage(commonMessages.cancel)}
                  </Button>
                </ToggleSection.Close>
              </ActionWrapper>
            </form>
          </FormProvider>
        </ToggleSection.OpenContent>
      </ToggleSection.Content>
    </ToggleSection.Root>
  );
};

export default ClosingDateSection;
