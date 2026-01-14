import { useNavigate } from "react-router";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import sortBy from "lodash/sortBy";
import { useMutation, useQuery } from "urql";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";

import { toast } from "@gc-digital-talent/toast";
import {
  Submit,
  Input,
  Combobox,
  TextArea,
  unpackIds,
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
  Card,
  Link,
  CardSeparator,
} from "@gc-digital-talent/ui";
import {
  SkillFamily,
  UpdateSkillFamilyInput,
  Scalars,
  graphql,
  FragmentType,
  getFragment,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import adminMessages from "~/messages/adminMessages";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";

import messages from "./messages";

interface Option<V> {
  value: V;
  label: string;
}

interface FormValues extends Pick<SkillFamily, "name" | "description"> {
  skills: string[];
}

export const UpdateSkillFamilySkill_Fragment = graphql(/* GraphQL */ `
  fragment UpdateSkillFamilySkill on Skill {
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
`);

export const UpdateSkillFamily_Fragment = graphql(/* GraphQL */ `
  fragment UpdateSkillFamily on SkillFamily {
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
      category {
        value
        label {
          en
          fr
        }
      }
      name {
        en
        fr
      }
    }
  }
`);

const UpdateSkillFamily_Mutation = graphql(/* GraphQL */ `
  mutation UpdateSkillFamily($id: ID!, $skillFamily: UpdateSkillFamilyInput!) {
    updateSkillFamily(id: $id, skillFamily: $skillFamily) {
      id
      key
      name {
        en
        fr
      }
    }
  }
`);

interface UpdateSkillFamilyProps {
  skillFamilyQuery: FragmentType<typeof UpdateSkillFamily_Fragment>;
  skillsQuery: FragmentType<typeof UpdateSkillFamilySkill_Fragment>[];
}

export const UpdateSkillFamily = ({
  skillFamilyQuery,
  skillsQuery,
}: UpdateSkillFamilyProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const navigate = useNavigate();
  const paths = useRoutes();
  const skillFamily = getFragment(UpdateSkillFamily_Fragment, skillFamilyQuery);
  const skills = getFragment(UpdateSkillFamilySkill_Fragment, skillsQuery);
  const sortedSkills = sortBy([...skills], (skill) => {
    return skill.name?.[locale]?.toLocaleUpperCase();
  });

  const dataToFormValues = (data: SkillFamily): FormValues => ({
    ...data,
    skills: unpackIds(data?.skills),
  });

  const formValuesToSubmitData = (
    values: FormValues,
  ): UpdateSkillFamilyInput => ({
    ...values,
    skills: {
      sync: values.skills,
    },
    name: {
      en: values.name?.en,
      fr: values.name?.fr,
    },
    description: {
      en: values.description?.en,
      fr: values.description?.fr,
    },
  });

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(skillFamily),
  });
  const { handleSubmit } = methods;

  const pageTitle = intl.formatMessage({
    defaultMessage: "Edit a skill family",
    id: "wSlABO",
    description: "Page title for the skill family edit page",
  });

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(adminMessages.skillFamilies),
        url: paths.skillFamilyTable(),
      },
      {
        label: getLocalizedName(skillFamily.name, intl),
        url: paths.skillFamilyView(skillFamily.id),
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Edit<hidden> skill family</hidden>",
          id: "5SKmte",
          description: "Breadcrumb title for the edit skill family page link.",
        }),
        url: paths.skillFamilyUpdate(skillFamily.id),
      },
    ],
  });

  const [, executeMutation] = useMutation(UpdateSkillFamily_Mutation);
  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: updating skill family failed",
        id: "zpwZSQ",
        description:
          "Message displayed to user after skillFamily fails to get updated.",
      }),
    );
  };

  const onSubmit: SubmitHandler<FormValues> = async ({
    description,
    name,
    skills: skillsInput,
  }: FormValues) => {
    return executeMutation({
      id: skillFamily.id,
      skillFamily: formValuesToSubmitData({
        description,
        name,
        skills: skillsInput,
      }),
    })
      .then(async (result) => {
        if (result.data?.updateSkillFamily) {
          await navigate(paths.skillFamilyView(skillFamily.id));
          toast.success(
            intl.formatMessage({
              defaultMessage: "Skill family updated successfully!",
              id: "2ekC5r",
              description:
                "Message displayed to user after skillFamily is updated successfully.",
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
        <div className="mb-18">
          <Card>
            <div className="flex justify-center xs:justify-start">
              <Heading
                color="secondary"
                size="h2"
                className="mt-0"
                icon={IdentificationIcon}
              >
                {intl.formatMessage(messages.skillFamilyInfo)}
              </Heading>
            </div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
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
                </div>
                <div className="my-6 flex flex-col gap-6">
                  <Combobox
                    id="skills"
                    name="skills"
                    isMulti
                    label={intl.formatMessage(adminMessages.skills)}
                    placeholder={intl.formatMessage({
                      defaultMessage: "Select one or more skills",
                      id: "GhszAa",
                      description:
                        "Placeholder displayed on the skill family form skills field.",
                    })}
                    options={skillOptions}
                  />

                  <FieldDisplay label={intl.formatMessage(adminMessages.key)}>
                    {skillFamily.key ??
                      intl.formatMessage(commonMessages.notProvided)}
                  </FieldDisplay>
                </div>
                <CardSeparator />
                <div className="flex flex-col items-center gap-6 text-center xs:flex-row xs:text-left">
                  <Submit text={intl.formatMessage(formMessages.saveChanges)} />
                  <Link
                    color="warning"
                    mode="inline"
                    href={paths.skillFamilyView(skillFamily.id)}
                  >
                    {intl.formatMessage(commonMessages.cancel)}
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

interface RouteParams extends Record<string, string> {
  skillFamilyId: Scalars["ID"]["output"];
}

const UpdateSkillFamilyData_Query = graphql(/* GraphQL */ `
  query SkillFamilySkillsData($id: UUID!) {
    skills {
      ...UpdateSkillFamilySkill
    }

    skillFamily(id: $id) {
      ...UpdateSkillFamily
    }
  }
`);

const UpdateSkillFamilyPage = () => {
  const intl = useIntl();
  const { skillFamilyId } = useRequiredParams<RouteParams>("skillFamilyId");
  const [{ data, fetching, error }] = useQuery({
    query: UpdateSkillFamilyData_Query,
    variables: { id: skillFamilyId || "" },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.skillFamily ? (
        <UpdateSkillFamily
          skillFamilyQuery={data.skillFamily}
          skillsQuery={unpackMaybes(data.skills)}
        />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>
            {intl.formatMessage(
              {
                defaultMessage: "Skill family {skillFamilyId} not found.",
                id: "asjJwj",
                description: "Message displayed for skillFamily not found.",
              },
              { skillFamilyId },
            )}
          </p>
        </NotFound>
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <UpdateSkillFamilyPage />
  </RequireAuth>
);

Component.displayName = "AdminUpdateSkillFamilyPage";

export default Component;
