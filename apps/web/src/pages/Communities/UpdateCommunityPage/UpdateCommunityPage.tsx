import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQuery } from "urql";
import { useNavigate, useOutletContext } from "react-router";
import QueueListIcon from "@heroicons/react/24/outline/QueueListIcon";

import { toast } from "@gc-digital-talent/toast";
import { Submit, Input, TextArea } from "@gc-digital-talent/forms";
import {
  errorMessages,
  commonMessages,
  formMessages,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import {
  Pending,
  NotFound,
  Card,
  CardSeparator,
  Heading,
  Link,
  Notice,
} from "@gc-digital-talent/ui";
import type {
  FragmentType,
  UpdateCommunityInput,
} from "@gc-digital-talent/graphql";
import { graphql, getFragment } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import adminMessages from "~/messages/adminMessages";
import Hero from "~/components/Hero";
import { FRENCH_WORDS_PER_ENGLISH_WORD } from "~/constants/talentSearchConstants";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import type { ContextType } from "../CommunityMembersPage/components/types";

const TEXT_AREA_MAX_WORDS_EN = 200;
const TEXT_AREA_MAX_WORDS_FR = Math.round(
  TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD,
);
interface FormValues {
  key: string;
  nameEn: string;
  nameFr: string;
  descriptionEn: string;
  descriptionFr: string;
  informationUrlEn: string;
  informationUrlFr: string;
  mandateAuthorityEn: string;
  mandateAuthorityFr: string;
  contactEmail: string;
}

const UpdateCommunityPage_CommunityFragment = graphql(/* GraphQL */ `
  fragment UpdateCommunityPage_Community on Community {
    id
    key
    name {
      en
      fr
    }
    description {
      en
      fr
    }
    informationUrl {
      en
      fr
    }
    contactEmail
    mandateAuthority {
      en
      fr
    }
  }
`);

const apiDataToFormValues = (
  apiData: UpdateCommunityInput | null | undefined,
): FormValues => ({
  key: apiData?.key ?? "",
  nameEn: apiData?.name?.en ?? "",
  nameFr: apiData?.name?.fr ?? "",
  descriptionEn: apiData?.description?.en ?? "",
  descriptionFr: apiData?.description?.fr ?? "",
  informationUrlEn: apiData?.informationUrl?.en ?? "",
  informationUrlFr: apiData?.informationUrl?.fr ?? "",
  contactEmail: apiData?.contactEmail ?? "",
  mandateAuthorityEn: apiData?.mandateAuthority?.en ?? "",
  mandateAuthorityFr: apiData?.mandateAuthority?.fr ?? "",
});

const formValuesToApiData = (formValues: FormValues): UpdateCommunityInput => ({
  key: formValues.key,
  name: {
    en: formValues.nameEn,
    fr: formValues.nameFr,
  },
  description: {
    en: formValues.descriptionEn,
    fr: formValues.descriptionFr,
  },
  informationUrl: {
    en: formValues.informationUrlEn,
    fr: formValues.informationUrlFr,
  },
  contactEmail: formValues.contactEmail,
  mandateAuthority: {
    en: formValues.mandateAuthorityEn,
    fr: formValues.mandateAuthorityFr,
  },
});

interface CommunityFormProps {
  query: FragmentType<typeof UpdateCommunityPage_CommunityFragment>;
  onUpdate: (data: UpdateCommunityInput) => Promise<void>;
  isSubmitting: boolean;
}
const CommunityForm = ({
  query,
  onUpdate,
  isSubmitting,
}: CommunityFormProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();
  const community = getFragment(UpdateCommunityPage_CommunityFragment, query);
  const methods = useForm<FormValues>({
    defaultValues: apiDataToFormValues(community),
  });
  const { handleSubmit } = methods;

  const handleSave = async (formValues: FormValues) => {
    return onUpdate(formValuesToApiData(formValues))
      .then(async () => {
        await navigate(paths.communityView(community.id));
        toast.success(
          intl.formatMessage({
            defaultMessage: "Community updated successfully!",
            id: "8oFk6S",
            description: "Message displayed after a community is updated",
          }),
        );
      })
      .catch((error: unknown) => {
        throw new Error("Failed to save community", { cause: error });
      });
  };
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(handleSave)}
        className="flex flex-col gap-y-6"
      >
        <Card space="lg">
          <Heading
            level="h2"
            color="primary"
            icon={QueueListIcon}
            center
            className="mt-0 mb-9 font-normal xs:justify-start xs:text-left"
          >
            {intl.formatMessage({
              defaultMessage: "Community information",
              id: "+OOFwz",
              description: "Title for community form",
            })}
          </Heading>
          <div className="grid gap-6 xs:grid-cols-2">
            <Input
              id="nameEn"
              name="nameEn"
              autoComplete="off"
              label={intl.formatMessage({
                defaultMessage: "Community name",
                id: "3K2EZB",
                description:
                  "Label displayed on the community form information name field",
              })}
              appendLanguageToLabel={"en"}
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Input
              id="nameFr"
              name="nameFr"
              autoComplete="off"
              label={intl.formatMessage({
                defaultMessage: "Community name",
                id: "3K2EZB",
                description:
                  "Label displayed on the community form information name field",
              })}
              appendLanguageToLabel={"fr"}
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <TextArea
              id="descriptionEn"
              label={intl.formatMessage(commonMessages.description)}
              appendLanguageToLabel={"en"}
              name="descriptionEn"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              wordLimit={TEXT_AREA_MAX_WORDS_EN}
            />
            <TextArea
              id="descriptionFr"
              label={intl.formatMessage(commonMessages.description)}
              appendLanguageToLabel={"fr"}
              name="descriptionFr"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              wordLimit={TEXT_AREA_MAX_WORDS_FR}
            />
            <Input
              id="informationUrlEn"
              name="informationUrlEn"
              label={intl.formatMessage({
                defaultMessage: "External link to information",
                id: "fWNqcM",
                description:
                  "Label displayed on the community form information URL field",
              })}
              appendLanguageToLabel={"en"}
              type="url"
            />
            <Input
              id="informationUrlFr"
              name="informationUrlFr"
              label={intl.formatMessage({
                defaultMessage: "External link to information",
                id: "fWNqcM",
                description:
                  "Label displayed on the community form information URL field",
              })}
              appendLanguageToLabel={"fr"}
              type="url"
            />
            <div className="xs:col-span-2">
              <Input
                id="contactEmail"
                name="contactEmail"
                label={intl.formatMessage({
                  defaultMessage: "Generic contact email",
                  id: "iVe7JX",
                  description:
                    "Label displayed on the community form contact email field",
                })}
                type="email"
              />
            </div>
            <div className="xs:col-span-2">
              <FieldDisplay label={intl.formatMessage(adminMessages.key)}>
                {community.key}
              </FieldDisplay>
              <Notice.Root className="mt-2">
                <Notice.Content>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "The key is not editable once a community is created. Reach out to the support team for further information.",
                      id: "U/NCbh",
                      description: "Description for notice for key field",
                    })}
                  </p>
                </Notice.Content>
              </Notice.Root>
            </div>
          </div>
          <CardSeparator />
          <Heading level="h3" className="xs:justify-start xs:text-left">
            {intl.formatMessage({
              defaultMessage: "Mandate authority",
              id: "83aYHF",
              description:
                "Label displayed on the community form mandate authority field",
            })}
          </Heading>
          <p className="mb-8">
            {intl.formatMessage({
              defaultMessage:
                "Please identify the name or position of the delegated officer with the mandate authority to permit this community to collect data on participating users. By completing this field, you acknowledge that the community has the correct approvals for data collection.",
              id: "saf66z",
              description: "Description for mandate authority fields",
            })}
          </p>
          <div className="grid gap-6 xs:grid-cols-2">
            <Input
              id="mandateAuthorityEn"
              name="mandateAuthorityEn"
              label={intl.formatMessage({
                defaultMessage: "Delegated officer or entity",
                id: "KRXSAf",
                description:
                  "Label displayed on the community form mandate authority field",
              })}
              appendLanguageToLabel={"en"}
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Input
              id="mandateAuthorityFr"
              name="mandateAuthorityFr"
              label={intl.formatMessage({
                defaultMessage: "Delegated officer or entity",
                id: "KRXSAf",
                description:
                  "Label displayed on the community form mandate authority field",
              })}
              appendLanguageToLabel={"fr"}
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
          </div>
          <CardSeparator />
          <div className="flex flex-col items-center gap-6 xs:flex-row">
            <Submit
              text={intl.formatMessage(formMessages.saveChanges)}
              isSubmitting={isSubmitting}
            />
            <Link
              color="warning"
              mode="inline"
              href={paths.communityView(community.id)}
            >
              {intl.formatMessage(commonMessages.cancel)}
            </Link>
          </div>
        </Card>
      </form>
    </FormProvider>
  );
};

