import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import pick from "lodash/pick";
import sortBy from "lodash/sortBy";
import { useMutation, useQuery } from "urql";
import { useEffect } from "react";

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
} from "@gc-digital-talent/i18n";
import { Pending, NotFound } from "@gc-digital-talent/ui";
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

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import adminMessages from "~/messages/adminMessages";
import { parseKeywords } from "~/utils/skillUtils";
import AdminHero from "~/components/HeroDeprecated/AdminHero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useReturnPath from "~/hooks/useReturnPath";

import { SkillFormOptions_Query } from "./operations";

interface Option<V> {
  value: V;
  label: string;
}

type FormValues = Pick<Skill, "name" | "description"> & {
  category?: SkillCategory;
  families: string[];
  keywords: {
    en: string;
    fr: string;
  };
};

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
  handleUpdateSkill: (
    id: string,
    data: UpdateSkillInput,
  ) => Promise<UpdateSkillMutation["updateSkill"]>;
}

export const UpdateSkillForm = ({
  skillQuery,
  familiesQuery,
  handleUpdateSkill,
}: UpdateSkillFormProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const navigate = useNavigate();
  const paths = useRoutes();
  const [{ data }] = useQuery({ query: SkillFormOptions_Query });
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

  // category is populated by fetched enums, this can possibly not finish until after form has already rendered
  // so reset to default value (initialSkill) once enums loaded
  useEffect(() => {
    methods.resetField("category");
  }, [data?.categories, methods]);

  const { handleSubmit } = methods;

  const navigateTo = useReturnPath(paths.skillTable());

  const onSubmit: SubmitHandler<FormValues> = async (values: FormValues) => {
    return handleUpdateSkill(initialSkill.id, formValuesToSubmitData(values))
      .then(() => {
        navigate(navigateTo);
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
    <section data-h2-wrapper="base(left, s)">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x1 0)"
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
          <Combobox
            id="families"
            name="families"
            isMulti
            label={intl.formatMessage({
              defaultMessage: "Families",
              id: "JxVREd",
              description: "Label displayed on the skill form families field.",
            })}
            placeholder={intl.formatMessage({
              defaultMessage: "Select one or more families",
              id: "wORNl0",
              description:
                "Placeholder displayed on the skill form families field.",
            })}
            options={skillFamilyOptions}
          />
          <div data-h2-align-self="base(flex-start)">
            <Submit />
          </div>
        </form>
      </FormProvider>
    </section>
  );
};

interface RouteParams extends Record<string, string> {
  skillId: Scalars["ID"]["output"];
}

const UpdateSkillData_Query = graphql(/* GraphQL */ `
  query UpdateSkillData($id: UUID!) {
    skillFamilies {
      ...UpdateSkillSkillFamily
    }

    skill(id: $id) {
      ...UpdateSkill
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
        label: intl.formatMessage(adminMessages.skills),
        url: routes.skillTable(),
      },
      ...(skillId
        ? [
            {
              label: intl.formatMessage({
                defaultMessage: "Edit<hidden> skill</hidden>",
                id: "M2LfhH",
                description: "Breadcrumb title for the edit skill page link.",
              }),
              url: routes.skillUpdate(skillId),
            },
          ]
        : []),
    ],
    isAdmin: true,
  });

  const pageTitle = intl.formatMessage({
    defaultMessage: "Edit skill",
    id: "0VlOQq",
    description: "Page title for the edit skill page.",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <AdminHero
        title={pageTitle}
        nav={{ mode: "crumbs", items: navigationCrumbs }}
      />
      <AdminContentWrapper>
        <Pending fetching={fetching} error={error}>
          {data?.skill ? (
            <UpdateSkillForm
              skillQuery={data?.skill}
              familiesQuery={unpackMaybes(data?.skillFamilies)}
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
      </AdminContentWrapper>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <UpdateSkill />
  </RequireAuth>
);

Component.displayName = "AdminUpdateSkillPage";

export default UpdateSkill;
