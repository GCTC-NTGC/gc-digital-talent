/* eslint-disable camelcase */
// Note: Disable camelcase since variables are being used by API
import * as React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { defineMessage, useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import { useQuery } from "urql";

import { toast } from "@gc-digital-talent/toast";
import { Input, Submit, TextArea, Select } from "@gc-digital-talent/forms";
import { errorMessages, uiMessages } from "@gc-digital-talent/i18n";
import { Heading, Pending, Button } from "@gc-digital-talent/ui";
import { useLogger } from "@gc-digital-talent/logger";
import { User, graphql } from "@gc-digital-talent/graphql";

import { getFullNameLabel } from "~/utils/nameUtils";
import {
  API_SUPPORT_ENDPOINT,
  TALENTSEARCH_SUPPORT_EMAIL,
} from "~/constants/talentSearchConstants";

export type FormValues = {
  user_id: string;
  name: string;
  email: string;
  description: string;
  subject: string;
  previous_url: string;
};

interface SupportFormProps {
  showSupportForm: boolean;
  onFormToggle: (show: boolean) => void;
  handleCreateTicket: (data: FormValues) => Promise<number | null | void>;
  currentUser?: Pick<User, "id" | "firstName" | "lastName" | "email"> | null;
}

interface SupportFormSuccessProps {
  onFormToggle: (show: boolean) => void;
}

const anchorTag = (chunks: React.ReactNode) => (
  // Toast is not within the IntlProvider, can't use Link component.
  // eslint-disable-next-line react/forbid-elements
  <a href={`mailto:${TALENTSEARCH_SUPPORT_EMAIL}`}>{chunks}</a>
);

const SupportFormSuccess = ({ onFormToggle }: SupportFormSuccessProps) => {
  const intl = useIntl();
  return (
    <section>
      <Heading
        level="h2"
        size="h3"
        data-h2-font-weight="base(400)"
        data-h2-margin="base(0, 0, x1, 0)"
      >
        {intl.formatMessage({
          defaultMessage: "We've received your message.",
          id: "iiEGjW",
          description: "Support form success title",
        })}
      </Heading>
      <p data-h2-margin="base(x1, 0, x.5, 0)">
        {intl.formatMessage({
          defaultMessage:
            "We'll do our best to get back to you with a response within the next two business days.",
          id: "OdjW9z",
          description: "Support form success paragraph one",
        })}
      </p>
      <p data-h2-margin="base(x.5, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            "Please check your email for a summary of your submission.",
          id: "5r5XSh",
          description: "Support form success paragraph two",
        })}
      </p>
      {/* <p data-h2-margin="base(x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            "In the meantime, feel free to check out our FAQs for further information.",
          id: "QX1l/C",
          description: "Support form success paragraph three",
        })}
      </p> */}
      <Button
        color="secondary"
        mode="solid"
        onClick={() => {
          onFormToggle(true);
        }}
      >
        {intl.formatMessage({
          defaultMessage: "Submit a new message",
          id: "CZ3wxJ",
          description: "Support form success action",
        })}
      </Button>
    </section>
  );
};

