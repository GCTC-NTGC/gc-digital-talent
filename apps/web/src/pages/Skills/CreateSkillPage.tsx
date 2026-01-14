import { useNavigate } from "react-router";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import sortBy from "lodash/sortBy";
import { useMutation, useQuery } from "urql";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";

import { toast } from "@gc-digital-talent/toast";
import {
  Input,
  TextArea,
  Submit,
  Combobox,
  Select,
  localizedEnumToOptions,
} from "@gc-digital-talent/forms";
import {
  getLocale,
  errorMessages,
  getLocalizedName,
  commonMessages,
} from "@gc-digital-talent/i18n";
import { keyStringRegex, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  Card,
  CardSeparator,
  Heading,
  Link,
  Pending,
} from "@gc-digital-talent/ui";
import {
  Skill,
  SkillFamily,
  CreateSkillInput,
  SkillCategory,
  graphql,
  Scalars,
  getFragment,
  FragmentType,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
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

interface FormValues extends Pick<Skill, "description"> {
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
}

interface CreateSkillFormProps {
  families: SkillFamily[];
  optionsQuery?: FragmentType<typeof SkillFormOptions_Fragment>;
  handleCreateSkill: (
    data: CreateSkillInput,
  ) => Promise<Scalars["UUID"]["output"]>;
}

export const CreateSkillForm = ({
  families,
  optionsQuery,
  handleCreateSkill,
}: CreateSkillFormProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const navigate = useNavigate();
  const paths = useRoutes();
  const data = getFragment(SkillFormOptions_Fragment, optionsQuery);
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

  const onSubmit: SubmitHandler<FormValues> = async (values: FormValues) => {
    return handleCreateSkill(formValuesToSubmitData(values))
      .then(async (id) => {
        await navigate(paths.skillView(id));
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
              id: "oCFoWU",
              description: "Heading for the 'create a skill' form",
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
            <div className="xs:col-span-2">
              <Combobox
                id="families"
                name="families"
                isMulti
                label={intl.formatMessage(adminMessages.skillFamilies)}
                placeholder={intl.formatMessage({
                  defaultMessage: "Select one or more skill families",
                  id: "GNhFh2",
                  description:
                    "Placeholder displayed on the skill form skill families field.",
                })}
                options={skillFamilyOptions}
              />
            </div>
            <div className="xs:col-span-2">
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
            </div>
          </div>

          <CardSeparator />
          <div className="flex flex-col items-center gap-6 xs:flex-row">
            <Submit
              text={intl.formatMessage({
                defaultMessage: "Create skill",
                id: "pDlEip",
                description: "Button label to create a skill",
              })}
            />
            <Link color="warning" mode="inline" href={paths.skillTable()}>
              {intl.formatMessage({
                defaultMessage: "Cancel and go back to the skill editor",
                id: "oCL/sl",
                description: "Button label to return to the skills table",
              })}
            </Link>
          </div>
        </Card>
      </form>
    </FormProvider>
  );
};

const CreateSkillSkillFamilies_Query = graphql(/* GraphQL */ `
  query CreateSkillSkillFamilies {
    ...SkillFormOptions

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
    }
  }
`);

const CreateSkillPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const [{ data, fetching, error }] = useQuery({
    query: CreateSkillSkillFamilies_Query,
  });

  const [, executeMutation] = useMutation(CreateSkill_Mutation);
  const handleCreateSkill = (input: CreateSkillInput) =>
    executeMutation({ skill: input }).then((result) => {
      if (result.data?.createSkill?.id) {
        return result.data.createSkill.id;
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
        label: intl.formatMessage({
          defaultMessage: "Create<hidden> skill</hidden>",
          id: "9QxHnD",
          description: "Breadcrumb title for the create skill page link.",
        }),
        url: routes.skillCreate(),
      },
    ],
  });

  const pageTitle = intl.formatMessage({
    defaultMessage: "Create a skill",
    id: "04iYYO",
    description: "Title for Create skill",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <Hero title={pageTitle} crumbs={navigationCrumbs} overlap centered>
        <Pending fetching={fetching} error={error}>
          <CreateSkillForm
            optionsQuery={data}
            handleCreateSkill={handleCreateSkill}
            families={unpackMaybes(data?.skillFamilies)}
          />
        </Pending>
      </Hero>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <CreateSkillPage />
  </RequireAuth>
);

Component.displayName = "AdminCreateSkillPage";

export default Component;
