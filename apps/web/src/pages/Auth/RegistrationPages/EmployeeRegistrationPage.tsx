import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { defineMessage, useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";

import { Alert, Heading, Pending } from "@gc-digital-talent/ui";
import {
  BasicForm,
  Input,
  RadioGroup,
  Submit,
  localizedEnumToOptions,
} from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";
import { errorMessages, commonMessages } from "@gc-digital-talent/i18n";
import { emptyToNull, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  graphql,
  FragmentType,
  getFragment,
  Language,
  GovEmployeeType,
  UpdateUserAsUserInput,
} from "@gc-digital-talent/graphql";

import Hero from "~/components/Hero/Hero";
import SEO from "~/components/SEO/SEO";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useRoutes from "~/hooks/useRoutes";

import {
  formValuesToSubmitData,
  getGovernmentInfoLabels,
  GovernmentInfoFormFields,
} from "./components/GovernmentInfoForm";

const subTitle = defineMessage({
  defaultMessage: "Let's begin with some basic account information.",
  id: "f9UKuz",
  description: "Subtitle for the create account page for applicant profiles.",
});

type FormValues = Pick<
  UpdateUserAsUserInput,
  "firstName" | "lastName" | "email" | "preferredLang"
> & {
  govEmployeeYesNo: "yes" | "no";
  govEmployeeType: GovEmployeeType | null;
  lateralDeployBool: boolean;
  department: string;
  currentClassificationGroup: string;
  currentClassificationLevel: string;
  priorityEntitlementYesNo?: "yes" | "no";
  priorityEntitlementNumber?: string;
};

export const CreateAccount_QueryFragment = graphql(/** GraphQL */ `
  fragment CreateAccount_QueryFragment on Query {
    departments {
      id
      name {
        en
        fr
      }
    }
    classifications {
      id
      name {
        en
        fr
      }
      group
      level
    }
    languages: localizedEnumStrings(enumName: "Language") {
      value
      label {
        en
        fr
      }
    }
  }
`);

export interface CreateAccountFormProps {
  cacheKey?: string;
  query?: FragmentType<typeof CreateAccount_QueryFragment>;
  handleCreateAccount: (data: UpdateUserAsUserInput) => Promise<void>;
}

export const CreateAccountForm = ({
  cacheKey,
  query,
  handleCreateAccount,
}: CreateAccountFormProps) => {
  const intl = useIntl();
  const govInfoLabels = getGovernmentInfoLabels(intl);
  const result = getFragment(CreateAccount_QueryFragment, query);
  const classifications = unpackMaybes(result?.classifications);

  const labels = {
    ...govInfoLabels,
    firstName: intl.formatMessage({
      defaultMessage: "First Name",
      id: "IEkhMc",
      description:
        "Label displayed for the first name field in create account form.",
    }),
    lastName: intl.formatMessage({
      defaultMessage: "Last Name",
      id: "UxF291",
      description:
        "Label displayed for the last name field in create account form.",
    }),
    email: intl.formatMessage(commonMessages.email),
    preferredLang: intl.formatMessage({
      defaultMessage: "What is your preferred contact language?",
      id: "0ScnOT",
      description:
        "Legend text for required language preference in create account form",
    }),
  };

  const handleSubmit = (values: FormValues) =>
    handleCreateAccount({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      preferredLang: values.preferredLang,
      ...formValuesToSubmitData(values, classifications),
    });

  return (
    <>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Create account",
          id: "lPWUoO",
          description: "Page title for the account creation page",
        })}
        description={intl.formatMessage(subTitle)}
      />
      <Hero
        centered
        title={intl.formatMessage({
          defaultMessage: "Welcome to GC Digital Talent",
          id: "WVTDgX",
          description:
            "Title for the create account page for applicant profiles.",
        })}
        subtitle={intl.formatMessage(subTitle)}
      >
        <section data-h2-padding="base(0, 0, x3, 0)">
          <Alert.Root type="success" live={false}>
            <Alert.Title>
              {intl.formatMessage({
                defaultMessage: "You've successfully signed in",
                id: "DeGAS5",
                description:
                  "Title for successful sign in alert in create account page.",
              })}
            </Alert.Title>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Welcome to the GC Digital Talent platform. Moving forward, you can sign in to your profile using the same GCKey username and password.",
                id: "OBRGkE",
                description:
                  "Message for successful sign in alert in create account page",
              })}
            </p>
          </Alert.Root>
          <div
            data-h2-background-color="base(foreground)"
            data-h2-radius="base(rounded)"
            data-h2-padding="base(x1) p-tablet(x2)"
            data-h2-shadow="base(large)"
          >
            <BasicForm
              onSubmit={handleSubmit}
              cacheKey={cacheKey}
              labels={labels}
            >
              <Heading
                level="h2"
                size="h3"
                data-h2-font-weight="base(400)"
                data-h2-margin="base(0, 0, x1, 0)"
              >
                {intl.formatMessage({
                  defaultMessage: "Employee Registration",
                  id: "TG52RM",
                  description: "Main heading in create account page.",
                })}
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
                  <div style={{ flex: 1 }} data-h2-padding="base(0, x1, 0, 0)">
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
                  <div style={{ flex: 1 }} data-h2-padding="base(0, 0, 0, x1)">
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
                <p data-h2-margin="base(x1, 0, x.5, 0)">
                  {intl.formatMessage({
                    defaultMessage:
                      "Below we’d like to know if you’re already an employee with the Government of Canada. We collect this information because it helps us understand, at an aggregate level, how digital skills are distributed amongst departments.",
                    id: "XijxiY",
                    description:
                      "First message before is a government of canada radio group in create account form.",
                  })}
                </p>
                <p data-h2-margin="base(0, 0, x1, 0)">
                  {intl.formatMessage({
                    defaultMessage:
                      "We also use this information to provide you with more contextualized opportunities and suggestions based on your employment status.",
                    id: "5U4C61",
                    description:
                      "Second message before is a government of canada radio group in create account form.",
                  })}
                </p>
                <GovernmentInfoFormFields
                  labels={labels}
                  departmentsQuery={result?.departments}
                  classificationsQuery={result?.classifications}
                />
                <div
                  data-h2-margin="base(x2, 0, 0, 0)"
                  data-h2-padding="base(x2, 0, 0, 0)"
                  data-h2-border-top="base(1px solid gray)"
                  data-h2-display="base(flex)"
                  data-h2-justify-content="base(flex-start)"
                >
                  <Submit
                    mode="solid"
                    color="secondary"
                    text={intl.formatMessage({
                      defaultMessage: "Save and go to my profile",
                      id: "H3Za3e",
                      description:
                        "Button label for submit button on create account form.",
                    })}
                  />
                </div>
              </div>
            </BasicForm>
          </div>
        </section>
      </Hero>
    </>
  );
};

