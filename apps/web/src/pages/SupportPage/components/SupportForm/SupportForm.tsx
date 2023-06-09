import * as React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { toast } from "@gc-digital-talent/toast";
import {
  Input,
  Submit,
  TextArea,
  SelectFieldV2,
} from "@gc-digital-talent/forms";
import { errorMessages, apiMessages } from "@gc-digital-talent/i18n";
import { Pending, Button, Link } from "@gc-digital-talent/ui";

import { getFullNameLabel } from "~/utils/nameUtils";
import { useGetMeQuery, User } from "~/api/generated";
import {
  API_SUPPORT_ENDPOINT,
  TALENTSEARCH_SUPPORT_EMAIL,
} from "~/constants/talentSearchConstants";

export type FormValues = {
  name: string;
  email: string;
  description: string;
  subject: string;
};

interface SupportFormProps {
  showSupportForm: boolean;
  onFormToggle: (show: boolean) => void;
  handleCreateTicket: (data: FormValues) => Promise<number | null | void>;
  currentUser?: Pick<User, "firstName" | "lastName" | "email"> | null;
}

interface SupportFormSuccessProps {
  onFormToggle: (show: boolean) => void;
}

const anchorTag = (chunks: React.ReactNode) => (
  <Link external href={`mailto:${TALENTSEARCH_SUPPORT_EMAIL}`}>
    {chunks}
  </Link>
);

const SupportFormSuccess = ({ onFormToggle }: SupportFormSuccessProps) => {
  const intl = useIntl();
  return (
    <section>
      <h2 data-h2-font-weight="base(700)" data-h2-text-align="base(center)">
        {intl.formatMessage({
          defaultMessage: "We've received your message.",
          id: "iiEGjW",
          description: "Support form success title",
        })}
      </h2>
      <p data-h2-margin="base(x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            "We'll do our best to get back to you with a response within the next two business days.",
          id: "OdjW9z",
          description: "Support form success paragraph one",
        })}
      </p>
      <p data-h2-margin="base(x1, 0)">
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
      <div data-h2-text-align="base(center)">
        <Button
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
      </div>
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
  const methods = useForm<FormValues>({
    defaultValues: {
      name: currentUser
        ? getFullNameLabel(currentUser.firstName, currentUser.lastName, intl)
        : "",
      email: currentUser?.email || "",
    },
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    return handleCreateTicket(data).then(() => {
      onFormToggle(false);
    });
  };
  return showSupportForm ? (
    <section>
      <h2 data-h2-font-weight="base(700)">
        {intl.formatMessage({
          defaultMessage: "Reach out to us",
          id: "oXYnZN",
          description: "Support form title",
        })}
      </h2>
      <p data-h2-margin="base(x1, 0, 0, 0)">
        {intl.formatMessage({
          defaultMessage:
            "Have a specific question? Want to provide feedback or report a bug? Send us a message using this form.",
          id: "AwIGg0",
          description: "Support form paragraph one",
        })}
      </p>
      <div>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
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
            <SelectFieldV2
              id="subject"
              name="subject"
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
            <Submit color="primary" />
          </form>
        </FormProvider>
      </div>
    </section>
  ) : (
    <SupportFormSuccess onFormToggle={onFormToggle} />
  );
};

const SupportFormApi = () => {
  const intl = useIntl();
  const handleCreateTicket = (data: FormValues) =>
    fetch(API_SUPPORT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.status === 200) {
        // status code 201 = created.
        toast.success(
          intl.formatMessage({
            defaultMessage: "Ticket created successfully!",
            id: "jHuiRm",
            description: "Support form toast message success",
          }),
        );
        return Promise.resolve(response.status);
      }
      if (response.status === 429) {
        toast.error(<>{intl.formatMessage(apiMessages.RATE_LIMIT)}</>, {
          autoClose: 20000,
        });
        return Promise.reject(response.status);
      }
      toast.error(
        <>
          {intl.formatMessage(
            {
              defaultMessage:
                "Sorry, something went wrong. Please email <anchorTag>{emailAddress}</anchorTag> and mention this error code: {errorCode}.",
              id: "rNVDaA",
              description: "Support form toast message error",
            },
            {
              anchorTag,
              emailAddress: TALENTSEARCH_SUPPORT_EMAIL,
              errorCode: response.status,
            },
          )}
        </>,
        { autoClose: 20000 },
      );
      return Promise.reject(response.status);
    });

  const [{ data, fetching, error }] = useGetMeQuery();
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
