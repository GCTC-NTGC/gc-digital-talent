import React from "react";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import sortBy from "lodash/sortBy";
import { toast } from "react-toastify";
import { Input, TextArea, Submit, MultiSelect } from "@common/components/form";
import { getLocale } from "@common/helpers/localize";
import { notEmpty } from "@common/helpers/util";
import { navigate } from "@common/helpers/router";
import { keyStringRegex } from "@common/constants/regularExpressions";
import { errorMessages } from "@common/messages";
import Pending from "@common/components/Pending";
import { useAdminRoutes } from "../../adminRoutes";
import {
  Skill,
  SkillFamily,
  CreateSkillInput,
  CreateSkillMutation,
  useCreateSkillMutation,
  useAllSkillFamiliesQuery,
} from "../../api/generated";
import DashboardContentContainer from "../DashboardContentContainer";

type Option<V> = { value: V; label: string };

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
  families: string[] | undefined;
};
interface CreateSkillFormProps {
  families: SkillFamily[];
  handleCreateSkill: (
    data: CreateSkillInput,
  ) => Promise<CreateSkillMutation["createSkill"]>;
}

export const CreateSkillForm: React.FunctionComponent<CreateSkillFormProps> = ({
  families,
  handleCreateSkill,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useAdminRoutes();
  const methods = useForm<FormValues>();
  const { handleSubmit } = methods;
  const sortedFamilies = sortBy(families, (family) => {
    return family.name?.[locale]?.toLocaleUpperCase();
  });

  const formValuesToSubmitData = (values: FormValues): CreateSkillInput => ({
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
  });

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    return handleCreateSkill(formValuesToSubmitData(data))
      .then(() => {
        navigate(paths.skillTable());
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
      label: name?.[locale] || "",
    }),
  );

  return (
    <section data-h2-container="base(left, s)">
      <h2 data-h2-font-weight="base(700)" data-h2-padding="base(x2, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage: "Create Skill",
          id: "qZd17O",
          description: "Title displayed on the create a skill form.",
        })}
      </h2>
      <div>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="key"
              name="key"
              label={intl.formatMessage({
                defaultMessage: "Key",
                id: "3exDkT",
                description:
                  "Label displayed on the create a skill form key field.",
              })}
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
                    id: "aPqZsz",
                  }),
                },
              }}
            />
            <Input
              id="name_en"
              name="name.en"
              label={intl.formatMessage({
                defaultMessage: "Name (English)",
                id: "gnu0Eb",
                description:
                  "Label displayed on the create a skill form name (English) field.",
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
                id: "ZU3fd5",
                description:
                  "Label displayed on the create a skill form name (French) field.",
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
                id: "xx8yaE",
                description:
                  "Label displayed on the skill form skill families field.",
              })}
              placeholder={intl.formatMessage({
                defaultMessage: "Select one or more skill families...",
                id: "brucUP",
                description:
                  "Placeholder displayed on the skill form skill families field.",
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

const CreateSkill: React.FunctionComponent = () => {
  const [lookupResult] = useAllSkillFamiliesQuery();
  const { data: lookupData, fetching, error } = lookupResult;
  const families = lookupData?.skillFamilies.filter(notEmpty) ?? [];

  const [, executeMutation] = useCreateSkillMutation();
  const handleCreateSkill = (data: CreateSkillInput) =>
    executeMutation({ skill: data }).then((result) => {
      if (result.data?.createSkill) {
        return result.data?.createSkill;
      }
      return Promise.reject(result.error);
    });

  return (
    <Pending fetching={fetching} error={error}>
      <DashboardContentContainer>
        <CreateSkillForm
          handleCreateSkill={handleCreateSkill}
          families={families}
        />
      </DashboardContentContainer>
    </Pending>
  );
};

export default CreateSkill;
