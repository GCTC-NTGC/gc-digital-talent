import { useEffect, useState } from "react";
import { createSearchParams, useNavigate, useSearchParams } from "react-router";
import { defineMessage, useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";
import FlagIcon from "@heroicons/react/24/outline/FlagIcon";
import { useFormContext } from "react-hook-form";

import {
  Button,
  Card,
  Heading,
  Pending,
  Separator,
  Well,
} from "@gc-digital-talent/ui";
import {
  BasicForm,
  FieldLabels,
  Input,
  RadioGroup,
  Submit,
  localizedEnumToOptions,
} from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";
import { errorMessages } from "@gc-digital-talent/i18n";
import { emptyToNull } from "@gc-digital-talent/helpers";
import {
  graphql,
  FragmentType,
  getFragment,
  Language,
  UpdateUserAsUserInput,
  NotificationFamily,
} from "@gc-digital-talent/graphql";
import { getFromSessionStorage } from "@gc-digital-talent/storage";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";

import messages from "../utils/messages";

const specificTitle = defineMessage({
  defaultMessage: "Getting started",
  id: "QXiUo/",
  description: "Main heading in getting started page.",
});

type FormValues = Pick<
  UpdateUserAsUserInput,
  "firstName" | "lastName" | "email" | "preferredLang"
> & {
  emailConsent?: boolean;
  skipVerification?: boolean;
};

export const GettingStarted_QueryFragment = graphql(/** GraphQL */ `
  fragment GettingStarted_QueryFragment on Query {
    languages: localizedEnumStrings(enumName: "Language") {
      value
      label {
        en
        fr
      }
    }
  }
`);

export interface GettingStartedFormFieldsProps {
  labels: FieldLabels;
  query?: FragmentType<typeof GettingStarted_QueryFragment>;
}

export const GettingStartedFormFields = ({
  labels,
  query,
}: GettingStartedFormFieldsProps) => {
  const intl = useIntl();
  const { setValue, register } = useFormContext();
  const skipVerificationProps = register("skipVerification");
  const result = getFragment(GettingStarted_QueryFragment, query);

  return (
    <>
      <div className="mb-6 grid gap-6 xs:grid-cols-2">
        <Input
          id="firstName"
          name="firstName"
          type="text"
          label={labels.firstName}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
        <Input
          id="lastName"
          name="lastName"
          type="text"
          label={labels.lastName}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
      </div>
      <div className="mb-6">
        <RadioGroup
          idPrefix="required-lang-preferences"
          legend={labels.preferredLang}
          id="preferredLang"
          name="preferredLang"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={localizedEnumToOptions(result?.languages, intl)}
          defaultSelected={Language.En}
        />
      </div>
      <div className="mb-6 flex flex-col gap-2 xs:flex-row">
        <div className="grow">
          <Input
            id="email"
            type="email"
            name="email"
            label={labels.email}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
        </div>
        <div className="w-full self-center xs:w-auto xs:self-end">
          <Submit
            className="block w-full"
            text={intl.formatMessage({
              defaultMessage: "Send verification email",
              id: "xKj/Lr",
              description: "Button to send verification code",
            })}
            submittedText={intl.formatMessage({
              defaultMessage: "Send verification email",
              id: "xKj/Lr",
              description: "Button to send verification code",
            })}
          />
        </div>
      </div>
      <div className="mb-6 flex flex-col gap-6">
        {true ? (
          <Input
            id="verificationCode"
            name="verificationCode"
            type="text"
            label={intl.formatMessage({
              defaultMessage: "Verification code",
              id: "T+ypau",
              description: "label for verification code input",
            })}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
        ) : null}
      </div>
      <div className="mb-6">
        <Well>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "By registering and providing your email address, you agree to receive email communication from GC Digital Talent and its partner functional communities in the Government of Canada. You can control which types of notifications you receive and how you receive them in your account settings page.",
              id: "sHEsjv",
              description:
                "Message on getting started page about the contact email address",
            })}
          </p>
        </Well>
      </div>
      <div className="-mx-6 sm:-mx-9">
        <Separator decorative orientation="horizontal" />
      </div>
      <div className="flex flex-col items-center gap-x-3 gap-y-1.5 sm:flex-row sm:justify-end">
        <div>
          <Button
            mode="solid"
            color="primary"
            onClick={() => setValue("skipVerification", false)}
            {...skipVerificationProps}
          >
            {intl.formatMessage({
              defaultMessage: "Save and continue",
              id: "MQB4IA",
              description:
                "Button text to save a form step and continue to the next one",
            })}
          </Button>
        </div>
      </div>
    </>
  );
};

export interface GettingStartedFormProps {
  cacheKey?: string;
  query?: FragmentType<typeof GettingStarted_QueryFragment>;
  handleSubmit: (
    data: UpdateUserAsUserInput,
    emailConsent?: boolean,
    skipVerification?: boolean,
  ) => Promise<void>;
}

