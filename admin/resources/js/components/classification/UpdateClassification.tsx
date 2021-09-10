import { pick, upperCase } from "lodash";
import * as React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { Input, Select, Submit } from "gc-digital-talent-common/components";
import {
  navigate,
  classificationTablePath,
} from "gc-digital-talent-common/helpers";
import { errorMessages } from "gc-digital-talent-common/messages";
import {
  Classification,
  UpdateClassificationInput,
  useGetClassificationQuery,
  useUpdateClassificationMutation,
} from "../../api/generated";
import messages from "./messages";

type FormValues = UpdateClassificationInput;
interface UpdateClassificationFormProps {
  initialClassification: Classification;
  handleUpdateClassification: (
    id: string,
    data: FormValues,
  ) => Promise<FormValues>;
}

export const UpdateClassificationForm: React.FunctionComponent<UpdateClassificationFormProps> =
  ({ initialClassification, handleUpdateClassification }) => {
    const intl = useIntl();
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
      return handleUpdateClassification(
        initialClassification.id,
        classification,
      )
        .then(() => {
          navigate(classificationTablePath());
          toast.success(intl.formatMessage(messages.updateSuccess));
        })
        .catch(() => {
          toast.error(intl.formatMessage(messages.updateError));
        });
    };
    return (
      <section>
        <h2>{intl.formatMessage(messages.updateHeading)}</h2>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="name_en"
              name="name.en"
              label={intl.formatMessage(messages.nameEnLabel)}
              type="text"
              rules={{ required: errorMessages.required }}
            />
            <Input
              id="name_fr"
              name="name.fr"
              label={intl.formatMessage(messages.nameFrLabel)}
              type="text"
              rules={{ required: errorMessages.required }}
            />
            <Input
              id="group"
              name="group"
              label={intl.formatMessage(messages.groupLabel)}
              type="text"
              rules={{ required: errorMessages.required }}
            />
            <Select
              id="level"
              name="level"
              label={intl.formatMessage(messages.levelLabel)}
              nullSelection={intl.formatMessage(messages.levelPlaceholder)}
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
              label={intl.formatMessage(messages.minSalaryLabel)}
              type="number"
              rules={{
                required: errorMessages.required,
                min: { value: 0, message: `${errorMessages.mustBeGreater} 0` },
              }}
            />
            <Input
              id="maxSalary"
              name="maxSalary"
              label={intl.formatMessage(messages.maxSalaryLabel)}
              type="number"
              rules={{
                required: errorMessages.required,
                min: {
                  value: watchMinSalary || 0,
                  message: `${errorMessages.mustBeGreater} ${
                    watchMinSalary || 0
                  }`,
                },
              }}
            />
            <Submit />
          </form>
        </FormProvider>
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

  const [_result, executeMutation] = useUpdateClassificationMutation();
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

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;
  return classificationData?.classification ? (
    <UpdateClassificationForm
      initialClassification={classificationData?.classification}
      handleUpdateClassification={handleUpdateClassification}
    />
  ) : (
    <p>{intl.formatMessage(messages.notFound, { classificationId })}</p>
  );
};
