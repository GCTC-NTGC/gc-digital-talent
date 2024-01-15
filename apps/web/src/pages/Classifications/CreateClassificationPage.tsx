import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import upperCase from "lodash/upperCase";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { Input, Select, Submit } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import { errorMessages } from "@gc-digital-talent/i18n";

import SEO from "~/components/SEO/SEO";
import {
  CreateClassificationInput,
  useCreateClassificationMutation,
} from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import { pageTitle as indexClassificationPageTitle } from "~/pages/Classifications/IndexClassificationPage";
import AdminHero from "~/components/Hero/AdminHero";

type FormValues = CreateClassificationInput;
interface CreateClassificationFormProps {
  handleCreateClassification: (data: FormValues) => Promise<FormValues>;
}

export const CreateClassificationForm = ({
  handleCreateClassification,
}: CreateClassificationFormProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const methods = useForm<FormValues>();
  const { handleSubmit, watch } = methods;
  const watchMinSalary = watch("minSalary");

  const { state } = useLocation();
  const navigateTo = state?.from ?? paths.classificationTable();

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    const classification: FormValues = {
      ...data,
      group: upperCase(data.group),
      level: Number(data.level),
      minSalary: Number(data.minSalary),
      maxSalary: Number(data.maxSalary),
    };
    return handleCreateClassification(classification)
      .then(() => {
        navigate(navigateTo);
        toast.success(
          intl.formatMessage({
            defaultMessage: "Classification created successfully!",
            id: "3D/wxC",
            description:
              "Message displayed to user after classification is created successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: creating classification failed",
            id: "5jFkhf",
            description:
              "Message displayed to user after classification fails to get created.",
          }),
        );
      });
  };
  return (
    <section data-h2-container="base(left, s)">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x.5 0)"
        >
          <Input
            id="name_en"
            name="name.en"
            label={intl.formatMessage({
              defaultMessage: "Name (English)",
              id: "7wYPgC",
              description:
                "Label displayed on the classification form name (English) field.",
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
              id: "uAmdiU",
              description:
                "Label displayed on the classification form name (French) field.",
            })}
            type="text"
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
          <Input
            id="group"
            name="group"
            label={intl.formatMessage({
              defaultMessage: "Group",
              id: "hgxH8y",
              description:
                "Label displayed for the classification form group field.",
            })}
            type="text"
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
          <Select
            id="level"
            name="level"
            label={intl.formatMessage({
              defaultMessage: "Level",
              id: "bVRixs",
              description:
                "Label displayed on the classification form level field.",
            })}
            nullSelection={intl.formatMessage({
              defaultMessage: "Select a level",
              id: "Le4EQq",
              description:
                "Placeholder displayed on the classification form level field.",
            })}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            options={[
              { value: 1, label: "1" },
              { value: 2, label: "2" },
              { value: 3, label: "3" },
              { value: 4, label: "4" },
              { value: 5, label: "5" },
              { value: 6, label: "6" },
              { value: 7, label: "7" },
              { value: 8, label: "8" },
              { value: 9, label: "9" },
            ]}
          />
          <Input
            id="minSalary"
            name="minSalary"
            label={intl.formatMessage({
              defaultMessage: "Minimum Salary",
              id: "3b6cy/",
              description:
                "Label displayed for the classification form min salary field.",
            })}
            type="number"
            rules={{
              required: intl.formatMessage(errorMessages.required),
              min: {
                value: 0,
                message: intl.formatMessage(errorMessages.mustBeGreater, {
                  value: 0,
                }),
              },
            }}
          />
          <Input
            id="maxSalary"
            name="maxSalary"
            label={intl.formatMessage({
              defaultMessage: "Maximum Salary",
              id: "gpKGjq",
              description:
                "Label displayed for the classification form max salary field.",
            })}
            type="number"
            rules={{
              required: intl.formatMessage(errorMessages.required),
              min: {
                value: watchMinSalary || 0,
                message: intl.formatMessage(errorMessages.mustBeGreater, {
                  value: watchMinSalary || 0,
                }),
              },
            }}
          />
          <div data-h2-align-self="base(flex-start)">
            <Submit />
          </div>
        </form>
      </FormProvider>
    </section>
  );
};

const CreateClassification = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const [, executeMutation] = useCreateClassificationMutation();
  const handleCreateClassification = (data: CreateClassificationInput) =>
    executeMutation({ classification: data }).then((result) => {
      if (result.data?.createClassification) {
        return result.data?.createClassification;
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
      label: intl.formatMessage(indexClassificationPageTitle),
      url: routes.classificationTable(),
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Create<hidden> classification</hidden>",
        id: "E8BMJW",
        description:
          "Breadcrumb title for the create classification page link.",
      }),
      url: routes.classificationCreate(),
    },
  ];

  const pageTitle = intl.formatMessage({
    defaultMessage: "Create classification",
    id: "fYyK2p",
    description: "Page title for the classification creation page",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <AdminHero
        title={pageTitle}
        nav={{ mode: "crumbs", items: navigationCrumbs }}
      />
      <AdminContentWrapper>
        <CreateClassificationForm
          handleCreateClassification={handleCreateClassification}
        />
      </AdminContentWrapper>
    </>
  );
};

export default CreateClassification;
