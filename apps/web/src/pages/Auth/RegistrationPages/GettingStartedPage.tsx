import { useEffect, useRef, useState } from "react";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { defineMessage, useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";
import FlagIcon from "@heroicons/react/24/outline/FlagIcon";
import { FormProvider, SubmitErrorHandler, useForm } from "react-hook-form";

import { Button, Heading, Pending, Well } from "@gc-digital-talent/ui";
import {
  Checkbox,
  ErrorSummary,
  Input,
  RadioGroup,
  Submit,
  flattenErrors,
  localizedEnumToOptions,
} from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";
import { errorMessages, commonMessages } from "@gc-digital-talent/i18n";
import { emptyToNull } from "@gc-digital-talent/helpers";
import {
  graphql,
  FragmentType,
  getFragment,
  Language,
  UpdateUserAsUserInput,
  NotificationFamily,
} from "@gc-digital-talent/graphql";
import {
  getFromSessionStorage,
  removeFromSessionStorage,
  setInSessionStorage,
} from "@gc-digital-talent/storage";

import Hero from "~/components/Hero/Hero";
import SEO from "~/components/SEO/SEO";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";

import messages from "./utils/messages";

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

export interface GettingStartedFormProps {
  cacheKey: string;
  query?: FragmentType<typeof GettingStarted_QueryFragment>;
  handleCreateAccount: (
    data: UpdateUserAsUserInput,
    emailConsent?: boolean,
    skipVerification?: boolean,
  ) => Promise<void>;
}

export const GettingStartedForm = ({
  cacheKey,
  query,
  handleCreateAccount,
}: GettingStartedFormProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const result = getFragment(GettingStarted_QueryFragment, query);
  const [showErrorSummary, setShowErrorSummary] = useState<boolean>(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const methods = useForm<FormValues>({
    defaultValues: getFromSessionStorage(cacheKey, {}),
  });
  const { watch, register, setValue, handleSubmit } = methods;
  const skipVerificationProps = register("skipVerification");
  watch((data) => setInSessionStorage(cacheKey, data));

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
    email: intl.formatMessage(commonMessages.email),
    preferredLang: intl.formatMessage({
      defaultMessage: "Preferred contact language?",
      id: "WmfarL",
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

  const onSubmit = (values: FormValues) => {
    removeFromSessionStorage(cacheKey);
    setShowErrorSummary(false);
    handleCreateAccount(
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

  const handleInvalidSubmit: SubmitErrorHandler<FormValues> = (errors) => {
    const flatErrors = flattenErrors(errors);
    setShowErrorSummary(flatErrors.length > 0);

    errorSummaryRef.current?.focus();
  };

  useEffect(() => {
    errorSummaryRef.current?.focus();
  }, [showErrorSummary]);

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
        simpleCrumbs
      >
        <section data-h2-padding="base(0, 0, x3, 0)">
          <div
            data-h2-background-color="base(foreground)"
            data-h2-radius="base(rounded)"
            data-h2-padding="base(x1) p-tablet(x2)"
            data-h2-shadow="base(large)"
          >
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit, handleInvalidSubmit)}>
                <ErrorSummary
                  ref={errorSummaryRef}
                  labels={labels}
                  show={showErrorSummary}
                />
                <Heading
                  level="h2"
                  size="h3"
                  Icon={FlagIcon}
                  color="primary"
                  data-h2-font-weight="base(400)"
                  data-h2-margin="base(0, 0, x1, 0)"
                >
                  {intl.formatMessage(specificTitle)}
                </Heading>
                <p data-h2-padding="base(0, 0, x1, 0)">
                  {intl.formatMessage({
                    defaultMessage:
                      "Before we take you to your profile, we need to collect some required information to complete your account set up.",
                    id: "x6saT3",
                    description:
                      "Message after main heading in create account page.",
                  })}
                </p>
                <div>
                  <div
                    data-h2-display="base(flex)"
                    data-h2-margin="base(0, 0, x1, 0)"
                  >
                    <div
                      style={{ flex: 1 }}
                      data-h2-padding="base(0, x1, 0, 0)"
                    >
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        label={labels.firstName}
                        rules={{
                          required: intl.formatMessage(errorMessages.required),
                        }}
                      />
                    </div>
                    <div
                      style={{ flex: 1 }}
                      data-h2-padding="base(0, 0, 0, x1)"
                    >
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
                  </div>
                  <div data-h2-margin="base(0, 0, x1, 0)">
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
                  <div data-h2-margin="base(0, 0, x0.25, 0)">
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
                  <div data-h2-margin="base(0, 0, x1, 0)">
                    <Well>
                      <p>
                        {intl.formatMessage({
                          defaultMessage:
                            "This email will be used for communication and notifications. In the next step, we’ll ask you to verify this email using a code we’ll send to your inbox.",
                          id: "5UgmHm",
                          description:
                            "Message on getting started page about the contact email address - part 1.",
                        })}
                      </p>
                      <p>
                        {intl.formatMessage({
                          defaultMessage:
                            "If you are a <strong>Government of Canada employee</strong>, you can choose to use your work email, however we recommend a personal email to facilitate your privacy and continued access should you leave the public service.",
                          id: "ErosNs",
                          description:
                            "Message on getting started page about the contact email address - part 2.",
                        })}
                      </p>
                    </Well>
                  </div>
                  <div data-h2-margin="base(0, 0, x0.25, 0)">
                    <Checkbox
                      id="emailConsent"
                      name="emailConsent"
                      boundingBox
                      boundingBoxLabel={labels.emailConsent}
                      label={intl.formatMessage({
                        defaultMessage:
                          '"I agree to receive email notifications from GC Digital Talent."',
                        id: "ydjlRN",
                        description:
                          "Text for the option consent to email notifications.",
                      })}
                    />
                  </div>
                  <div data-h2-margin="base(0, 0, x1, 0)">
                    <Well>
                      {intl.formatMessage({
                        defaultMessage:
                          "You can control which types of notifications you receive at a more granular level in your account settings.",
                        id: "MzmK82",
                        description:
                          "Message on getting started page about email notification consent.",
                      })}
                    </Well>
                  </div>
                  <div
                    data-h2-display="base(flex)"
                    data-h2-gap="base(x.25, x.5)"
                    data-h2-flex-wrap="base(wrap)"
                    data-h2-flex-direction="base(column) l-tablet(row)"
                    data-h2-align-items="base(flex-start) l-tablet(center)"
                  >
                    <Submit
                      mode="solid"
                      color="secondary"
                      onClick={() => setValue("skipVerification", false)}
                      {...skipVerificationProps}
                      text={intl.formatMessage({
                        defaultMessage: "Verify your contact email",
                        id: "0k3vfO",
                        description:
                          "Button label for submit and verify email button on getting started form.",
                      })}
                    />
                    <Button
                      mode="inline"
                      color="secondary"
                      {...skipVerificationProps}
                      onClick={() => {
                        setValue("skipVerification", true);
                        handleSubmit(onSubmit);
                      }}
                    >
                      {intl.formatMessage({
                        defaultMessage: "Save and skip verification",
                        id: "NpznI5",
                        description:
                          "Button label for submit and skip email verification button on getting started form.",
                      })}
                    </Button>
                  </div>
                </div>
              </form>
            </FormProvider>
          </div>
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
  mutation UpdateEmailNotifications(
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
    }).then((generalResult) => {
      if (generalResult.data?.updateUserAsUser) {
        executeNotificationMutation({
          enabledEmailNotifications: notificationInput,
        }).then((notificationResult) => {
          if (notificationResult.data?.updateEnabledNotifications) {
            return generalResult.data?.updateUserAsUser;
          }
          return Promise.reject(notificationResult.error);
        });
      }
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

  // OK to navigate to next page once we have a user ID and an email
  const shouldNavigate = meId && email;
  useEffect(() => {
    if (shouldNavigate) {
      if (verifyEmail) {
        navigate({
          pathname: paths.emailVerification(),
          search: from
            ? createSearchParams({ from, emailAddress: email }).toString()
            : "",
        });
      } else {
        navigate({
          pathname: paths.employeeInformation(),
          search: from ? createSearchParams({ from }).toString() : "",
        });
      }
    }
  }, [navigate, shouldNavigate, from, email, verifyEmail, paths]);

  return (
    <Pending fetching={fetching || !authContext.isLoaded} error={error}>
      <GettingStartedForm
        cacheKey={`getting-started-${meId}`}
        query={data}
        handleCreateAccount={onSubmit}
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
