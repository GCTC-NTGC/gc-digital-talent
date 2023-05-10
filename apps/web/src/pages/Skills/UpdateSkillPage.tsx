import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import pick from "lodash/pick";
import sortBy from "lodash/sortBy";

import { toast } from "@gc-digital-talent/toast";
import {
  Submit,
  Input,
  TextArea,
  unpackIds,
  MultiSelectField,
} from "@gc-digital-talent/forms";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  getLocale,
  errorMessages,
  commonMessages,
} from "@gc-digital-talent/i18n";
import { Pending, NotFound, Heading } from "@gc-digital-talent/ui";

import SEO from "~/components/SEO/SEO";
import {
  Skill,
  SkillFamily,
  UpdateSkillInput,
  UpdateSkillMutation,
  useUpdateSkillMutation,
  useGetUpdateSkillDataQuery,
  Scalars,
} from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import adminMessages from "~/messages/adminMessages";

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

export const UpdateSkillForm = ({
  initialSkill,
  families,
  handleUpdateSkill,
}: UpdateSkillFormProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const navigate = useNavigate();
  const paths = useRoutes();
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
      <Heading level="h1" size="h2">
        {intl.formatMessage({
          defaultMessage: "Update Skill",
          id: "WoAuKA",
          description: "Title displayed on the update a skill form.",
        })}
      </Heading>
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
            <div data-h2-margin="base(x1, 0)">
              <MultiSelectField
                id="families"
                name="families"
                label={intl.formatMessage({
                  defaultMessage: "Families",
                  id: "JxVREd",
                  description:
                    "Label displayed on the skill form families field.",
                })}
                placeholder={intl.formatMessage({
                  defaultMessage: "Select one or more families",
                  id: "wORNl0",
                  description:
                    "Placeholder displayed on the skill form families field.",
                })}
                options={skillFamilyOptions}
              />
            </div>
            <Submit />
          </form>
        </FormProvider>
      </div>
    </section>
  );
};

type RouteParams = {
  skillId: Scalars["ID"];
};

export const UpdateSkill = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const { skillId } = useParams<RouteParams>();
  const [{ data: lookupData, fetching, error }] = useGetUpdateSkillDataQuery({
    variables: { id: skillId || "" },
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
      label: intl.formatMessage(adminMessages.skills),
      url: routes.skillTable(),
    },
    ...(skillId
      ? [
          {
            label: intl.formatMessage({
              defaultMessage: "Edit<hidden> skill</hidden>",
              id: "M2LfhH",
              description: "Breadcrumb title for the edit skill page link.",
            }),
            url: routes.skillFamilyUpdate(skillId),
          },
        ]
      : []),
  ];

  return (
    <AdminContentWrapper crumbs={navigationCrumbs}>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Edit skill",
          id: "0VlOQq",
          description: "Page title for the edit skill page.",
        })}
      />
      <Pending fetching={fetching} error={error}>
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
      </Pending>
    </AdminContentWrapper>
  );
};

export default UpdateSkill;