const SupportForm = ({
  showSupportForm,
  onFormToggle,
  handleCreateTicket,
  currentUser,
}: SupportFormProps) => {
  const intl = useIntl();
  const location = useLocation();
  const previousUrl = location?.state?.referrer ?? document?.referrer ?? "";
  const methods = useForm<FormValues>({
    defaultValues: {
      user_id: currentUser?.id || "",
      name: currentUser
        ? getFullNameLabel(currentUser.firstName, currentUser.lastName, intl)
        : "",
      email: currentUser?.email || "",
      previous_url: previousUrl || "",
    },
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    await handleCreateTicket(data);
    onFormToggle(false);
  };
  return showSupportForm ? (
    <section>
      <Heading
        level="h2"
        size="h3"
        data-h2-font-weight="base(400)"
        data-h2-margin="base(0, 0, x1, 0)"
      >
        {intl.formatMessage({
          defaultMessage: "Reach out to us",
          id: "oXYnZN",
          description: "Support form title",
        })}
      </Heading>
      <p data-h2-margin="base(x1 0)">
        {intl.formatMessage({
          defaultMessage:
            "Have a specific question? Want to provide feedback or report a bug? Send us a message using this form.",
          id: "AwIGg0",
          description: "Support form paragraph one",
        })}
      </p>
      <div>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex"
            data-h2-flex-direction="base(column)"
            data-h2-gap="base(x.5 0)"
          >
            <Input
              id="name"
              name="name"
              type="text"
              label={intl.formatMessage({
                defaultMessage: "Your name",
                id: "86Y8lx",
                description: "Support form name field label",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              trackUnsaved={false}
            />
            <Input
              id="email"
              name="email"
              type="email"
              label={intl.formatMessage({
                defaultMessage: "Your email",
                id: "szLvj0",
                description: "Support form email field label",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              trackUnsaved={false}
            />
            <Select
              id="subject"
              name="subject"
              nullSelection={intl.formatMessage(uiMessages.nullSelectionOption)}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              label={intl.formatMessage({
                defaultMessage: "I'm looking to...",
                id: "094835",
                description: "Support form subject field label",
              })}
              options={[
                {
                  value: "bug",
                  label: intl.formatMessage({
                    defaultMessage: "Submit a bug",
                    id: "wIccbA",
                    description: "Support form subject field bug option label",
                  }),
                },
                {
                  value: "feedback",
                  label: intl.formatMessage({
                    defaultMessage: "Submit feedback",
                    id: "fVAMSw",
                    description:
                      "Support form subject field feedback option label",
                  }),
                },
                {
                  value: "question",
                  label: intl.formatMessage({
                    defaultMessage: "Ask a question",
                    id: "msn4mz",
                    description:
                      "Support form subject field question option label",
                  }),
                },
              ]}
              trackUnsaved={false}
            />
            <TextArea
              id="description"
              name="description"
              label={intl.formatMessage({
                defaultMessage: "Details",
                id: "ywkgJx",
                description: "Support form details field label",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              trackUnsaved={false}
            />
            <div data-h2-align-self="base(flex-start)">
              <Submit color="secondary" />
            </div>
          </form>
        </FormProvider>
      </div>
    </section>
  ) : (
    <SupportFormSuccess onFormToggle={onFormToggle} />
  );
};

const SupportFormUser_Query = graphql(/* GraphQL */ `
  query SupportFormUser {
    me {
      id
      email
      firstName
      lastName
    }
  }
`);

const defaultErrorMessage = defineMessage({
  defaultMessage:
    "Sorry, something went wrong. Please email <anchorTag>{emailAddress}</anchorTag> and mention this error code: {errorCode}.",
  id: "rNVDaA",
  description: "Support form toast message error",
});
const emailErrorMessage = defineMessage({
  defaultMessage:
    "Invalid email address. Try again or send an email to <anchorTag>{emailAddress}</anchorTag>.",
  id: "DOn3Hm",
  description: "Support form toast message error",
});

const SupportFormApi = () => {
  const intl = useIntl();
  const logger = useLogger();
  const handleCreateTicket = async (data: FormValues) => {
    const response = await fetch(API_SUPPORT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      logger.info("Ticket successfully submitted");
      toast.success(
        intl.formatMessage({
          defaultMessage: "Ticket created successfully!",
          id: "jHuiRm",
          description: "Support form toast message success",
        }),
      );
      return;
    }

    // we didn't get an OK so let's take a closer look at the response
    const responseBody = await response.json();
    const errorCode = `${response.status} - ${response.statusText}`;
    logger.error(`Failed to submit ticket: ${JSON.stringify(responseBody)}`);

    // default error message if we don't recognize the error
    let errorMessage = defaultErrorMessage;

    if (
      responseBody?.serviceResponse === "error" &&
      responseBody?.errorDetail === "invalid_email"
    ) {
      errorMessage = emailErrorMessage;
    }

    toast.error(
      <>
        {intl.formatMessage(errorMessage, {
          anchorTag,
          emailAddress: TALENTSEARCH_SUPPORT_EMAIL,
          errorCode,
        })}
      </>,
      { autoClose: 20000 },
    );
    throw new Error(errorCode);
  };

  const [{ data, fetching, error }] = useQuery({
    query: SupportFormUser_Query,
  });
  const [showSupportForm, setShowSupportForm] = React.useState(true);

  return (
    <Pending fetching={fetching} error={error}>
      <SupportForm
        showSupportForm={showSupportForm}
        onFormToggle={setShowSupportForm}
        currentUser={data?.me ?? null}
        handleCreateTicket={handleCreateTicket}
      />
    </Pending>
  );
};

export const SupportFormComponent = SupportForm;
export default SupportFormApi;
