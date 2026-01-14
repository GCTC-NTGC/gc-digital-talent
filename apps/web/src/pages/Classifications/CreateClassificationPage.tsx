import { useNavigate } from "react-router";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useMutation } from "urql";
import CloudIcon from "@heroicons/react/24/outline/CloudIcon";

import { Input, Select, Submit, SwitchInput } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import {
  commonMessages,
  errorMessages,
  uiMessages,
} from "@gc-digital-talent/i18n";
import { graphql, CreateClassificationInput } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { Card, CardSeparator, Heading, Link } from "@gc-digital-talent/ui";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import Hero from "~/components/Hero";

import messages from "./messages";
import { getClassificationLevels } from "./helpers";

type FormValues = CreateClassificationInput;

const CreateClassification_Mutation = graphql(/* GraphQL */ `
  mutation CreateClassification($classification: CreateClassificationInput!) {
    createClassification(classification: $classification) {
      id
    }
  }
`);

export const CreateClassification = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const [, executeMutation] = useMutation(CreateClassification_Mutation);
  const methods = useForm<FormValues>();
  const { handleSubmit, watch } = methods;
  const watchMinSalary = watch("minSalary");

  const pageTitle = intl.formatMessage({
    defaultMessage: "Create a classification",
    id: "9g11GN",
    description: "Page title for the classification creation page",
  });

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.classifications),
        url: paths.classificationTable(),
      },
      {
        label: pageTitle,
        url: paths.classificationCreate(),
      },
    ],
  });

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: creating classification failed",
        id: "5jFkhf",
        description:
          "Message displayed to user after classification fails to get created.",
      }),
    );
  };

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    const classification: CreateClassificationInput = {
      ...data,
      group: data.group.toUpperCase(),
      level: Number(data.level),
      minSalary: Number(data.minSalary),
      maxSalary: Number(data.maxSalary),
      displayName: {
        en: data.displayName?.en,
        fr: data.displayName?.fr,
      },
      isAvailableInSearch: data.isAvailableInSearch ?? false,
    };
    return executeMutation({ classification })
      .then(async (result) => {
        if (result.data?.createClassification) {
          await navigate(
            paths.classificationView(result.data.createClassification.id),
          );
          toast.success(
            intl.formatMessage({
              defaultMessage: "Classification created successfully!",
              id: "3D/wxC",
              description:
                "Message displayed to user after classification is created successfully.",
            }),
          );
        } else {
          handleError();
        }
      })
      .catch(handleError);
  };

  return (
    <>
      <SEO title={pageTitle} />
      <Hero title={pageTitle} crumbs={navigationCrumbs} overlap centered>
        <Card className="mb-18">
          <Heading
            level="h2"
            color="secondary"
            icon={CloudIcon}
            className="mt-0 xs:justify-start xs:text-left"
            center
          >
            {intl.formatMessage(messages.classificationInfo)}
          </Heading>
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
                <Input
                  id="group"
                  name="group"
                  label={intl.formatMessage(commonMessages.group)}
                  type="text"
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                />
                <Select
                  id="level"
                  name="level"
                  label={intl.formatMessage(messages.levelNumber)}
                  nullSelection={intl.formatMessage(
                    uiMessages.nullSelectionOptionLevel,
                  )}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  options={getClassificationLevels()}
                  doNotSort
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
                  min="0"
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
                  min="0"
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                    min: {
                      value: watchMinSalary ?? 0,
                      message: intl.formatMessage(errorMessages.mustBeGreater, {
                        value: watchMinSalary ?? 0,
                      }),
                    },
                  }}
                />
                <div className="xs:col-span-2">
                  <SwitchInput
                    id="isAvailableInSearch"
                    name="isAvailableInSearch"
                    color="secondary"
                    label={intl.formatMessage(commonMessages.onFindTalent)}
                  />
                </div>
                <Input
                  id="displayName_en"
                  name="displayName.en"
                  autoComplete="off"
                  label={intl.formatMessage(commonMessages.displayName)}
                  appendLanguageToLabel={"en"}
                  type="text"
                />
                <Input
                  id="displayName_fr"
                  name="displayName.fr"
                  autoComplete="off"
                  label={intl.formatMessage(commonMessages.displayName)}
                  appendLanguageToLabel={"fr"}
                  type="text"
                />
              </div>
              <CardSeparator />
              <div className="flex flex-col items-center gap-6 text-center xs:flex-row xs:text-left">
                <Submit
                  text={intl.formatMessage({
                    defaultMessage: "Create classification",
                    id: "ztzRUG",
                    description: "Button text to create a classification",
                  })}
                />
                <Link
                  color="warning"
                  mode="inline"
                  href={paths.classificationTable()}
                >
                  {intl.formatMessage({
                    defaultMessage: "Cancel and go back to classifications",
                    id: "om9QYn",
                    description: "Link text to return to classification table",
                  })}
                </Link>
              </div>
            </form>
          </FormProvider>
        </Card>
      </Hero>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <CreateClassification />
  </RequireAuth>
);

Component.displayName = "AdminCreateClassificationPage";

export default Component;