export const GettingStartedForm = ({
  cacheKey,
  query,
  handleSubmit,
}: GettingStartedFormProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const labels = {
    firstName: intl.formatMessage({
      defaultMessage: "First name",
      id: "pJBmIm",
      description:
        "Label displayed for the first name field in getting started form.",
    }),
    lastName: intl.formatMessage({
      defaultMessage: "Last name",
      id: "ARdTh3",
      description:
        "Label displayed for the last name field in getting started form.",
    }),
    email: intl.formatMessage({
      defaultMessage: "Contact email",
      id: "etD6Xy",
      description: "Title for contact email input",
    }),
    preferredLang: intl.formatMessage({
      defaultMessage: "Preferred contact language",
      id: "AumMAr",
      description:
        "Legend text for required language preference in getting started form",
    }),
    emailConsent: intl.formatMessage({
      defaultMessage: "Email notification consent",
      id: "Ia+zNM",
      description:
        "Legend text for email notification consent checkbox in getting started form",
    }),
  };

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(messages.breadcrumb),
        url: paths.gettingStarted(),
      },
    ],
  });

  const onSubmit = async (values: FormValues) => {
    await handleSubmit(
      {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        preferredLang: values.preferredLang,
      },
      values.emailConsent,
      values.skipVerification,
    );
  };

  return (
    <>
      <SEO
        title={intl.formatMessage(specificTitle)}
        description={intl.formatMessage(messages.subtitle)}
      />
      <Hero
        title={intl.formatMessage(messages.title)}
        subtitle={intl.formatMessage(messages.subtitle)}
        crumbs={crumbs}
        overlap
      >
        <section className="mb-18">
          <Card space="lg">
            <BasicForm
              onSubmit={onSubmit}
              cacheKey={cacheKey}
              labels={labels}
              options={{
                defaultValues: cacheKey
                  ? getFromSessionStorage(cacheKey, {})
                  : {},
              }}
            >
              <Heading
                level="h2"
                size="h3"
                icon={FlagIcon}
                color="secondary"
                className="mt-0 mb-6 font-normal"
              >
                {intl.formatMessage(specificTitle)}
              </Heading>
              <p className="mb-6">
                {intl.formatMessage({
                  defaultMessage:
                    "Before we take you to your profile, we need to collect some required information to complete your account set up.",
                  id: "x6saT3",
                  description:
                    "Message after main heading in create account page.",
                })}
              </p>
              <GettingStartedFormFields labels={labels} query={query} />
            </BasicForm>
          </Card>
        </section>
      </Hero>
    </>
  );
};

const GettingStarted_Query = graphql(/** GraphQL */ `
  query GettingStarted_Query {
    ...GettingStarted_QueryFragment
    me {
      email
    }
  }
`);

const GettingStarted_Mutation = graphql(/** GraphQL */ `
  mutation GettingStarted_Mutation($id: ID!, $user: UpdateUserAsUserInput!) {
    updateUserAsUser(id: $id, user: $user) {
      id
    }
  }
`);

const UpdateEmailNotifications_Mutation = graphql(/* GraphQL */ `
  mutation UpdateEmailNotifications_Mutation(
    $enabledEmailNotifications: [NotificationFamily]
  ) {
    updateEnabledNotifications(
      enabledEmailNotifications: $enabledEmailNotifications
    ) {
      id
    }
  }
`);

const GettingStarted = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");
  const authContext = useAuthorization();
  const [{ data, fetching, error }] = useQuery({
    query: GettingStarted_Query,
  });

  const [verifyEmail, setVerifyEmail] = useState<boolean>(true);

  const email = data?.me?.email;
  const meId = authContext?.userAuthInfo?.id;

  const [, executeGeneralMutation] = useMutation(GettingStarted_Mutation);
  const [, executeNotificationMutation] = useMutation(
    UpdateEmailNotifications_Mutation,
  );
  const handleCreateAccount = (
    id: string,
    generalInput: UpdateUserAsUserInput,
    notificationInput: NotificationFamily[],
  ) =>
    executeGeneralMutation({
      id,
      user: {
        ...generalInput,
        id,
        email: emptyToNull(generalInput.email),
      },
    }).then(async (generalResult) => {
      if (generalResult.data?.updateUserAsUser) {
        await executeNotificationMutation({
          enabledEmailNotifications: notificationInput,
        }).then((notificationResult) => {
          if (notificationResult.data?.updateEnabledNotifications) {
            return generalResult.data?.updateUserAsUser;
          }
          return Promise.reject(
            new Error(notificationResult.error?.toString()),
          );
        });
      } else {
        return Promise.reject(new Error(generalResult.error?.toString()));
      }

      return null;
    });

  const onSubmit = async (
    input: UpdateUserAsUserInput,
    emailConsent = false,
    skipVerification = false,
  ) => {
    setVerifyEmail(!skipVerification);
    if (meId === undefined || meId === "") {
      toast.error(
        intl.formatMessage({
          defaultMessage: "Error: user not found",
          id: "4bjh8X",
          description: "Message displayed to user if user is not found",
        }),
      );
      return;
    }
    const notificationInput = emailConsent
      ? [NotificationFamily.ApplicationUpdate, NotificationFamily.JobAlert]
      : [];
    await handleCreateAccount(meId, input, notificationInput)
      .then(() => {
        toast.success(
          intl.formatMessage({
            defaultMessage: "Account successfully created.",
            id: "DK870a",
            description:
              "Message displayed to user if account is created successfully.",
          }),
        );
        // navigation will happen on useEffect after authorization context has updated
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: creating account failed.",
            id: "BruLeg",
            description:
              "Message displayed to user if account fails to get updated.",
          }),
        );
      });
  };

  return (
    <Pending fetching={fetching || !authContext.isLoaded} error={error}>
      <GettingStartedForm
        cacheKey={`getting-started-${meId}`}
        query={data}
        handleSubmit={onSubmit}
      />
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <GettingStarted />
  </RequireAuth>
);

export default GettingStarted;
