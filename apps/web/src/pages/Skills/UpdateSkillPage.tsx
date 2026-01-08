import { useNavigate } from "react-router";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import pick from "lodash/pick";
import sortBy from "lodash/sortBy";
import { useMutation, useQuery } from "urql";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";

import { toast } from "@gc-digital-talent/toast";
import {
  Submit,
  Input,
  TextArea,
  unpackIds,
  Combobox,
  Select,
  localizedEnumToOptions,
} from "@gc-digital-talent/forms";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  getLocale,
  errorMessages,
  commonMessages,
  getLocalizedName,
  formMessages,
} from "@gc-digital-talent/i18n";
import {
  Pending,
  NotFound,
  Heading,
  Link,
  CardSeparator,
  Card,
} from "@gc-digital-talent/ui";
import {
  Skill,
  UpdateSkillInput,
  UpdateSkillMutation,
  Scalars,
  SkillCategory,
  graphql,
  FragmentType,
  getFragment,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import adminMessages from "~/messages/adminMessages";
import { parseKeywords } from "~/utils/skillUtils";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import Hero from "~/components/Hero";
import pageTitles from "~/messages/pageTitles";

import { SkillFormOptions_Fragment } from "./operations";

interface Option<V> {
  value: V;
  label: string;
}

interface FormValues extends Pick<Skill, "name" | "description"> {
  category?: SkillCategory;
  families: string[];
  keywords: {
    en: string;
    fr: string;
  };
}

export const UpdateSkillSkillFamily_Fragment = graphql(/* GraphQL */ `
  fragment UpdateSkillSkillFamily on SkillFamily {
    id
    key
    name {
      en
      fr
    }
  }
`);

export const UpdateSkill_Fragment = graphql(/* GraphQL */ `
  fragment UpdateSkill on Skill {
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
    keywords {
      en
      fr
    }
    category {
      value
      label {
        en
        fr
      }
    }
    families {
      id
      key
    }
  }
`);

interface UpdateSkillFormProps {
  skillQuery: FragmentType<typeof UpdateSkill_Fragment>;
  familiesQuery: FragmentType<typeof UpdateSkillSkillFamily_Fragment>[];
  optionsQuery?: FragmentType<typeof SkillFormOptions_Fragment>;
  handleUpdateSkill: (
    id: string,
    data: UpdateSkillInput,
  ) => Promise<UpdateSkillMutation["updateSkill"]>;
}

export const UpdateSkillForm = ({
  skillQuery,
  familiesQuery,
  optionsQuery,
  handleUpdateSkill,
}: UpdateSkillFormProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const navigate = useNavigate();
  const paths = useRoutes();
  const data = getFragment(SkillFormOptions_Fragment, optionsQuery);
  const initialSkill = getFragment(UpdateSkill_Fragment, skillQuery);
  const skillFamilies = getFragment(
    UpdateSkillSkillFamily_Fragment,
    familiesQuery,
  );
  const sortedFamilies = sortBy([...skillFamilies], (family) => {
    return family.name?.[locale]?.toLocaleUpperCase();
  });

  const dataToFormValues = (values: Skill): FormValues => ({
    ...values,
    category: values.category.value ?? undefined,
    keywords: {
      en: values.keywords?.en?.join(", ") ?? "",
      fr: values.keywords?.fr?.join(", ") ?? "",
    },
    families: unpackIds(values?.families),
  });

  const formValuesToSubmitData = (values: FormValues): UpdateSkillInput => ({
    ...values,
    keywords: {
      en: parseKeywords(values.keywords.en),
      fr: parseKeywords(values.keywords.fr),
    },
    families: {
      sync: values.families,
    },
    name: {
      en: values.name?.en,
      fr: values.name?.fr,
    },
    description: {
      en: values.description?.en,
      fr: values.description?.fr,
    },
    category: values.category,
  });

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(initialSkill),
  });

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (values: FormValues) => {
    return handleUpdateSkill(initialSkill.id, formValuesToSubmitData(values))
      .then(async () => {
        await navigate(paths.skillView(initialSkill.id));
        toast.success(
          intl.formatMessage({
            defaultMessage: "Skill updated successfully!",
            id: "UTFKyy",
            description:
              "Message displayed to user after skill is updated successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating skill failed",
            id: "kfjmTt",
            description:
              "Message displayed to user after skill fails to be updated",
          }),
        );
      });
  };

  const skillFamilyOptions: Option<string>[] = sortedFamilies.map(
    ({ id, name }) => ({
      value: id,
      label: getLocalizedName(name, intl),
    }),
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mb-18">
          <Heading
            level="h2"
            color="secondary"
            icon={IdentificationIcon}
            center
            className="mt-0 mb-9 font-normal xs:justify-start xs:text-left"
          >
            {intl.formatMessage({
              defaultMessage: "Skill information",
              id: "aIEKtJ",
              description: "Heading for the 'edit a skill' form",
            })}
          </Heading>
          <div className="grid gap-6 xs:grid-cols-2">
            <Input
              id="name_en"
              name="name.en"
              autoComplete="off"
              label={intl.formatMessage(commonMessages.name)}
              appendLanguageToLabel={"en"}
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Input
              id="name_fr"
              name="name.fr"
              autoComplete="off"
              label={intl.formatMessage(commonMessages.name)}
              appendLanguageToLabel={"fr"}
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <TextArea
              id="description_en"
              name="description.en"
              label={intl.formatMessage(commonMessages.description)}
              appendLanguageToLabel={"en"}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <TextArea
              id="description_fr"
              name="description.fr"
              label={intl.formatMessage(commonMessages.description)}
              appendLanguageToLabel={"fr"}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Input
              id="keywords_en"
              name="keywords.en"
              label={intl.formatMessage({
                defaultMessage: "Keywords",
                id: "IgzSRR",
                description: "Label displayed on the skill form keywords field",
              })}
              appendLanguageToLabel={"en"}
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
                defaultMessage: "Keywords",
                id: "IgzSRR",
                description: "Label displayed on the skill form keywords field",
              })}
              appendLanguageToLabel={"fr"}
              context={intl.formatMessage({
                defaultMessage:
                  "This field accepts a list of comma separated keywords associated with the skill.",
                id: "NT3jrI",
                description:
                  "Additional context describing the purpose of the skills 'keyword' field.",
              })}
              type="text"
            />
            <div className="xs:col-span-2">
              <Select
                id="category"
                name="category"
                label={intl.formatMessage(adminMessages.category)}
                nullSelection={intl.formatMessage({
                  defaultMessage: "Select a category",
                  id: "+hRCVl",
                  description:
                    "Placeholder displayed on the skill family form category field.",
                })}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
                options={localizedEnumToOptions(data?.categories, intl)}
              />
            </div>
            <div className="xs:grid-cols-2">
              <Combobox
                id="families"
                name="families"
                isMulti
                label={intl.formatMessage(adminMessages.skillFamilies)}
                placeholder={intl.formatMessage({
                  defaultMessage: "Select one or more families",
                  id: "wORNl0",
                  description:
                    "Placeholder displayed on the skill form families field.",
                })}
                options={skillFamilyOptions}
              />
            </div>
            <div className="xs:grid-cols-2">
              <FieldDisplay label={intl.formatMessage(adminMessages.key)}>
                {initialSkill.key}
              </FieldDisplay>
            </div>
          </div>
          <CardSeparator />
          <div className="flex flex-col items-center gap-6 xs:flex-row">
            <Submit text={intl.formatMessage(formMessages.saveChanges)} />
            <Link
              color="warning"
              mode="inline"
              href={paths.skillView(initialSkill.id)}
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
  skillId: Scalars["ID"]["output"];
}

