import React from "react";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import pick from "lodash/pick";
import sortBy from "lodash/sortBy";
import { toast } from "react-toastify";
import { Submit, Input, MultiSelect, TextArea } from "@common/components/form";
import { notEmpty } from "@common/helpers/util";
import { navigate } from "@common/helpers/router";
import { getLocale } from "@common/helpers/localize";
import { unpackIds } from "@common/helpers/formUtils";
import { errorMessages, commonMessages } from "@common/messages";
import Pending from "@common/components/Pending";
import NotFound from "@common/components/NotFound";
import { useAdminRoutes } from "../../adminRoutes";
import {
  Skill,
  SkillFamily,
  UpdateSkillInput,
  UpdateSkillMutation,
  useUpdateSkillMutation,
  useGetUpdateSkillDataQuery,
} from "../../api/generated";
import DashboardContentContainer from "../DashboardContentContainer";

type Option<V> = { value: V; label: string };

type FormValues = Pick<Skill, "name" | "description"> & {
  families: string[];
  keywords: {
    en: string;
    fr: string;
  };
};

interface UpdateSkillFormProps {
  initialSkill: Skill;
  families: SkillFamily[];
  handleUpdateSkill: (
    id: string,
    data: UpdateSkillInput,
  ) => Promise<UpdateSkillMutation["updateSkill"]>;
}

export const UpdateSkillForm: React.FunctionComponent<UpdateSkillFormProps> = ({
  initialSkill,
  families,
  handleUpdateSkill,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useAdminRoutes();
  const sortedFamilies = sortBy(families, (family) => {
    return family.name?.[locale]?.toLocaleUpperCase();
  });

  const dataToFormValues = (data: Skill): FormValues => ({
    ...data,
    keywords: {
      en: data.keywords?.en?.join(", ") || "",
      fr: data.keywords?.fr?.join(", ") || "",
    },
    families: unpackIds(data?.families),
  });

  const formValuesToSubmitData = (values: FormValues): UpdateSkillInput => ({
    ...values,
    keywords: {
      en: values.keywords.en
        .split(",")
        .map((key) => key.trim())
        .filter((key) => key !== ""),
      fr: values.keywords.fr
        .split(",")
        .map((key) => key.trim())
        .filter((key) => key !== ""),
    },
    families: {
      sync: values.families,
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
    defaultValues: dataToFormValues(initialSkill),
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    return handleUpdateSkill(initialSkill.id, formValuesToSubmitData(data))
      .then(() => {
        navigate(paths.skillTable());
        toast.success(
          intl.formatMessage({
            defaultMessage: "Skill updated successfully!",
            id: "UTFKyy",
            description:
              "Message displayed to user after skill is updated successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating skill failed",
            id: "eSyXWT",
            description:
              "Message displayed to user after skill fails to get updated.",
          }),
        );
      });
  };

  const skillFamilyOptions: Option<string>[] = sortedFamilies.map(
    ({ id, name }) => ({
      value: id,
      label: name?.[locale] || "",
    }),
  );

  return (
    <section data-h2-container="base(left, s)">
      <h2 data-h2-font-weight="base(700)" data-h2-padding="base(x2, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage: "Update Skill",
          id: "WoAuKA",
          description: "Title displayed on the update a skill form.",
        })}
      </h2>
      <div>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="name_en"
              name="name.en"
              label={intl.formatMessage({
                defaultMessage: "Name (English)",
                id: "5F/aKm",
                description:
                  "Label displayed on the update a skill form name (English) field.",
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
                id: "j01W+1",
                description:
                  "Label displayed on the update a skill form name (French) field.",
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
                id: "fdKtYm",
                description:
                  "Label displayed on the update a skill form description (English) field.",
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
                id: "4EkI/1",
                description:
                  "Label displayed on the update a skill form description (French) field.",
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
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
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
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <MultiSelect
              id="families"
              name="families"
              label={intl.formatMessage({
                defaultMessage: "Families",
                id: "JxVREd",
                description:
                  "Label displayed on the skill form families field.",
              })}
              placeholder={intl.formatMessage({
                defaultMessage: "Select one or more families...",
                id: "9bz9jA",
                description:
                  "Placeholder displayed on the skill form families field.",
              })}
              options={skillFamilyOptions}
            />
            <Submit />
          </form>
        </FormProvider>
      </div>
    </section>
  );
};

export const UpdateSkill: React.FunctionComponent<{
  skillId: string;
}> = ({ skillId }) => {
  const intl = useIntl();
  const [{ data: lookupData, fetching, error }] = useGetUpdateSkillDataQuery({
    variables: { id: skillId },
  });
  const families: SkillFamily[] | [] =
    lookupData?.skillFamilies.filter(notEmpty) ?? [];

  const [, executeMutation] = useUpdateSkillMutation();
  const handleUpdateSkill = (id: string, formData: UpdateSkillInput) =>
    /* We must pick only the fields belonging to UpdateSkillFamilyInput, because its possible
       the data object contains other props at runtime, and this will cause the
       graphql operation to fail. */
    executeMutation({
      id,
      skill: pick(formData, ["name", "description", "keywords", "families"]),
    }).then((result) => {
      if (result.data?.updateSkill) {
        return result.data?.updateSkill;
      }
      return Promise.reject(result.error);
    });

  return (
    <Pending fetching={fetching} error={error}>
      <DashboardContentContainer>
        {lookupData?.skill ? (
          <UpdateSkillForm
            initialSkill={lookupData?.skill}
            families={families}
            handleUpdateSkill={handleUpdateSkill}
          />
        ) : (
          <NotFound
            headingMessage={intl.formatMessage(commonMessages.notFound)}
          >
            <p>
              {intl.formatMessage(
                {
                  defaultMessage: "Skill {skillId} not found.",
                  id: "953EAy",
                  description: "Message displayed for skill not found.",
                },
                { skillId },
              )}
            </p>
          </NotFound>
        )}
      </DashboardContentContainer>
    </Pending>
  );
};

export default UpdateSkill;
