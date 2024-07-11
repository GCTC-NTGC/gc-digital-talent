import { useLocation, useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import pick from "lodash/pick";
import sortBy from "lodash/sortBy";
import { useMutation, useQuery } from "urql";

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
} from "@gc-digital-talent/i18n";
import { Pending, NotFound, Heading } from "@gc-digital-talent/ui";
import {
  SkillFamily,
  UpdateSkillFamilyInput,
  UpdateSkillFamilyMutation,
  Scalars,
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
import AdminHero from "~/components/Hero/AdminHero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

type Option<V> = { value: V; label: string };

type FormValues = Pick<SkillFamily, "name" | "description"> & {
  skills: string[];
};

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

interface UpdateSkillFamilyFormProps {
  skillFamilyQuery: FragmentType<typeof UpdateSkillFamily_Fragment>;
  skillsQuery: FragmentType<typeof UpdateSkillFamilySkill_Fragment>[];
  handleUpdateSkillFamily: (
    id: string,
    data: UpdateSkillFamilyInput,
  ) => Promise<UpdateSkillFamilyMutation["updateSkillFamily"]>;
}

export const UpdateSkillFamilyForm = ({
  skillFamilyQuery,
  skillsQuery,
  handleUpdateSkillFamily,
}: UpdateSkillFamilyFormProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const navigate = useNavigate();
  const paths = useRoutes();
  const initialSkillFamily = getFragment(
    UpdateSkillFamily_Fragment,
    skillFamilyQuery,
  );
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
    defaultValues: dataToFormValues(initialSkillFamily),
  });
  const { handleSubmit } = methods;

  const { state } = useLocation();
  const navigateTo = state?.from ?? paths.skillFamilyTable();

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    return handleUpdateSkillFamily(
      initialSkillFamily.id,
      formValuesToSubmitData(data),
    )
      .then(() => {
        navigate(navigateTo);
        toast.success(
          intl.formatMessage({
            defaultMessage: "Skill family updated successfully!",
            id: "2ekC5r",
            description:
              "Message displayed to user after skillFamily is updated successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating skill family failed",
            id: "zpwZSQ",
            description:
              "Message displayed to user after skillFamily fails to get updated.",
          }),
        );
      });
  };

  const skillOptions: Option<string>[] = sortedSkills.map(({ id, name }) => ({
    value: id,
    label: name?.[locale] || "",
  }));

  return (
    <section data-h2-wrapper="base(left, s)">
      <Heading level="h1" size="h2">
        {intl.formatMessage({
          defaultMessage: "Update Skill Family",
          id: "GQskY1",
          description: "Title displayed on the update a skillFamily form.",
        })}
      </Heading>
      <div>
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
            <div data-h2-margin="base(x1, 0)">
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
            </div>
            <div data-h2-align-self="base(flex-start)">
              <Submit />
            </div>
          </form>
        </FormProvider>
      </div>
    </section>
  );
};

type RouteParams = {
  skillFamilyId: Scalars["ID"]["output"];
};

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

const UpdateSkillFamilyPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const { skillFamilyId } = useRequiredParams<RouteParams>("skillFamilyId");
  const [{ data, fetching, error }] = useQuery({
    query: UpdateSkillFamilyData_Query,
    variables: { id: skillFamilyId || "" },
  });

  const [, executeMutation] = useMutation(UpdateSkillFamily_Mutation);
  const handleUpdateSkillFamily = (
    id: string,
    formData: UpdateSkillFamilyInput,
  ) =>
    /* We must pick only the fields belonging to UpdateSkillFamilyInput, because its possible
       the data object contains other props at runtime, and this will cause the
       graphql operation to fail. */
    executeMutation({
      id,
      skillFamily: pick(formData, ["description", "name", "skills"]),
    }).then((result) => {
      if (result.data?.updateSkillFamily) {
        return result.data?.updateSkillFamily;
      }
      return Promise.reject(result.error);
    });

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(adminMessages.skillFamilies),
        url: routes.skillFamilyTable(),
      },
      ...(skillFamilyId
        ? [
            {
              label: intl.formatMessage({
                defaultMessage: "Edit<hidden> skill family</hidden>",
                id: "5SKmte",
                description:
                  "Breadcrumb title for the edit skill family page link.",
              }),
              url: routes.skillFamilyUpdate(skillFamilyId),
            },
          ]
        : []),
    ],
    isAdmin: true,
  });

  const pageTitle = intl.formatMessage({
    defaultMessage: "Edit skill family",
    id: "azdo5+",
    description: "Page title for the skill family edit page",
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
          {data?.skillFamily ? (
            <UpdateSkillFamilyForm
              skillFamilyQuery={data.skillFamily}
              skillsQuery={unpackMaybes(data.skills)}
              handleUpdateSkillFamily={handleUpdateSkillFamily}
            />
          ) : (
            <NotFound
              headingMessage={intl.formatMessage(commonMessages.notFound)}
            >
              <p>
                {intl.formatMessage(
                  {
                    defaultMessage: "SkillFamily {skillFamilyId} not found.",
                    id: "ZWnKEJ",
                    description: "Message displayed for skillFamily not found.",
                  },
                  { skillFamilyId },
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
    <UpdateSkillFamilyPage />
  </RequireAuth>
);

Component.displayName = "AdminUpdateSkillFamilyPage";

export default UpdateSkillFamilyPage;
