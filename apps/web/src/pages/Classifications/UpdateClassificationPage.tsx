import { useNavigate } from "react-router";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";

import {
  Pending,
  NotFound,
  Card,
  Heading,
  Link,
  CardSeparator,
} from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { Input, Select, Submit, SwitchInput } from "@gc-digital-talent/forms";
import {
  errorMessages,
  commonMessages,
  uiMessages,
  formMessages,
} from "@gc-digital-talent/i18n";
import {
  graphql,
  UpdateClassificationInput,
  FragmentType,
  getFragment,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import { getClassificationName } from "~/utils/poolUtils";
import Hero from "~/components/Hero";

import messages from "./messages";
import { getClassificationLevels } from "./helpers";
import type { Route } from "./+types/UpdateClassificationPage";

export const ClassificationForm_Fragment = graphql(/* GraphQL */ `
  fragment ClassificationForm on Classification {
    id
    name {
      en
      fr
    }
    group
    level
    minSalary
    maxSalary
    displayName {
      en
      fr
    }
    isAvailableInSearch
  }
`);

const UpdateClassification_Mutation = graphql(/* GraphQL */ `
  mutation UpdateClassification(
    $id: ID!
    $classification: UpdateClassificationInput!
  ) {
    updateClassification(id: $id, classification: $classification) {
      id
      level
      group
    }
  }
`);

type FormValues = UpdateClassificationInput;
interface UpdateClassificationFormProps {
  query: FragmentType<typeof ClassificationForm_Fragment>;
}

export const UpdateClassificationForm = ({
  query,
}: UpdateClassificationFormProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const classification = getFragment(ClassificationForm_Fragment, query);
  const methods = useForm<FormValues>({
    defaultValues: classification,
  });
  const { handleSubmit, watch } = methods;
  const watchMinSalary = watch("minSalary");

  const pageTitle = intl.formatMessage(pageTitles.classifications);

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.classifications),
        url: paths.classificationTable(),
      },
      {
        label: getClassificationName(classification, intl),
        url: paths.classificationView(classification.id),
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Edit<hidden> classification</hidden>",
          id: "ow4z7W",
          description:
            "Breadcrumb title for the edit classification page link.",
        }),
        url: paths.classificationUpdate(classification.id),
      },
    ],
  });

  const [, executeMutation] = useMutation(UpdateClassification_Mutation);
  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: updating classification failed",
        id: "LEVK8x",
        description:
          "Message displayed to user after classification fails to get updated.",
      }),
    );
  };

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    const input: UpdateClassificationInput = {
      name: {
        en: data.name?.en,
        fr: data.name?.fr,
      },
      group: data.group?.toUpperCase(),
      minSalary: Number(data.minSalary),
      maxSalary: Number(data.maxSalary),
      displayName: {
        en: data.displayName?.en,
        fr: data.displayName?.fr,
      },
      isAvailableInSearch: data.isAvailableInSearch ?? false,
    };
    return executeMutation({
      id: classification.id,
      classification: input,
    })
      .then(async (result) => {
        if (result.data?.updateClassification) {
          await navigate(paths.classificationView(classification.id));
          toast.success(
            intl.formatMessage({
              defaultMessage: "Classification updated successfully!",
              id: "jJCDGc",
              description:
                "Message displayed to user after classification is updated successfully.",
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
      <Hero
        title={intl.formatMessage({
          defaultMessage: "Edit a classification",
          id: "XPJs0+",
          description: "Page title for editing a classification",
        })}
        overlap
        centered
        crumbs={navigationCrumbs}
      >
        <Card className="mb-18">
          <Heading
            level="h2"
            color="secondary"
            icon={IdentificationIcon}
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
                  disabled
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
                <Submit text={intl.formatMessage(formMessages.saveChanges)} />
                <Link
                  color="warning"
                  mode="inline"
                  href={paths.classificationView(classification.id)}
                >
                  {intl.formatMessage(commonMessages.cancel)}
                </Link>
              </div>
            </form>
          </FormProvider>
        </Card>
      </Hero>
    </>
  );
};

const Classification_Query = graphql(/* GraphQL */ `
  query Classification($id: UUID!) {
    classification(id: $id) {
      ...ClassificationForm
    }
  }
`);

interface UpdateClassificationProps {
  id: string;
}

const UpdateClassification = ({ id }: UpdateClassificationProps) => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useQuery({
    query: Classification_Query,
    variables: { id },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.classification ? (
        <UpdateClassificationForm query={data?.classification} />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>
            {intl.formatMessage(
              {
                defaultMessage: "Classification {classificationId} not found.",
                id: "b3VnhM",
                description: "Message displayed for classification not found.",
              },
              { classificationId: id },
            )}
          </p>
        </NotFound>
      )}
    </Pending>
  );
};

export function clientLoader({ params }: Route.ClientLoaderArgs) {
  return { id: params.classificationId };
}

export function Component({ loaderData }: Route.ComponentProps) {
  return (
    <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
      <UpdateClassification id={loaderData.id} />
    </RequireAuth>
  );
}

Component.displayName = "AdminUpdateClassificationPage";

export default Component;