const UpdateSkillData_Query = graphql(/* GraphQL */ `
  query UpdateSkillData($id: UUID!) {
    ...SkillFormOptions

    skillFamilies {
      ...UpdateSkillSkillFamily
    }

    skill(id: $id) {
      ...UpdateSkill
      name {
        en
        fr
      }
    }
  }
`);

const UpdateSkill_Mutation = graphql(/* GraphQL */ `
  mutation UpdateSkill($id: ID!, $skill: UpdateSkillInput!) {
    updateSkill(id: $id, skill: $skill) {
      name {
        en
        fr
      }
      description {
        en
        fr
      }
      keywords {
        en
        fr
      }
    }
  }
`);

export const UpdateSkill = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const { skillId } = useRequiredParams<RouteParams>("skillId");
  const [{ data, fetching, error }] = useQuery({
    query: UpdateSkillData_Query,
    variables: { id: skillId || "" },
  });

  const [, executeMutation] = useMutation(UpdateSkill_Mutation);
  const handleUpdateSkill = (id: string, formData: UpdateSkillInput) =>
    /* We must pick only the fields belonging to UpdateSkillFamilyInput, because its possible
       the data object contains other props at runtime, and this will cause the
       graphql operation to fail. */
    executeMutation({
      id,
      skill: pick(formData, [
        "name",
        "description",
        "keywords",
        "category",
        "families",
      ]),
    }).then((result) => {
      if (result.data?.updateSkill) {
        return result.data?.updateSkill;
      }
      return Promise.reject(new Error(result.error?.toString()));
    });

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.skillsEditor),
        url: routes.skillTable(),
      },
      {
        label: getLocalizedName(data?.skill?.name, intl),
        url: routes.skillView(skillId),
      },

      ...(skillId
        ? [
            {
              label: intl.formatMessage({
                defaultMessage: "Edit<hidden> community</hidden>",
                id: "/zsCRf",
                description: "Breadcrumb title for the edit skill page link.",
              }),
              url: routes.skillUpdate(skillId),
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
        <Pending fetching={fetching} error={error}>
          {data?.skill ? (
            <UpdateSkillForm
              skillQuery={data?.skill}
              familiesQuery={unpackMaybes(data?.skillFamilies)}
              optionsQuery={data}
              handleUpdateSkill={handleUpdateSkill}
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
                  { skillId },
                )}
              </p>
            </NotFound>
          )}
        </Pending>
      </Hero>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <UpdateSkill />
  </RequireAuth>
);

Component.displayName = "AdminUpdateSkillPage";

export default Component;
