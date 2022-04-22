import pick from "lodash/pick";
import upperCase from "lodash/upperCase";
import * as React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { Input, Select, Submit } from "@common/components/form";
import { navigate } from "@common/helpers/router";
import { errorMessages, commonMessages } from "@common/messages";
import { useAdminRoutes } from "../../adminRoutes";
import {
  Classification,
  UpdateClassificationInput,
  useGetClassificationQuery,
  useUpdateClassificationMutation,
} from "../../api/generated";
import { DashboardContentContainer } from "../DashboardContentContainer";

type FormValues = UpdateClassificationInput;
interface UpdateClassificationFormProps {
  initialClassification: Classification;
  handleUpdateClassification: (
    id: string,
    data: FormValues,
  ) => Promise<FormValues>;
}

export const UpdateClassificationForm: React.FunctionComponent<
  UpdateClassificationFormProps
> = ({ initialClassification, handleUpdateClassification }) => {
  const intl = useIntl();
  const paths = useAdminRoutes();
  const methods = useForm<FormValues>({
    defaultValues: initialClassification,
  });
  const { handleSubmit, watch } = methods;
  const watchMinSalary = watch("minSalary");

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    const classification: FormValues = {
      name: {
        en: data.name?.en,
        fr: data.name?.fr,
      },
      group: upperCase(data.group || ""),
      minSalary: Number(data.minSalary),
      maxSalary: Number(data.maxSalary),
    };
    return handleUpdateClassification(initialClassification.id, classification)
      .then(() => {
        navigate(paths.classificationTable());
        toast.success(
          intl.formatMessage({
            defaultMessage: "Classification updated successfully!",
            description:
              "Message displayed to user after classification is updated successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating classification failed",
            description:
              "Message displayed to user after classification fails to get updated.",
          }),
        );
      });
  };
  return (
    <section>
      <h2 data-h2-text-align="b(center)" data-h2-margin="b(top, none)">
        {intl.formatMessage({
          defaultMessage: "Update Classification",
          description: "Title displayed on the update a classification form.",
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
                description:
                  "Label displayed on the classification form level field.",
              })}
              nullSelection={intl.formatMessage({
                defaultMessage: "Select a level...",
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
              disabled
            />
            <Input
              id="minSalary"
              name="minSalary"
              label={intl.formatMessage({
                defaultMessage: "Minimum Salary",
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
            <Submit />
          </form>
        </FormProvider>
      </div>
    </section>
  );
};

export const UpdateClassification: React.FunctionComponent<{
  classificationId: string;
}> = ({ classificationId }) => {
  const intl = useIntl();
  const [{ data: classificationData, fetching, error }] =
    useGetClassificationQuery({
      variables: { id: classificationId },
    });

  const [, executeMutation] = useUpdateClassificationMutation();
  const handleUpdateClassification = (
    id: string,
    data: UpdateClassificationInput,
  ) =>
    /* We must pick only the fields belonging to UpdateClassificationInput, because its possible
       the data object contains other props at runtime, and this will cause the
       graphql operation to fail. */
    executeMutation({
      id,
      classification: pick(data, ["name", "group", "minSalary", "maxSalary"]),
    }).then((result) => {
      if (result.data?.updateClassification) {
        return result.data?.updateClassification;
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
  return classificationData?.classification ? (
    <DashboardContentContainer>
      <UpdateClassificationForm
        initialClassification={classificationData?.classification}
        handleUpdateClassification={handleUpdateClassification}
      />
    </DashboardContentContainer>
  ) : (
    <DashboardContentContainer>
      <p>
        {intl.formatMessage(
          {
            defaultMessage: "Classification {classificationId} not found.",
            description: "Message displayed for classification not found.",
          },
          { classificationId },
        )}
      </p>
    </DashboardContentContainer>
  );
};
