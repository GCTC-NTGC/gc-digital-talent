import { useState } from "react";
import { defineMessage, useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";
import FlagIcon from "@heroicons/react/24/outline/FlagIcon";
import { SubmitHandler } from "react-hook-form";

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
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";
import { errorMessages } from "@gc-digital-talent/i18n";
import {
  graphql,
  FragmentType,
  getFragment,
  Language,
} from "@gc-digital-talent/graphql";
import { getFromSessionStorage } from "@gc-digital-talent/storage";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";

import labels from "./labels";
import messages from "../utils/messages";

const specificTitle = defineMessage({
  defaultMessage: "Getting started",
  id: "QXiUo/",
  description: "Main heading in getting started page.",
});

interface FormValues {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  preferredLang: string | null;
  verificationCode: string | null;
}

export const GettingStartedOptions_QueryFragment = graphql(/** GraphQL */ `
  fragment GettingStartedOptions_QueryFragment on Query {
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
  cacheKey?: string;
  optionsQuery?: FragmentType<typeof GettingStartedOptions_QueryFragment>;
  onSubmit: SubmitHandler<FormValues>;
}

export const GettingStartedForm = ({
  cacheKey,
  optionsQuery,
  onSubmit,
}: GettingStartedFormProps) => {
  const intl = useIntl();

  const options = getFragment(
    GettingStartedOptions_QueryFragment,
    optionsQuery,
  );
  const [emailAddressContacted, setEmailAddressContacted] = useState<
    string | null
  >("dummy@eample.org"); // what address was an email sent to

  const formattedLabels = Object.entries(labels)
    .map(([key, value]) => [key, intl.formatMessage(value)])
    .reduce<FieldLabels>(
      (acc, value) => ({ ...acc, [value[0]]: value[1] }),
      {},
    );

  return (
    <BasicForm
      onSubmit={onSubmit}
      cacheKey={cacheKey}
      labels={formattedLabels}
      options={{
        defaultValues: cacheKey ? getFromSessionStorage(cacheKey, {}) : {},
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
          description: "Message after main heading in create account page.",
        })}
      </p>
      <>
        <div className="mb-6 grid gap-6 xs:grid-cols-2">
          <Input
            id="firstName"
            name="firstName"
            type="text"
            label={formattedLabels.firstName}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
          <Input
            id="lastName"
            name="lastName"
            type="text"
            label={formattedLabels.lastName}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
        </div>
        <div className="mb-6">
          <RadioGroup
            idPrefix="required-lang-preferences"
            legend={formattedLabels.preferredLang}
            id="preferredLang"
            name="preferredLang"
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            items={localizedEnumToOptions(options?.languages, intl)}
            defaultSelected={Language.En}
          />
        </div>
        <div className="mb-6 flex flex-col gap-2 xs:flex-row">
          <div className="grow">
            <Input
              id="email"
              type="email"
              name="email"
              label={formattedLabels.email}
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
          {emailAddressContacted ? (
            <Input
              id="verificationCode"
              name="verificationCode"
              type="text"
              label={formattedLabels.verificationCode}
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
            <Button mode="solid" color="primary" type="submit">
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
    </BasicForm>
  );
};

const GettingStarted_Query = graphql(/** GraphQL */ `
  query GettingStarted_Query {
    ...GettingStartedOptions_QueryFragment
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

const GettingStartedPage = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const authContext = useAuthorization();
  const [{ data, fetching, error }] = useQuery({
    query: GettingStarted_Query,
  });

  const email = data?.me?.email;
  const meId = authContext?.userAuthInfo?.id;

  const [, executeGeneralMutation] = useMutation(GettingStarted_Mutation);
  const [, executeNotificationMutation] = useMutation(
    UpdateEmailNotifications_Mutation,
  );

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(messages.breadcrumb),
        url: paths.gettingStarted(),
      },
    ],
  });

  const handleSubmit = async (formValues: FormValues) => {
    console.debug("handleSubmit", formValues);
    return Promise.resolve();
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
            <Pending fetching={fetching || !authContext.isLoaded} error={error}>
              <GettingStartedForm
                cacheKey={`getting-started-${meId}`}
                optionsQuery={data}
                onSubmit={handleSubmit}
              />
            </Pending>
          </Card>
        </section>
      </Hero>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <GettingStartedPage />
  </RequireAuth>
);

export default GettingStartedPage;
