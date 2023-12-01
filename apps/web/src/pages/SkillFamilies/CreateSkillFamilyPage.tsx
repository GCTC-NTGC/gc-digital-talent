import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import sortBy from "lodash/sortBy";

import { toast } from "@gc-digital-talent/toast";
import {
  Input,
  TextArea,
  Submit,
  MultiSelectField,
} from "@gc-digital-talent/forms";
import { getLocale, errorMessages } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";
import { Pending, Heading } from "@gc-digital-talent/ui";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import {
  Skill,
  SkillFamily,
  CreateSkillFamilyInput,
  CreateSkillFamilyMutation,
  useCreateSkillFamilyMutation,
  useGetCreateSkillFamilyDataQuery,
} from "~/api/generated";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import adminMessages from "~/messages/adminMessages";

type Option<V> = { value: V; label: string };

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
    label: name?.[locale] || "",
  }));

  return (
    <section data-h2-container="base(left, s)">
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
              label={intl.formatMessage({
                defaultMessage: "Key",
                id: "CvV2l6",
                description: "Label for an entity 'key' field",
              })}
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
              label={intl.formatMessage({
                defaultMessage: "Name (English)",
                id: "2wo24b",
                description:
                  "Label displayed on the create a skill family form name (English) field.",
              })}
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Input
              id="name_fr"
              name="name.fr"
              label={intl.formatMessage({
                defaultMessage: "Name (French)",
                id: "0oqRIl",
                description:
                  "Label displayed on the create a skill family form name (French) field.",
              })}
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
            <MultiSelectField
              id="skills"
              name="skills"
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

const CreateSkillFamilyPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const [lookupResult] = useGetCreateSkillFamilyDataQuery();
  const { data: lookupData, fetching, error } = lookupResult;
  const skills = lookupData?.skills.filter(notEmpty) ?? [];

  const [, executeMutation] = useCreateSkillFamilyMutation();
  const handleCreateSkillFamily = (data: CreateSkillFamilyInput) =>
    executeMutation({ skillFamily: data }).then((result) => {
      if (result.data?.createSkillFamily) {
        return result.data?.createSkillFamily;
      }
      return Promise.reject(result.error);
    });

  const navigationCrumbs = [
    {
      label: intl.formatMessage({
        defaultMessage: "Home",
        id: "EBmWyo",
        description: "Link text for the home link in breadcrumbs.",
      }),
      url: routes.adminDashboard(),
    },
    {
      label: intl.formatMessage(adminMessages.skillFamilies),
      url: routes.skillFamilyTable(),
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Create<hidden> skill family</hidden>",
        id: "PQXvrU",
        description: "Breadcrumb title for the create skill family page link.",
      }),
      url: routes.skillFamilyCreate(),
    },
  ];

  return (
    <AdminContentWrapper crumbs={navigationCrumbs}>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Create skill family",
          id: "FCQnWB",
          description: "Page title for the skill family creation page",
        })}
      />
      <Pending fetching={fetching} error={error}>
        <CreateSkillFamilyForm
          handleCreateSkillFamily={handleCreateSkillFamily}
          skills={skills}
        />
      </Pending>
    </AdminContentWrapper>
  );
};

export default CreateSkillFamilyPage;
