import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQuery } from "urql";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";
import { useNavigate, useOutletContext } from "react-router";

import { toast } from "@gc-digital-talent/toast";
import { Submit, Input, TextArea } from "@gc-digital-talent/forms";
import {
  errorMessages,
  commonMessages,
  formMessages,
} from "@gc-digital-talent/i18n";
import {
  Pending,
  NotFound,
  CardBasic,
  CardSeparator,
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
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import Hero from "~/components/Hero";
import { FRENCH_WORDS_PER_ENGLISH_WORD } from "~/constants/talentSearchConstants";

import { ContextType } from "../CommunityMembersPage/components/types";

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
  mandateAuthorityEn: string;
  mandateAuthorityFr: string;
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
      .catch(() => {
        throw new Error("Failed to save community");
      });
  };
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(handleSave)}
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1 0)"
      >
        <CardBasic>
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
                defaultMessage: "Community information",
                id: "IqZ6W0",
                description: "Heading for the 'edit a community' form",
              })}
            </Heading>
          </div>
          <div
            data-h2-display="base(grid)"
            data-h2-grid-template-columns="p-tablet(repeat(2, 1fr))"
            data-h2-gap="base(x1)"
          >
            <Input
              id="nameEn"
              name="nameEn"
              autoComplete="off"
              label={intl.formatMessage(adminMessages.nameEn)}
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Input
              id="nameFr"
              name="nameFr"
              autoComplete="off"
              label={intl.formatMessage(adminMessages.nameFr)}
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <TextArea
              id="descriptionEn"
              label={intl.formatMessage(adminMessages.descriptionEn)}
              name="descriptionEn"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              wordLimit={TEXT_AREA_MAX_WORDS_EN}
            />
            <TextArea
              id="descriptionFr"
              label={intl.formatMessage(adminMessages.descriptionFr)}
              name="descriptionFr"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              wordLimit={TEXT_AREA_MAX_WORDS_FR}
            />
            <Input
              id="mandateAuthorityEn"
              name="mandateAuthorityEn"
              label={intl.formatMessage({
                defaultMessage: "Mandate authority (English)",
                id: "T9alkU",
                description:
                  "Label displayed on the community form mandate authority field in English.",
              })}
              type="text"
            />
            <Input
              id="mandateAuthorityFr"
              name="mandateAuthorityFr"
              label={intl.formatMessage({
                defaultMessage: "Mandate authority (French)",
                id: "oWPn6I",
                description:
                  "Label displayed on the community form mandate authority field in French.",
              })}
              type="text"
            />
            <div data-h2-grid-column="p-tablet(span 2)">
              <FieldDisplay label={intl.formatMessage(adminMessages.key)}>
                {community.key}
              </FieldDisplay>
            </div>
          </div>
          <CardSeparator />
          <div
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
          </div>
        </CardBasic>
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
        defaultMessage: "Edit<hidden> skill</hidden>",
        id: "M2LfhH",
        description: "Breadcrumb title for the edit skill page link.",
      }),
      url: paths.communityUpdate(communityId),
    },
  ];

  const pageTitle = intl.formatMessage({
    defaultMessage: "Edit a community",
    id: "OY5/aW",
    description: "Page title for the edit community page.",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <Hero title={pageTitle} crumbs={crumbs} overlap centered>
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

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <UpdateCommunity />
  </RequireAuth>
);

Component.displayName = "AdminUpdateCommunityPage";

export default UpdateCommunity;
