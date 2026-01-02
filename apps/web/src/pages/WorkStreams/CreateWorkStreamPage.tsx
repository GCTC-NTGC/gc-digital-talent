import { useNavigate } from "react-router";
import { SubmitHandler } from "react-hook-form";
import { useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";

import { toast } from "@gc-digital-talent/toast";
import {
  BasicForm,
  Input,
  OptGroupOrOption,
  Select,
  Submit,
  SwitchInput,
} from "@gc-digital-talent/forms";
import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";
import {
  graphql,
  Scalars,
  CreateWorkStreamInput,
  LocalizedStringInput,
  InputMaybe,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import {
  Heading,
  Link,
  CardSeparator,
  Card,
  Pending,
} from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import Hero from "~/components/Hero";
import adminMessages from "~/messages/adminMessages";

const CreateWorkStream_Mutation = graphql(/* GraphQL */ `
  mutation CreateWorkStream($workStream: CreateWorkStreamInput!) {
    createWorkStream(workStream: $workStream) {
      id
    }
  }
`);

interface FormValues {
  key: InputMaybe<Scalars["String"]["input"]>;
  name: LocalizedStringInput;
  plainLanguageName?: InputMaybe<LocalizedStringInput>;
  community: string;
  talentSearchable: boolean;
}

const formValuesToSubmitData = (data: FormValues): CreateWorkStreamInput => {
  const communityId = data.community;
  return {
    key: data.key,
    name: {
      en: data.name?.en,
      fr: data.name?.fr,
    },
    plainLanguageName: {
      en: data.plainLanguageName?.en,
      fr: data.plainLanguageName?.fr,
    },
    community: { connect: communityId },
    talentSearchable: data.talentSearchable,
  };
};

interface CreateWorkStreamProps {
  communityOptions: OptGroupOrOption[];
}

export const CreateWorkStreamForm = ({
  communityOptions,
}: CreateWorkStreamProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const [, executeMutation] = useMutation(CreateWorkStream_Mutation);

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: creating work stream failed",
        id: "R+PiXo",
        description: "Messaged displayed after creating work stream fails",
      }),
    );
  };

  const handleSubmit: SubmitHandler<FormValues> = async (data) => {
    return executeMutation({ workStream: formValuesToSubmitData(data) })
      .then(async (result) => {
        if (result.data?.createWorkStream) {
          await navigate(
            paths.workStreamView(result.data?.createWorkStream.id),
          );
          toast.success(
            intl.formatMessage({
              defaultMessage: "Work stream created successfully!",
              id: "bPN0EF",
              description: "Message displayed after a work stream is created",
            }),
          );
        } else {
          handleError();
        }
      })
      .catch(handleError);
  };

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.workStreams),
        url: paths.workStreamTable(),
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Create<hidden> work stream</hidden>",
          id: "TwR8/e",
          description: "Breadcrumb title for the create work stream page link.",
        }),
        url: paths.workStreamCreate(),
      },
    ],
  });

  const pageTitle = intl.formatMessage({
    defaultMessage: "Create a work stream",
    id: "fo51DL",
    description: "Page title for the work stream creation page",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <Hero title={pageTitle} crumbs={navigationCrumbs} overlap centered>
        <Card className="mb-18">
          <Heading
            level="h2"
            color="secondary"
            icon={IdentificationIcon}
            center
            className="mt-0 mb-9 font-normal xs:justify-start xs:text-left"
          >
            {intl.formatMessage({
              defaultMessage: "Work stream information",
              id: "0bf24C",
              description: "Heading for the 'create a work stream' form",
            })}
          </Heading>
          <BasicForm<FormValues>
            onSubmit={handleSubmit}
            options={{ defaultValues: { talentSearchable: true } }}
          >
            <div className="grid gap-6 xs:grid-cols-2">
              <Input
                id="name.en"
                label={intl.formatMessage(commonMessages.name)}
                appendLanguageToLabel={"en"}
                name="name.en"
                type="text"
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
              <Input
                id="name.fr"
                label={intl.formatMessage(commonMessages.name)}
                appendLanguageToLabel={"fr"}
                name="name.fr"
                type="text"
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
              <div className="xs:col-span-2">
                <p id="plainLanguageNameHelp">
                  {intl.formatMessage({
                    defaultMessage:
                      "We recommend adding an alternative name using plain language for non-government users.",
                    id: "eZT5Vr",
                    description: "Suggestion for the next work stream input.",
                  })}
                </p>
              </div>
              <Input
                id="plainLanguageName.en"
                label={intl.formatMessage({
                  defaultMessage: "Plain language alternative",
                  id: "vUZf8Y",
                  description: "Label for plain language alternative",
                })}
                appendLanguageToLabel={"en"}
                name="plainLanguageName.en"
                type="text"
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
                aria-describedby="plainLanguageNameHelp"
              />
              <Input
                id="plainLanguageName.fr"
                label={intl.formatMessage({
                  defaultMessage: "Plain language alternative",
                  id: "vUZf8Y",
                  description: "Label for plain language alternative",
                })}
                appendLanguageToLabel={"fr"}
                name="plainLanguageName.fr"
                type="text"
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
                aria-describedby="plainLanguageNameHelp"
              />
              <div className="xs:col-span-2">
                <Select
                  id="community"
                  name="community"
                  label={intl.formatMessage(adminMessages.community)}
                  nullSelection={intl.formatMessage(
                    commonMessages.selectACommunity,
                  )}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  options={communityOptions}
                />
              </div>
              <div className="xs:col-span-2">
                <SwitchInput
                  id="talentSearchable"
                  name="talentSearchable"
                  label={intl.formatMessage(commonMessages.onFindTalent)}
                />
              </div>
              <div className="xs:col-span-2">
                <Input
                  id="key"
                  name="key"
                  label={intl.formatMessage(adminMessages.key)}
                  context={intl.formatMessage({
                    defaultMessage:
                      "The 'key' is a string that uniquely identifies a work stream. It should be based on the work streams English name, and it should be concise. A good example would be \"information_management\". It may be used in the code to refer to this particular work stream, so it cannot be changed later.",
                    id: "uWZgYM",
                    description:
                      "Additional context describing the purpose of the work streams 'key' field.",
                  })}
                  type="text"
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                    pattern: {
                      value: /^[a-z]+(_[a-z]+)*$/i,
                      message: intl.formatMessage({
                        defaultMessage:
                          "Please use only letters and underscores.",
                        id: "r4sAvp",
                        description:
                          "Description for rule pattern on key field",
                      }),
                    },
                  }}
                />
              </div>
            </div>
            <CardSeparator />
            <div className="flex flex-col items-center gap-6 xs:flex-row">
              <Submit
                text={intl.formatMessage({
                  defaultMessage: "Create work stream",
                  id: "RjKlKz",
                  description: "Text to create a work stream",
                })}
              />
              <Link
                mode="inline"
                color="warning"
                href={paths.workStreamTable()}
              >
                {intl.formatMessage({
                  defaultMessage: "Cancel and go back to work streams",
                  id: "kh9KTx",
                  description: "Link text to cancel updating a work stream",
                })}
              </Link>
            </div>
          </BasicForm>
        </Card>
      </Hero>
    </>
  );
};

const CreateWorkStream_Query = graphql(/* GraphQL */ `
  query CreateWorkStreamOptions {
    communities {
      id
      name {
        en
        fr
        localized
      }
    }
  }
`);

const CreateWorkStreamPage = () => {
  const [{ data: lookupData, fetching, error }] = useQuery({
    query: CreateWorkStream_Query,
  });

  const communityOptions: OptGroupOrOption[] = unpackMaybes(
    lookupData?.communities,
  ).map(({ id, name }) => ({
    value: id,
    label: name?.localized,
  }));

  return (
    <Pending fetching={fetching} error={error}>
      <CreateWorkStreamForm communityOptions={communityOptions} />
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <CreateWorkStreamPage />
  </RequireAuth>
);

Component.displayName = "AdminCreateWorkStreamPage";

export default Component;
