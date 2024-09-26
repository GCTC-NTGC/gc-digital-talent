import { useLocation, useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import sortBy from "lodash/sortBy";
import { useMutation, useQuery } from "urql";

import { toast } from "@gc-digital-talent/toast";
import {
  Input,
  TextArea,
  Submit,
  Combobox,
  Select,
  localizedEnumToOptions,
} from "@gc-digital-talent/forms";
import { getLocale, errorMessages } from "@gc-digital-talent/i18n";
import { keyStringRegex, unpackMaybes } from "@gc-digital-talent/helpers";
import { Pending } from "@gc-digital-talent/ui";
import {
  Skill,
  SkillFamily,
  CreateSkillInput,
  CreateSkillMutation,
  SkillCategory,
  graphql,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import adminMessages from "~/messages/adminMessages";
import { parseKeywords } from "~/utils/skillUtils";
import AdminHero from "~/components/Hero/AdminHero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import { SkillFormOptions_Query } from "./operations";

interface Option<V> {
  value: V;
  label: string;
}

type FormValues = Pick<Skill, "description"> & {
  key: string;
  name: {
    en: string;
    fr: string;
  };
  description: {
    en: string;
    fr: string;
  };
  keywords: {
    en: string;
    fr: string;
  };
  category: SkillCategory;
  families: string[] | undefined;
};
interface CreateSkillFormProps {
  families: SkillFamily[];
  handleCreateSkill: (
    data: CreateSkillInput,
  ) => Promise<CreateSkillMutation["createSkill"]>;
}

export const CreateSkillForm = ({
  families,
  handleCreateSkill,
}: CreateSkillFormProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const navigate = useNavigate();
  const paths = useRoutes();
  const [{ data }] = useQuery({ query: SkillFormOptions_Query });
  const methods = useForm<FormValues>();
  const { handleSubmit } = methods;
  const sortedFamilies = sortBy(families, (family) => {
    return family.name?.[locale]?.toLocaleUpperCase();
  });

  const formValuesToSubmitData = (values: FormValues): CreateSkillInput => ({
    ...values,
    keywords: {
      en: parseKeywords(values.keywords.en),
      fr: parseKeywords(values.keywords.fr),
    },
    families: {
      sync: values.families,
    },
  });

  const { state } = useLocation();
  const navigateTo = state?.from ?? paths.skillTable();

  const onSubmit: SubmitHandler<FormValues> = async (values: FormValues) => {
    return handleCreateSkill(formValuesToSubmitData(values))
      .then(() => {
        navigate(navigateTo);
        toast.success(
          intl.formatMessage({
            defaultMessage: "Skill created successfully!",
            id: "bGi9fO",
            description:
              "Message displayed to user after skill is created successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: creating skill failed",
            id: "ksMybU",
            description:
              "Message displayed to user after skill fails to get created.",
          }),
        );
      });
  };

  const skillFamilyOptions: Option<string>[] = sortedFamilies.map(
    ({ id, name }) => ({
      value: id,
      label: name?.[locale] ?? "",
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
            id="key"
            name="key"
            label={intl.formatMessage(adminMessages.key)}
            context={intl.formatMessage({
              defaultMessage:
                "The 'key' is a string that uniquely identifies a skill. It should be based on the skills English name, and it should be concise. A good example would be \"information_management\". It may be used in the code to refer to this particular skill, so it cannot be changed later.",
              id: "jthonT",
              description:
                "Additional context describing the purpose of the skills 'key' field.",
            })}
            type="text"
            rules={{
              required: intl.formatMessage(errorMessages.required),
              pattern: {
                value: keyStringRegex,
                message: intl.formatMessage({
                  defaultMessage:
                    "Please use only lowercase letters and underscores.",
                  id: "3owqTQ",
                  description: "Description for rule pattern on key field",
                }),
              },
            }}
          />
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
              id: "rJqCuH",
              description:
                "Label displayed on the create a skill form description (English) field.",
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
              id: "a+bWz1",
              description:
                "Label displayed on the create a skill form description (French) field.",
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
              id: "xx8yaE",
              description:
                "Label displayed on the skill form skill families field.",
            })}
            placeholder={intl.formatMessage({
              defaultMessage: "Select one or more skill families",
              id: "GNhFh2",
              description:
                "Placeholder displayed on the skill form skill families field.",
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

const CreateSkillSkillFamilies_Query = graphql(/* GraphQL */ `
  query CreateSkillSkillFamilies {
    skillFamilies {
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
      skills {
        id
        key
        name {
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
      }
    }
  }
`);

const CreateSkill_Mutation = graphql(/* GraphQL */ `
  mutation CreateSkill($skill: CreateSkillInput!) {
    createSkill(skill: $skill) {
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
    }
  }
`);

const CreateSkillPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const [{ data: lookupData, fetching, error }] = useQuery({
    query: CreateSkillSkillFamilies_Query,
  });

  const [, executeMutation] = useMutation(CreateSkill_Mutation);
  const handleCreateSkill = (data: CreateSkillInput) =>
    executeMutation({ skill: data }).then((result) => {
      if (result.data?.createSkill) {
        return result.data?.createSkill;
      }
      return Promise.reject(result.error);
    });

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(adminMessages.skills),
        url: routes.skillTable(),
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Create<hidden> skill</hidden>",
          id: "9QxHnD",
          description: "Breadcrumb title for the create skill page link.",
        }),
        url: routes.skillCreate(),
      },
    ],
    isAdmin: true,
  });

  const pageTitle = intl.formatMessage({
    defaultMessage: "Create skill",
    id: "71mPNh",
    description: "Title for Create skill",
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
          <CreateSkillForm
            handleCreateSkill={handleCreateSkill}
            families={unpackMaybes(lookupData?.skillFamilies)}
          />
        </Pending>
      </AdminContentWrapper>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <CreateSkillPage />
  </RequireAuth>
);

Component.displayName = "AdminCreateSkillPage";

export default CreateSkillPage;
