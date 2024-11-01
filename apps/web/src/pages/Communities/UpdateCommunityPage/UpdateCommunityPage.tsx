import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQuery } from "urql";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";

import { toast } from "@gc-digital-talent/toast";
import { Submit, Input, TextArea } from "@gc-digital-talent/forms";
import {
  errorMessages,
  commonMessages,
  getLocalizedName,
  formMessages,
} from "@gc-digital-talent/i18n";
import {
  Pending,
  NotFound,
  CardSectioned,
  Heading,
  Link,
} from "@gc-digital-talent/ui";
import {
  Scalars,
  graphql,
  FragmentType,
  getFragment,
  UpdateCommunityInput,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import FieldDisplay from "~/components/ToggleForm/FieldDisplay";
import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import adminMessages from "~/messages/adminMessages";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import Hero from "~/components/Hero";
import pageTitles from "~/messages/pageTitles";

interface FormValues {
  key: string;
  nameEn: string;
  nameFr: string;
  descriptionEn: string;
  descriptionFr: string;
}

const TEXT_AREA_MAX_WORDS = 200;

const ViewCommunityPage_CommunityFragment = graphql(/* GraphQL */ `
  fragment ViewCommunityPage_Community on Community {
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
});

interface CommunityFormProps {
  query: FragmentType<typeof ViewCommunityPage_CommunityFragment>;
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
  const community = getFragment(ViewCommunityPage_CommunityFragment, query);
  const methods = useForm<FormValues>({
    defaultValues: apiDataToFormValues(community),
  });
  const { handleSubmit } = methods;

  const handleSave = async (formValues: FormValues) => {
    return onUpdate(formValuesToApiData(formValues))
      .then(() => {
        methods.reset(formValues, {
          keepDirty: false,
        });
      })
      .catch(() => methods.reset(formValues));
  };
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(handleSave)}
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1 0)"
      >
        <CardSectioned.Root>
          <CardSectioned.Item>
            <div
              data-h2-display="base(flex)"
              data-h2-justify-content="base(center) p-tablet(flex-start)"
            >
              <Heading
                level="h2"
                color="primary"
                Icon={IdentificationIcon}
                data-h2-margin="base(0, 0, x1.5, 0)"
                data-h2-font-weight="base(400)"
              >
                {intl.formatMessage({
                  defaultMessage: "Skill information",
                  id: "aIEKtJ",
                  description: "Heading for the 'edit a skill' form",
                })}
              </Heading>
            </div>
            <div
              data-h2-display="base(grid)"
              data-h2-grid-template-columns="p-tablet(repeat(2, 1fr))"
              data-h2-gap="base(x1)"
            >
              <Input
                id="name_en"
                name="name.en"
                label={intl.formatMessage(adminMessages.nameEn)}
                type="text"
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
              <Input
                id="name_fr"
                name="name.fr"
                label={intl.formatMessage(adminMessages.nameFr)}
                type="text"
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
              <TextArea
                id="description_en"
                name="description.en"
                label={intl.formatMessage({
                  defaultMessage: "Description (English)",
                  id: "fdKtYm",
                  description:
                    "Label displayed on the update a skill form description (English) field.",
                })}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
              <TextArea
                id="description_fr"
                name="description.fr"
                label={intl.formatMessage({
                  defaultMessage: "Description (French)",
                  id: "4EkI/1",
                  description:
                    "Label displayed on the update a skill form description (French) field.",
                })}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
              <Input
                id="keywords_en"
                name="keywords.en"
                label={intl.formatMessage({
                  defaultMessage: "Keywords (English)",
                  id: "FiylOa",
                  description:
                    "Label displayed on the skill form keywords field in English.",
                })}
                context={intl.formatMessage({
                  defaultMessage:
                    "This field accepts a list of comma separated keywords associated with the skill.",
                  id: "NT3jrI",
                  description:
                    "Additional context describing the purpose of the skills 'keyword' field.",
                })}
                type="text"
              />
              <Input
                id="keywords_fr"
                name="keywords.fr"
                label={intl.formatMessage({
                  defaultMessage: "Keywords (French)",
                  id: "fOl4Ez",
                  description:
                    "Label displayed on the skill form keywords field in French.",
                })}
                context={intl.formatMessage({
                  defaultMessage:
                    "This field accepts a list of comma separated keywords associated with the skill.",
                  id: "NT3jrI",
                  description:
                    "Additional context describing the purpose of the skills 'keyword' field.",
                })}
                type="text"
              />
              <div data-h2-grid-column="p-tablet(span 2)">
                <FieldDisplay label={intl.formatMessage(adminMessages.key)}>
                  {community.key}
                </FieldDisplay>
              </div>
            </div>
          </CardSectioned.Item>
          <CardSectioned.Item
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column) p-tablet(row)"
            data-h2-gap="base(x1)"
            data-h2-align-items="base(center)"
          >
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
          </CardSectioned.Item>
        </CardSectioned.Root>
      </form>
    </FormProvider>
  );
};

interface RouteParams extends Record<string, string> {
  communityId: Scalars["ID"]["output"];
}

const UpdateCommunityPage_Query = graphql(/* GraphQL */ `
  query UpdateCommunityPage($id: UUID!) {
    community(id: $id) {
      name {
        en
        fr
      }

      ...ViewCommunityPage_Community
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

export const UpdateCommunity = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const { communityId } = useRequiredParams<RouteParams>("communityId");
  const [{ data, fetching, error }] = useQuery({
    query: UpdateCommunityPage_Query,
    variables: { id: communityId || "" },
  });

  const [{ fetching: isSubmitting }, executeMutation] = useMutation(
    UpdateCommunity_Mutation,
  );

  const handleSave = async (input: UpdateCommunityInput) => {
    return executeMutation({ id: communityId, community: input }).then(
      (result) => {
        if (result.data?.updateCommunity) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Community updated successfully!",
              id: "8oFk6S",
              description: "Message displayed after a community is updated",
            }),
          );
          return;
        }
        throw new Error("Failed to save community");
      },
    );
  };
  const communityName = getLocalizedName(data?.community?.name, intl);

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.communities),
        url: paths.communityTable(),
      },
      ...(communityId
        ? [
            {
              label: communityName,
              url: paths.communityView(communityId),
            },
            {
              label: intl.formatMessage({
                defaultMessage: "Edit<hidden> skill</hidden>",
                id: "M2LfhH",
                description: "Breadcrumb title for the edit skill page link.",
              }),
              url: paths.communityUpdate(communityId),
            },
          ]
        : []),
    ],
  });

  const pageTitle = intl.formatMessage({
    defaultMessage: "Edit a skill",
    id: "spzerx",
    description: "Page title for the edit skill page.",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <Hero title={pageTitle} crumbs={navigationCrumbs} overlap centered>
        <div data-h2-margin-bottom="base(x3)">
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
                      defaultMessage: "Skill {skillId} not found.",
                      id: "953EAy",
                      description: "Message displayed for skill not found.",
                    },
                    { skillId: communityId },
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

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <UpdateCommunity />
  </RequireAuth>
);

Component.displayName = "AdminUpdateCommunityPage";

export default UpdateCommunity;
