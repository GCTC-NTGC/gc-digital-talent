import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import CalendarIcon from "@heroicons/react/24/outline/CalendarIcon";
import { ReactNode, JSX } from "react";

import { Button, ToggleSection } from "@gc-digital-talent/ui";
import { DateInput, Submit } from "@gc-digital-talent/forms";
import {
  DATE_FORMAT_STRING,
  convertDateTimeToDate,
  convertDateTimeZone,
  formatDate,
} from "@gc-digital-talent/date-helpers";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import {
  PoolStatus,
  Pool,
  UpdatePoolInput,
  graphql,
  getFragment,
  FragmentType,
} from "@gc-digital-talent/graphql";

import useDeepCompareEffect from "~/hooks/useDeepCompareEffect";
import {
  hasEmptyRequiredFields,
  hasInvalidRequiredFields,
} from "~/validators/process/closingDate";
import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import ToggleForm from "~/components/ToggleForm/ToggleForm";
import processMessages from "~/messages/processMessages";

import { useEditPoolContext } from "../EditPoolContext";
import Display from "./Display";
import { SectionProps } from "../../types";
import ActionWrapper from "../ActionWrapper";
import ClosingDateDialog from "./ClosingDateDialog";

const dialog = (chunks: ReactNode) => <ClosingDateDialog title={chunks} />;

const EditPoolClosingDate_Fragment = graphql(/* GraphQL */ `
  fragment EditPoolClosingDate on Pool {
    id
    status {
      value
      label {
        en
        fr
      }
    }
    closingDate
  }
`);

interface FormValues {
  endDate?: Pool["closingDate"];
}

export type ClosingDateSubmitData = Pick<UpdatePoolInput, "closingDate">;
type ClosingDateSectionProps = SectionProps<
  ClosingDateSubmitData,
  FragmentType<typeof EditPoolClosingDate_Fragment>
>;

const ClosingDateSection = ({
  poolQuery,
  sectionMetadata,
  onSave,
}: ClosingDateSectionProps): JSX.Element => {
  const intl = useIntl();
  const pool = getFragment(EditPoolClosingDate_Fragment, poolQuery);
  const emptyRequired = hasEmptyRequiredFields(pool);
  const invalidRequired = hasInvalidRequiredFields(pool);
  const { isSubmitting } = useEditPoolContext();
  const { isEditing, setIsEditing, icon } = useToggleSectionInfo({
    isNull: emptyRequired, // Only one field
    emptyRequired: invalidRequired,
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

    return onSave({
      closingDate: closingDateInUtc,
    })
      .then(() => {
        methods.reset(formValues, {
          keepDirty: false,
        });
        setIsEditing(false);
      })
      .catch(() => methods.reset(formValues));
  };

  // disabled unless status is draft
  const formDisabled = pool.status?.value !== PoolStatus.Draft;

  const subtitle = intl.formatMessage(
    {
      defaultMessage:
        "The date this recruitment will stop accepting applications. <dialog>Learn more about how closing times work.</dialog>",
      id: "LghLU9",
      description: "Describes what the selecting a closing date for a process.",
    },
    {
      dialog,
    },
  );

  return (
    <ToggleSection.Root
      id={`${sectionMetadata.id}-form`}
      open={isEditing}
      onOpenChange={setIsEditing}
    >
      <ToggleSection.Header
        icon={icon.icon}
        color={icon.color}
        level="h3"
        size="h4"
        toggle={
          <ToggleForm.LabelledTrigger
            disabled={formDisabled}
            sectionTitle={sectionMetadata.title}
          />
        }
        className="font-bold"
      >
        {sectionMetadata.title}
      </ToggleSection.Header>
      <p>{subtitle}</p>
      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          {emptyRequired ? <ToggleForm.NullDisplay /> : <Display pool={pool} />}
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleSave)}>
              <div className="mb-6">
                <DateInput
                  id="endDate"
                  legend={intl.formatMessage(processMessages.closingDate)}
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
                    text={intl.formatMessage(formMessages.saveChanges)}
                    aria-label={intl.formatMessage({
                      defaultMessage: "Save closing date",
                      id: "jttjmJ",
                      description:
                        "Text on a button to save the pool closing date",
                    })}
                    color="secondary"
                    mode="solid"
                    isSubmitting={isSubmitting}
                  />
                )}
                <ToggleSection.Close>
                  <Button mode="inline" type="button" color="warning">
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
