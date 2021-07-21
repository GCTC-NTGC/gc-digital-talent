import { pick, upperCase } from "lodash";
import * as React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  Classification,
  UpdateClassificationInput,
  useGetClassificationQuery,
  useUpdateClassificationMutation,
} from "../../api/generated";
import errorMessages from "../form/errorMessages";
import Input from "../form/Input";
import Submit from "../form/Submit";

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
    const methods = useForm<FormValues>({
      defaultValues: initialClassification,
    });
    const { handleSubmit, watch, reset } = methods;
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
        .then(reset) // Reset form with returned data. This resets isDirty flag.
        .catch(() => {
          // Something went wrong with handleUpdateClassification.
          // Do nothing.
        });
    };
    return (
      <section>
        <h2>Update Classification</h2>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="name_en"
              name="name.en"
              label="Name: "
              type="text"
              rules={{ required: errorMessages.required }}
            />
            <Input
              id="name_fr"
              name="name.fr"
              label="Name FR: "
              type="text"
              rules={{ required: errorMessages.required }}
            />
            <Input
              id="group"
              name="group"
              label="Group: "
              type="text"
              rules={{ required: errorMessages.required }}
            />
            <Input
              id="level"
              name="level"
              label="Level: "
              type="number"
              rules={{ required: errorMessages.required }}
              disabled
            />
            <Input
              id="minSalary"
              name="minSalary"
              label="Minimum Salary: "
              type="number"
              rules={{
                required: errorMessages.required,
                min: { value: 0, message: `${errorMessages.mustBeGreater} 0` },
              }}
            />
            <Input
              id="maxSalary"
              name="maxSalary"
              label="Maximum Salary: "
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
    <p>{`Classification ${classificationId} not found.`}</p>
  );
};
