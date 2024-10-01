import { useLocation, useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import sortBy from "lodash/sortBy";
import { useMutation, useQuery } from "urql";

import { toast } from "@gc-digital-talent/toast";
import { Input, TextArea, Submit, Combobox } from "@gc-digital-talent/forms";
import {
  getLocale,
  errorMessages,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { Pending, Heading } from "@gc-digital-talent/ui";
import {
  Skill,
  SkillFamily,
  CreateSkillFamilyInput,
  graphql,
  CreateSkillFamilyMutation,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import adminMessages from "~/messages/adminMessages";
import AdminHero from "~/components/Hero/AdminHero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

interface Option<V> {
  value: V;
  label: string;
}

type FormValues = Pick<SkillFamily, "description"> & {
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
};
interface CreateSkillFamilyFormProps {
  skills: Skill[];
  handleCreateSkillFamily: (
    data: CreateSkillFamilyInput,
  ) => Promise<CreateSkillFamilyMutation["createSkillFamily"]>;
}

export const CreateSkillFamilyForm = ({
  skills,
  handleCreateSkillFamily,
}: CreateSkillFamilyFormProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const navigate = useNavigate();
  const paths = useRoutes();
  const methods = useForm<FormValues>();
  const { handleSubmit } = methods;
  const sortedSkills = sortBy(skills, (skill) => {
    return skill.name?.[locale]?.toLocaleUpperCase();
  });

  const formValuesToSubmitData = (
    values: FormValues,
  ): CreateSkillFamilyInput => ({
    ...values,
    skills: {
      sync: values.skills,
    },
  });

  const { state } = useLocation();
  const navigateTo = state?.from ?? paths.skillFamilyTable();

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    return handleCreateSkillFamily(formValuesToSubmitData(data))
      .then(() => {
        navigate(navigateTo);
        toast.success(
          intl.formatMessage({
            defaultMessage: "Skill family created successfully!",
            id: "d8CQJr",
            description:
              "Message displayed to user after skill family is created successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: creating skill family failed",
            id: "rQ3Gbb",
            description:
              "Message displayed to user after skill family fails to get created.",
          }),
        );
      });
  };

  const skillOptions: Option<string>[] = sortedSkills.map(({ id, name }) => ({
    value: id,
    label: getLocalizedName(name, intl),
  }));

  return (
    <section data-h2-wrapper="base(left, s)">
      <Heading level="h1" size="h2">
        {intl.formatMessage({
          defaultMessage: "Create Skill Family",
          id: "5Al53V",
          description: "Title displayed on the create a skill family form.",
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
            <div data-h2-align-self="base(flex-start)">
              <Submit />
            </div>
          </form>
        </FormProvider>
      </div>
    </section>
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

const CreateSkillFamilyPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const [{ data: lookupData, fetching, error }] = useQuery({
    query: SkillFamilySkills_Query,
  });

  const [, executeMutation] = useMutation(CreateSkillFamily_Mutation);
  const handleCreateSkillFamily = (data: CreateSkillFamilyInput) =>
    executeMutation({ skillFamily: data }).then((result) => {
      if (result.data?.createSkillFamily) {
        return result.data?.createSkillFamily;
      }
      return Promise.reject(result.error);
    });

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(adminMessages.skillFamilies),
        url: routes.skillFamilyTable(),
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Create<hidden> skill family</hidden>",
          id: "PQXvrU",
          description:
            "Breadcrumb title for the create skill family page link.",
        }),
        url: routes.skillFamilyCreate(),
      },
    ],
    isAdmin: true,
  });

  const pageTitle = intl.formatMessage({
    defaultMessage: "Create skill family",
    id: "FCQnWB",
    description: "Page title for the skill family creation page",
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
          <CreateSkillFamilyForm
            handleCreateSkillFamily={handleCreateSkillFamily}
            skills={unpackMaybes(lookupData?.skills)}
          />
        </Pending>
      </AdminContentWrapper>
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