const CreateAccount_Query = graphql(/** GraphQL */ `
  query CreateAccount_Query {
    ...CreateAccount_QueryFragment
    me {
      email
    }
  }
`);

const CreateAccount_Mutation = graphql(/** GraphQL */ `
  mutation CreateAccount_Mutation($id: ID!, $user: UpdateUserAsUserInput!) {
    updateUserAsUser(id: $id, user: $user) {
      id
    }
  }
`);

const CreateAccount = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");
  const authContext = useAuthorization();
  const [{ data, fetching, error }] = useQuery({
    query: CreateAccount_Query,
  });

  const email = data?.me?.email;
  const meId = authContext?.userAuthInfo?.id;

  const [, executeMutation] = useMutation(CreateAccount_Mutation);
  const handleCreateAccount = (id: string, input: UpdateUserAsUserInput) =>
    executeMutation({
      id,
      user: {
        ...input,
        id,
        email: emptyToNull(input.email),
      },
    }).then((result) => {
      if (result.data?.updateUserAsUser) {
        return result.data.updateUserAsUser;
      }
      return Promise.reject(result.error);
    });

  const onSubmit = async (input: UpdateUserAsUserInput) => {
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
    await handleCreateAccount(meId, input)
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

  // OK to navigate to profile once we have a user ID and an email
  // const shouldNavigate = meId && email;
  // const fallbackTarget = paths.profileAndApplications();
  // const navigationTarget = from || fallbackTarget;
  // useEffect(() => {
  //   if (shouldNavigate) {
  //     navigate(navigationTarget);
  //   }
  // }, [navigate, navigationTarget, shouldNavigate]);

  return (
    <Pending fetching={fetching || !authContext.isLoaded} error={error}>
      <CreateAccountForm
        cacheKey={`create-account-${meId}`}
        query={data}
        handleCreateAccount={onSubmit}
      />
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <CreateAccount />
  </RequireAuth>
);

export default CreateAccount;
