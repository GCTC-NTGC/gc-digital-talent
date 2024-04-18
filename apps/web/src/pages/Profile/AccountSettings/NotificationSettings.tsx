import * as React from "react";
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
import { CardBasic } from "@gc-digital-talent/ui";
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
        <span data-h2-visually-hidden="base(invisible)">
          {intl.formatMessage(commonMessages.email)}
        </span>
      ),
    },
    {
      value: "inApp",
      label: (
        <span data-h2-visually-hidden="base(invisible)">
          {intl.formatMessage(commonMessages.inApp)}
        </span>
      ),
    },
  ];

  if (disabled) {
    return (
      <div
        data-h2-display="base(grid)"
        data-h2-grid-template-columns="base(4fr 1fr)"
        data-h2-align-items="base(center)"
        data-h2-margin-bottom="base(x1)"
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
          {notificationOptions.map(({ value }) => {
            const key = `${id}-${value}`;
            return (
              <span
                key={key}
                data-h2-padding="base(x.25 x.75 x.25 x.5)"
                data-h2-color="base(gray)"
              >
                <CheckIcon
                  aria-label={
                    value === "email"
                      ? intl.formatMessage(commonMessages.email)
                      : intl.formatMessage(commonMessages.inApp)
                  }
                  aria-hidden="false"
                  data-h2-height="base(x1)"
                  data-h2-width="base(x1)"
                  data-h2-border="base(thin solid black.light)"
                  data-h2-radius="base(input)"
                  data-h2-vertical-align="base(middle)"
                />
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <Field.Wrapper data-h2-margin-bottom="base(x1)">
      <Field.Fieldset id={id}>
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
        if (result.data?.updateIgnoredNotifications) {
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
        <CardBasic color="white">
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
            data-h2-padding-bottom="base(x1)"
          >
            <div
              data-h2-display="base(flex)"
              data-h2-gap="base(x1) p-tablet(x2) laptop(x2.5)"
              data-h2-align-self="base(flex-end)"
            >
              <p aria-hidden>{intl.formatMessage(commonMessages.email)}</p>
              <p aria-hidden>{intl.formatMessage(commonMessages.inApp)}</p>
            </div>
            {formFields.map((props) => (
              <NotificationChecklist key={props.id} {...props} />
            ))}
          </div>
          <div data-h2-align-self="base(flex-start)">
            <Submit text={intl.formatMessage(formMessages.saveChanges)} />
          </div>
        </CardBasic>
      </form>
    </FormProvider>
  );
};

export default NotificationSettings;