interface RouteParams extends Record<string, string> {
  communityId: string;
}

const UpdateCommunityPage_Query = graphql(/* GraphQL */ `
  query UpdateCommunityPage($id: UUID!) {
    community(id: $id) {
      name {
        en
        fr
      }
      ...UpdateCommunityPage_Community
    }
  }
`);

const UpdateCommunity_Mutation = graphql(/* GraphQL */ `
  mutation UpdateCommunity($id: UUID!, $community: UpdateCommunityInput!) {
    updateCommunity(id: $id, community: $community) {
      id
    }
  }
`);

export const UpdateCommunityPage = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const { communityId } = useRequiredParams<RouteParams>("communityId");
  const [{ data, fetching, error }] = useQuery({
    query: UpdateCommunityPage_Query,
    variables: { id: communityId },
  });

  const [{ fetching: isSubmitting }, executeMutation] = useMutation(
    UpdateCommunity_Mutation,
  );

  const { navigationCrumbs: baseCrumbs } = useOutletContext<ContextType>();

  const handleSave = async (input: UpdateCommunityInput) => {
    return executeMutation({ id: communityId, community: input }).then(
      (result) => {
        if (result.data?.updateCommunity) {
          return Promise.resolve();
        }
        return Promise.reject(new Error(result.error?.toString()));
      },
    );
  };

  const crumbs = [
    ...(baseCrumbs ?? []),
    {
      label: intl.formatMessage({
        defaultMessage: "Edit<hidden> community</hidden>",
        id: "xk9i5D",
        description: "Breadcrumb title for the edit community page link.",
      }),
      url: paths.communityUpdate(communityId),
    },
  ];

  const pageTitle = intl.formatMessage({
    defaultMessage: "Edit a community",
    id: "OY5/aW",
    description: "Page title for the edit community page.",
  });

  const pageSubtitle = intl.formatMessage(
    {
      defaultMessage: "Edit details about the {name}",
      id: "NnfXYj",
      description: "Description for update community",
    },
    {
      name:
        getLocalizedName(data?.community?.name, intl) ??
        intl.formatMessage(commonMessages.notFound),
    },
  );

  return (
    <>
      <SEO title={pageTitle} description={pageSubtitle} />
      <Hero
        title={pageTitle}
        subtitle={pageSubtitle}
        crumbs={crumbs}
        overlap
        centered
      >
        <div className="mb-18">
          <Pending fetching={fetching} error={error}>
            {data?.community ? (
              <CommunityForm
                query={data.community}
                onUpdate={handleSave}
                isSubmitting={isSubmitting}
              />
            ) : (
              <NotFound
                headingMessage={intl.formatMessage(commonMessages.notFound)}
              >
                <p>
                  {intl.formatMessage(
                    {
                      defaultMessage: "Community {communityId} not found.",
                      id: "TfbBB7",
                      description: "Message displayed for community not found.",
                    },
                    { communityId },
                  )}
                </p>
              </NotFound>
            )}
          </Pending>
        </div>
      </Hero>
    </>
  );
};

const Component = () => {
  const { teamId } = useOutletContext<ContextType>();

  // wait for outlet to load
  if (teamId === undefined) {
    return null;
  }

  return (
    <RequireAuth
      rolesRequirements={[
        { name: ROLE_NAME.PlatformAdmin },
        { name: ROLE_NAME.CommunityAdmin, teamId },
      ]}
      strict
    >
      <UpdateCommunityPage />
    </RequireAuth>
  );
};

Component.displayName = "AdminUpdateCommunityPage";

export default Component;
