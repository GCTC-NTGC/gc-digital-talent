import { useNavigate } from "react-router-dom";
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
} from "@gc-digital-talent/i18n";
import { keyStringRegex, unpackMaybes } from "@gc-digital-talent/helpers";
import { CardSectioned, Heading, Link, Pending } from "@gc-digital-talent/ui";
import {
  Skill,
  SkillFamily,
  CreateSkillInput,
  SkillCategory,
  graphql,
  Scalars,
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
  ) => Promise<Scalars["UUID"]["output"]>;
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

  const onSubmit: SubmitHandler<FormValues> = async (values: FormValues) => {
    return handleCreateSkill(formValuesToSubmitData(values))
      .then((id) => {
        navigate(paths.skillView(id));
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
              >
                {intl.formatMessage({
                  defaultMessage: "Skill information",
                  id: "oCFoWU",
                  description: "Heading for the 'create a skill' form",
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
              <div data-h2-grid-column="p-tablet(span 2)">
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
              <div data-h2-grid-column="p-tablet(span 2)">
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
              <div data-h2-grid-column="p-tablet(span 2)">
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
                        description:
                          "Description for rule pattern on key field",
                      }),
                    },
                  }}
                />
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
              text={intl.formatMessage({
                defaultMessage: "Create skill",
                id: "fcH4nb",
                description: "Button label to create a new skill",
              })}
            />
            <Link color="warning" mode="inline" href={paths.skillTable()}>
              {intl.formatMessage({
                defaultMessage: "Cancel and go back to the skill editor",
                id: "oCL/sl",
                description: "Button label to return to the skills table",
              })}
            </Link>
          </CardSectioned.Item>
        </CardSectioned.Root>
      </form>
    </FormProvider>
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
  const [{ data: lookupData, fetching, error }] = useQuery({
    query: CreateSkillSkillFamilies_Query,
  });

  const [, executeMutation] = useMutation(CreateSkill_Mutation);
  const handleCreateSkill = (data: CreateSkillInput) =>
    executeMutation({ skill: data }).then((result) => {
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
    isAdmin: true,
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
        <div data-h2-margin-bottom="base(x3)">
          <Pending fetching={fetching} error={error}>
            <CreateSkillForm
              handleCreateSkill={handleCreateSkill}
              families={unpackMaybes(lookupData?.skillFamilies)}
            />
          </Pending>
        </div>
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

export default CreateSkillPage;
