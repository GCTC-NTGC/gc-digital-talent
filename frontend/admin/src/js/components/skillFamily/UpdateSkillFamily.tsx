import React from "react";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import pick from "lodash/pick";
import sortBy from "lodash/sortBy";
import { toast } from "react-toastify";
import {
  Select,
  Submit,
  Input,
  MultiSelect,
  TextArea,
} from "@common/components/form";
import { notEmpty } from "@common/helpers/util";
import { navigate } from "@common/helpers/router";
import { getLocale } from "@common/helpers/localize";
import { unpackIds, enumToOptions } from "@common/helpers/formUtils";

import { errorMessages, commonMessages } from "@common/messages";
import { getSkillCategory } from "@common/constants/localizedConstants";
import { useAdminRoutes } from "../../adminRoutes";
import {
  Skill,
  SkillFamily,
  SkillCategory,
  UpdateSkillFamilyInput,
  UpdateSkillFamilyMutation,
  useUpdateSkillFamilyMutation,
  useGetUpdateSkillFamilyDataQuery,
} from "../../api/generated";
import DashboardContentContainer from "../DashboardContentContainer";

type Option<V> = { value: V; label: string };

type FormValues = Pick<SkillFamily, "name" | "description"> & {
  skills: string[];
};

interface UpdateSkillFamilyFormProps {
  initialSkillFamily: SkillFamily;
  skills: Skill[];
  handleUpdateSkillFamily: (
    id: string,
    data: UpdateSkillFamilyInput,
  ) => Promise<UpdateSkillFamilyMutation["updateSkillFamily"]>;
}

export const UpdateSkillFamilyForm: React.FunctionComponent<
  UpdateSkillFamilyFormProps
> = ({ initialSkillFamily, skills, handleUpdateSkillFamily }) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useAdminRoutes();
  const sortedSkills = sortBy(skills, (skill) => {
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

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    return handleUpdateSkillFamily(
      initialSkillFamily.id,
      formValuesToSubmitData(data),
    )
      .then(() => {
        navigate(paths.skillFamilyTable());
        toast.success(
          intl.formatMessage({
            defaultMessage: "Skill family updated successfully!",
            description:
              "Message displayed to user after skillFamily is updated successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating skill family failed",
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
    <section>
      <h2 data-h2-text-align="b(center)" data-h2-margin="b(top, none)">
        {intl.formatMessage({
          defaultMessage: "Update Skill Family",
          description: "Title displayed on the update a skillFamily form.",
        })}
      </h2>
      <div data-h2-container="b(center, s)">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
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

export const UpdateSkillFamily: React.FunctionComponent<{
  skillFamilyId: string;
}> = ({ skillFamilyId }) => {
  const intl = useIntl();
  const [{ data: lookupData, fetching, error }] =
    useGetUpdateSkillFamilyDataQuery({
      variables: { id: skillFamilyId },
    });
  const skills: Skill[] | [] = lookupData?.skills.filter(notEmpty) ?? [];

  const [, executeMutation] = useUpdateSkillFamilyMutation();
  const handleUpdateSkillFamily = (
    id: string,
    formData: UpdateSkillFamilyInput,
  ) =>
    /* We must pick only the fields belonging to UpdateSkillFamilyInput, because its possible
       the data object contains other props at runtime, and this will cause the
       graphql operation to fail. */
    executeMutation({
      id,
      skillFamily: pick(formData, [
        "category",
        "description",
        "name",
        "skills",
      ]),
    }).then((result) => {
      if (result.data?.updateSkillFamily) {
        return result.data?.updateSkillFamily;
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

  return lookupData?.skillFamily ? (
    <DashboardContentContainer>
      <UpdateSkillFamilyForm
        initialSkillFamily={lookupData?.skillFamily}
        skills={skills}
        handleUpdateSkillFamily={handleUpdateSkillFamily}
      />
    </DashboardContentContainer>
  ) : (
    <DashboardContentContainer>
      <p>
        {intl.formatMessage(
          {
            defaultMessage: "SkillFamily {skillFamilyId} not found.",
            description: "Message displayed for skillFamily not found.",
          },
          { skillFamilyId },
        )}
      </p>
    </DashboardContentContainer>
  );
};

export default UpdateSkillFamily;
