import React from "react";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import sortBy from "lodash/sortBy";
import { toast } from "react-toastify";
import {
  Input,
  Select,
  TextArea,
  Submit,
  MultiSelect,
} from "@common/components/form";
import { getLocale } from "@common/helpers/localize";
import { notEmpty } from "@common/helpers/util";
import { navigate } from "@common/helpers/router";
import { enumToOptions } from "@common/helpers/formUtils";
import { errorMessages, commonMessages } from "@common/messages";
import { getSkillCategory } from "@common/constants/localizedConstants";
import { useAdminRoutes } from "../../adminRoutes";
import {
  Skill,
  SkillFamily,
  SkillCategory,
  CreateSkillFamilyInput,
  CreateSkillFamilyMutation,
  useCreateSkillFamilyMutation,
  useGetCreateSkillFamilyDataQuery,
} from "../../api/generated";
import DashboardContentContainer from "../DashboardContentContainer";

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
  category: SkillCategory;
  skills: string[] | undefined;
};
interface CreateSkillFamilyFormProps {
  skills: Skill[];
  handleCreateSkillFamily: (
    data: CreateSkillFamilyInput,
  ) => Promise<CreateSkillFamilyMutation["createSkillFamily"]>;
}

export const CreateSkillFamilyForm: React.FunctionComponent<
  CreateSkillFamilyFormProps
> = ({ skills, handleCreateSkillFamily }) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useAdminRoutes();
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

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    return handleCreateSkillFamily(formValuesToSubmitData(data))
      .then(() => {
        navigate(paths.skillFamilyTable());
        toast.success(
          intl.formatMessage({
            defaultMessage: "Skill family created successfully!",
            description:
              "Message displayed to user after skill family is created successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: creating skill family failed",
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
    <section>
      <h2 data-h2-text-align="b(center)" data-h2-margin="b(top, none)">
        {intl.formatMessage({
          defaultMessage: "Create Skill Family",
          description: "Title displayed on the create a skill family form.",
        })}
      </h2>
      <div data-h2-container="b(center, s)">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="key"
              name="key"
              label={intl.formatMessage({
                defaultMessage: "Key",
                description:
                  "Label displayed on the create a skill family form key field.",
              })}
              context={intl.formatMessage({
                defaultMessage:
                  "The 'key' is a string that uniquely identifies a skill family. It should be based on the skill families English name, and it should be concise. A good example would be \"information_management\". It may be used in the code to refer to this particular skill family, so it cannot be changed later.",
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
                  }),
                },
              }}
            />
            <Input
              id="name_en"
              name="name.en"
              label={intl.formatMessage({
                defaultMessage: "Name (English)",
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
                description:
                  "Label displayed on the create a skill family form description (French) field.",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Select
              id="category"
              name="category"
              label={intl.formatMessage({
                defaultMessage: "Category",
                description:
                  "Label displayed on the skill family form category field.",
              })}
              nullSelection={intl.formatMessage({
                defaultMessage: "Select a category...",
                description:
                  "Placeholder displayed on the skill family form category field.",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              options={enumToOptions(SkillCategory).map(({ value }) => ({
                value,
                label: intl.formatMessage(getSkillCategory(value)),
              }))}
            />
            <MultiSelect
              id="skills"
              name="skills"
              label={intl.formatMessage({
                defaultMessage: "Skills",
                description:
                  "Label displayed on the skill family form skills field.",
              })}
              placeholder={intl.formatMessage({
                defaultMessage: "Select one or more skills...",
                description:
                  "Placeholder displayed on the skill family form skills field.",
              })}
              options={skillOptions}
            />
            <Submit />
          </form>
        </FormProvider>
      </div>
    </section>
  );
};

export const CreateSkillFamily: React.FunctionComponent = () => {
  const intl = useIntl();
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

  if (fetching)
    return (
      <DashboardContentContainer>
        <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>
      </DashboardContentContainer>
    );
  if (error)
    return (
      <DashboardContentContainer>
        <p>
          {intl.formatMessage(commonMessages.loadingError)}
          {error.message}
        </p>
      </DashboardContentContainer>
    );

  return (
    <DashboardContentContainer>
      <CreateSkillFamilyForm
        handleCreateSkillFamily={handleCreateSkillFamily}
        skills={skills}
      />
    </DashboardContentContainer>
  );
};
