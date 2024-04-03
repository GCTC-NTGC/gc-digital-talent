import * as React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useMutation } from "urql";

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

export type UpdateNotificationInput = {
  ignoredEmailNotifications?: [NotificationFamily];
  ignoredInAppNotifications?: [NotificationFamily];
};

interface NotificationChecklistProps {
  id: string;
  name: string;
  options: CheckboxOption[];
  legend: string;
  subtitle: string;
}

const NotificationChecklist = ({
  id,
  name,
  options,
  legend,
  subtitle,
}: NotificationChecklistProps) => {
  return (
    <Field.Wrapper data-h2-margin-bottom="base(x1)">
      <Field.Fieldset id="systemMessages">
        <Field.Legend
          required={false}
          data-h2-visually-hidden="base(invisible)"
        >
          {legend}
        </Field.Legend>
        <div
          data-h2-display="base(grid)"
          data-h2-grid-template-columns="base(4fr 1fr)"
          data-h2-align-items="base(center)"
        >
          <div>
            <p
              data-h2-font-weight="base(bold)"
              data-h2-padding-bottom="base(x.5)"
            >
              {legend}
            </p>
            <p data-h2-font-size="base(caption)">{subtitle}</p>
          </div>
          <div
            data-h2-display="base(flex)"
            data-h2-justify-content="base(space-between)"
          >
            {options.map(({ value, label, disabled }) => {
              const checkboxId = `${id}-${value}`;
              return (
                <Checkbox
                  key={checkboxId}
                  id={checkboxId}
                  name={name}
                  label={label}
                  disabled={disabled}
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
  ignoredEmailNotifications: NotificationFamily[];
  ignoredInAppNotifications: NotificationFamily[];
}

const UpdateIgnoredNotifications_Mutation = graphql(/* GraphQL */ `
  mutation updateIgnoredNotifications(
    $ignoredEmailNotifications: [NotificationFamily]
    $ignoredInAppNotifications: [NotificationFamily]
  ) {
    updateIgnoredNotifications(
      ignoredEmailNotifications: $ignoredEmailNotifications
      ignoredInAppNotifications: $ignoredInAppNotifications
    ) {
      id
      ignoredEmailNotifications
      ignoredInAppNotifications
    }
  }
`);

const NotificationSettings = ({
  ignoredEmailNotifications,
  ignoredInAppNotifications,
}: NotificationSettingsProps) => {
  const intl = useIntl();
  const [, executeMutation] = useMutation(UpdateIgnoredNotifications_Mutation);

  const methods = useForm<FormValues>({
    defaultValues: dataValuesToFormValues({
      ignoredEmailNotifications,
      ignoredInAppNotifications,
    }),
  });

  const notificationOptions = (id: string): CheckboxOption[] => [
    {
      value: "email",
      label: (
        <span data-h2-visually-hidden="base(invisible)">
          {intl.formatMessage(commonMessages.email)}
        </span>
      ),
      disabled: id === "systemMessages",
    },
    {
      value: "inApp",
      label: (
        <span data-h2-visually-hidden="base(invisible)">
          {intl.formatMessage(commonMessages.inApp)}
        </span>
      ),
      disabled: id === "systemMessages",
    },
  ];

  const { handleSubmit } = methods;

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: could not update applicant settings",
        id: "J1YiBm",
        description:
          "Message displayed when an error occurs while updating applicant settings.",
      }),
    );
  };

  const handleFormSubmit: SubmitHandler<FormValues> = async (
    values: FormValues,
  ) => {
    const data = formValuesToData(values);
    await executeMutation(data)
      .then((result) => {
        if (result.data?.updateIgnoredNotifications) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Updated applicant settings",
              id: "zV8YQ1",
              description:
                "Message displayed when applicant updated their settings.",
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
        defaultMessage: "System Messages",
        id: "KzpzIE",
        description: "Title for system messages checklist",
      }),
      subtitle: intl.formatMessage({
        defaultMessage:
          "These notifications are required and include email verification and other important communications.",
        id: "blvpQr",
        description: "Subtitle for system messages checklist",
      }),
      options: notificationOptions("systemMessages"),
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
      options: notificationOptions("applicationUpdates"),
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
      options: notificationOptions("jobAlerts"),
    },
  ];

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Card title="" color="white">
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
            data-h2-padding-bottom="base(x1)"
          >
            <div
              data-h2-display="base(flex)"
              data-h2-gap="base(x2.5)"
              data-h2-align-self="base(flex-end)"
            >
              <p>{intl.formatMessage(commonMessages.email)}</p>
              <p>{intl.formatMessage(commonMessages.inApp)}</p>
            </div>
            {formFields.map((props) => (
              <NotificationChecklist key={props.id} {...props} />
            ))}
          </div>
          <div data-h2-align-self="base(flex-start)">
            <Submit text={intl.formatMessage(formMessages.saveChanges)} />
          </div>
        </Card>
      </form>
    </FormProvider>
  );
};

export default NotificationSettings;
