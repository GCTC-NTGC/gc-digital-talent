import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useMutation } from "urql";
import CheckIcon from "@heroicons/react/24/solid/CheckIcon";

import {
  Checkbox,
  CheckboxOption,
  Field,
  Submit,
} from "@gc-digital-talent/forms";
import { NotificationFamily, graphql } from "@gc-digital-talent/graphql";
import { Card } from "@gc-digital-talent/ui";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";

import { dataValuesToFormValues, formValuesToData } from "./utils";
import { FormValues } from "./types";

interface NotificationChecklistProps {
  id: string;
  name: string;
  legend: string;
  subtitle: string;
  disabled?: boolean;
}

const NotificationChecklist = ({
  id,
  name,
  legend,
  subtitle,
  disabled,
}: NotificationChecklistProps) => {
  const intl = useIntl();

  const notificationOptions: CheckboxOption[] = [
    {
      value: "email",
      label: (
        <span className="xs:sr-only">
          {intl.formatMessage(commonMessages.email)}
        </span>
      ),
    },
    {
      value: "inApp",
      label: (
        <span className="xs:sr-only">
          {intl.formatMessage(commonMessages.inApp)}
        </span>
      ),
    },
  ];

  if (disabled) {
    return (
      <div className="mb-6 grid items-center gap-6 xs:grid-cols-[4fr_1fr]">
        <div>
          <p className="mb-3 font-bold">{legend}</p>
          <p className="text-sm">{subtitle}</p>
        </div>
        <div className="flex xs:justify-between">
          {notificationOptions.map(({ value, label }) => {
            const key = `${id}-${value}`;
            return (
              <span key={key} className="flex gap-3 py-1.5 pr-4.5 pl-3">
                <CheckIcon
                  aria-label={intl.formatMessage({
                    defaultMessage: "System notifications are always enabled.",
                    id: "d5X1iR",
                    description:
                      "Aria label for system notification icons in notification settings.",
                  })}
                  aria-hidden="false"
                  className="size-6 rounded-md border border-gray-500 align-middle text-gray dark:border-gray-300"
                />
                <span className="xs:sr-only">{label}</span>
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <Field.Wrapper className="mb-6">
      <Field.Fieldset id={id}>
        <Field.Legend required={false} className="sr-only">
          {legend}
        </Field.Legend>
        <div className="grid items-center gap-6 xs:grid-cols-[4fr_1fr]">
          <div>
            <p className="mb-3 font-bold">{legend}</p>
            <p className="font-bold">{subtitle}</p>
          </div>
          <div className="flex xs:justify-between">
            {notificationOptions.map(({ value, label }) => {
              const checkboxId = `${id}-${value}`;
              return (
                <Checkbox
                  key={checkboxId}
                  id={checkboxId}
                  name={name}
                  label={label}
                  value={value}
                  inCheckList
                />
              );
            })}
          </div>
        </div>
      </Field.Fieldset>
    </Field.Wrapper>
  );
};

interface NotificationSettingsProps {
  enabledEmailNotifications: NotificationFamily[];
  enabledInAppNotifications: NotificationFamily[];
}

const UpdateEnabledNotifications_Mutation = graphql(/* GraphQL */ `
  mutation UpdateEnabledNotifications(
    $enabledEmailNotifications: [NotificationFamily]
    $enabledInAppNotifications: [NotificationFamily]
  ) {
    updateEnabledNotifications(
      enabledEmailNotifications: $enabledEmailNotifications
      enabledInAppNotifications: $enabledInAppNotifications
    ) {
      id
      enabledEmailNotifications
      enabledInAppNotifications
    }
  }
`);

const NotificationSettings = ({
  enabledEmailNotifications,
  enabledInAppNotifications,
}: NotificationSettingsProps) => {
  const intl = useIntl();
  const [, executeMutation] = useMutation(UpdateEnabledNotifications_Mutation);

  const methods = useForm<FormValues>({
    defaultValues: dataValuesToFormValues({
      enabledEmailNotifications,
      enabledInAppNotifications,
    }),
  });

  const { handleSubmit } = methods;

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: could not update settings",
        id: "EG5WpQ",
        description:
          "Message displayed when an error occurs while updating notification settings.",
      }),
    );
  };

  const handleFormSubmit: SubmitHandler<FormValues> = async (
    values: FormValues,
  ) => {
    const data = formValuesToData(values);
    await executeMutation(data)
      .then((result) => {
        if (result.data?.updateEnabledNotifications) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Successfully updated settings",
              id: "ennrdC",
              description:
                "Message displayed when applicant updated their notification settings.",
            }),
          );
        } else {
          handleError();
        }
      })
      .catch(() => {
        handleError();
      });
  };

  const formFields = [
    {
      id: "systemMessages",
      name: "systemMessages",
      legend: intl.formatMessage({
        defaultMessage: "System messages",
        id: "HBmwNb",
        description: "Title for system messages checklist",
      }),
      subtitle: intl.formatMessage({
        defaultMessage:
          "These notifications are required and include email verification and other important communications.",
        id: "blvpQr",
        description: "Subtitle for system messages checklist",
      }),
      disabled: true,
    },
    {
      id: "applicationUpdates",
      name: "applicationUpdates",
      legend: intl.formatMessage({
        defaultMessage: "Application updates",
        id: "v21LPW",
        description: "Title for application updates checklist",
      }),
      subtitle: intl.formatMessage({
        defaultMessage:
          "Get notified about upcoming application deadlines, status changes, and more.",
        id: "XzyFuo",
        description: "Subtitle for application updates checklist",
      }),
    },
    {
      id: "jobAlerts",
      name: "jobAlerts",
      legend: intl.formatMessage({
        defaultMessage: "Job alerts",
        id: "fRoNIK",
        description: "Title for job alerts checklist",
      }),
      subtitle: intl.formatMessage({
        defaultMessage:
          "Get notified when a new job is posted to the platform.",
        id: "u3CPra",
        description: "Subtitle for job alerts checklist",
      }),
    },
  ];

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Card>
          <div className="mb-6 flex flex-col">
            <div className="hidden gap-6 xs:grid xs:grid-cols-[4fr_1fr]">
              <div>{/* For grid template columns */}</div>
              <div className="flex justify-between">
                <p aria-hidden className="w-12">
                  {intl.formatMessage(commonMessages.email)}
                </p>
                <p aria-hidden className="w-12">
                  {intl.formatMessage(commonMessages.inApp)}
                </p>
              </div>
            </div>
            {formFields.map((props) => (
              <NotificationChecklist key={props.id} {...props} />
            ))}
          </div>
          <div className="self-start">
            <Submit text={intl.formatMessage(formMessages.saveChanges)} />
          </div>
        </Card>
      </form>
    </FormProvider>
  );
};

export default NotificationSettings;
