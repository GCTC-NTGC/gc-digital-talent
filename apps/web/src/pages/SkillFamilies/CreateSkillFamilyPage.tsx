import { useNavigate } from "react-router";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import sortBy from "lodash/sortBy";
import { useMutation, useQuery } from "urql";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";

import { toast } from "@gc-digital-talent/toast";
import { Input, TextArea, Submit, Combobox } from "@gc-digital-talent/forms";
import {
  getLocale,
  errorMessages,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  Pending,
  Heading,
  Card,
  Link,
  CardSeparator,
} from "@gc-digital-talent/ui";
import {
  Skill,
  CreateSkillFamilyInput,
  graphql,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import adminMessages from "~/messages/adminMessages";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import Hero from "~/components/Hero";

import messages from "./messages";

const CreateSkillFamily_Mutation = graphql(/* GraphQL */ `
  mutation CreateSkillFamily($skillFamily: CreateSkillFamilyInput!) {
    createSkillFamily(skillFamily: $skillFamily) {
      id
      key
      name {
        en
        fr
      }
    }
  }
`);

interface Option<V> {
  value: V;
  label: string;
}

interface FormValues {
  key: string;
  name: {
    en: string;
    fr: string;
  };
  description: {
    en: string;
    fr: string;
  };
  skills: string[] | undefined;
}

interface CreateSkillFamilyProps {
  skills: Skill[];
}

export const CreateSkillFamily = ({ skills }: CreateSkillFamilyProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const navigate = useNavigate();
  const paths = useRoutes();
  const methods = useForm<FormValues>();
  const { handleSubmit } = methods;
  const sortedSkills = sortBy(skills, (skill) => {
    return skill.name?.[locale]?.toLocaleUpperCase();
  });
  const [, executeMutation] = useMutation(CreateSkillFamily_Mutation);

  const formValuesToSubmitData = (
    values: FormValues,
  ): CreateSkillFamilyInput => ({
    ...values,
    skills: {
      sync: values.skills,
    },
  });

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(adminMessages.skillFamilies),
        url: paths.skillFamilyTable(),
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Create<hidden> skill family</hidden>",
          id: "PQXvrU",
          description:
            "Breadcrumb title for the create skill family page link.",
        }),
        url: paths.skillFamilyCreate(),
      },
    ],
  });

  const pageTitle = intl.formatMessage({
    defaultMessage: "Create a skill family",
    id: "i4OGTD",
    description: "Page title for the skill family creation page",
  });

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: creating skill family failed",
        id: "rQ3Gbb",
        description:
          "Message displayed to user after skill family fails to get created.",
      }),
    );
  };

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    return executeMutation({ skillFamily: formValuesToSubmitData(data) })
      .then(async (result) => {
        if (result.data?.createSkillFamily) {
          await navigate(
            paths.skillFamilyView(result.data.createSkillFamily.id),
          );
          toast.success(
            intl.formatMessage({
              defaultMessage: "Skill family created successfully!",
              id: "d8CQJr",
              description:
                "Message displayed to user after skill family is created successfully.",
            }),
          );
        } else {
          handleError();
        }
      })
      .catch(handleError);
  };

  const skillOptions: Option<string>[] = sortedSkills.map(({ id, name }) => ({
    value: id,
    label: getLocalizedName(name, intl),
  }));

  return (
    <>
      <SEO title={pageTitle} />
      <Hero title={pageTitle} crumbs={navigationCrumbs} centered overlap>
        <div data-h2-margin-bottom="base(x3)">
          <Card>
            <div
              data-h2-display="base(flex)"
              data-h2-justify-content="base(center) p-tablet(flex-start)"
            >
              <Heading
                color="secondary"
                size="h2"
                data-h2-margin-top="base(0)"
                icon={IdentificationIcon}
              >
                {intl.formatMessage(messages.skillFamilyInfo)}
              </Heading>
            </div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div
                  data-h2-display="base(grid)"
                  data-h2-grid-template-columns="p-tablet(1fr 1fr)"
                  data-h2-gap="base(x1)"
                  data-h2-margin-bottom="base(x1)"
                >
                  <Input
                    id="name_en"
                    name="name.en"
                    autoComplete="off"
                    label={intl.formatMessage(adminMessages.nameEn)}
                    type="text"
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                  />
                  <Input
                    id="name_fr"
                    name="name.fr"
                    autoComplete="off"
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
                      id: "luZnRG",
                      description:
                        "Label displayed on the create a skill family form description (English) field.",
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
                      id: "Q0gIlv",
                      description:
                        "Label displayed on the create a skill family form description (French) field.",
                    })}
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                  />
                </div>
                <div
                  data-h2-display="base(flex)"
                  data-h2-flex-direction="base(column)"
                  data-h2-gap="base(x1)"
                >
                  <Combobox
                    id="skills"
                    name="skills"
                    isMulti
                    label={intl.formatMessage(messages.skillsInFamily)}
                    placeholder={intl.formatMessage({
                      defaultMessage: "Select one or more skills",
                      id: "GhszAa",
                      description:
                        "Placeholder displayed on the skill family form skills field.",
                    })}
                    options={skillOptions}
                  />

                  <Input
                    id="key"
                    name="key"
                    label={intl.formatMessage(adminMessages.key)}
                    context={intl.formatMessage({
                      defaultMessage:
                        "The 'key' is a string that uniquely identifies a skill family. It should be based on the skill families English name, and it should be concise. A good example would be \"information_management\". It may be used in the code to refer to this particular skill family, so it cannot be changed later.",
                      id: "ytTGvb",
                      description:
                        "Additional context describing the purpose of the skill families 'key' field.",
                    })}
                    type="text"
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                      pattern: {
                        value: /^[a-z]+(_[a-z]+)*$/,
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
                <CardSeparator />
                <div
                  data-h2-display="base(flex)"
                  data-h2-gap="base(x1)"
                  data-h2-flex-direction="base(column) p-tablet(row)"
                  data-h2-align-items="base(center)"
                  data-h2-text-align="base(center) p-tablet(inherit)"
                >
                  <Submit
                    text={intl.formatMessage({
                      defaultMessage: "Create skill family",
                      id: "qkuRs8",
                      description: "Button text to create a skill family",
                    })}
                  />
                  <Link
                    color="warning"
                    mode="inline"
                    href={paths.skillFamilyTable()}
                  >
                    {intl.formatMessage({
                      defaultMessage: "Cancel and go back to skill families",
                      id: "YjDiUu",
                      description: "Link text to return to skill family table",
                    })}
                  </Link>
                </div>
              </form>
            </FormProvider>
          </Card>
        </div>
      </Hero>
    </>
  );
};

const SkillFamilySkills_Query = graphql(/* GraphQL */ `
  query SkillFamilySkills {
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
`);

const CreateSkillFamilyPage = () => {
  const [{ data: lookupData, fetching, error }] = useQuery({
    query: SkillFamilySkills_Query,
  });

  return (
    <>
      <Pending fetching={fetching} error={error}>
        <CreateSkillFamily skills={unpackMaybes(lookupData?.skills)} />
      </Pending>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <CreateSkillFamilyPage />
  </RequireAuth>
);

Component.displayName = "AdminCreateSkillFamilyPage";

export default CreateSkillFamilyPage;
