import { Input, Select, Submit, TextArea } from "@common/components/form";
import * as React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { fakePoolCandidateFilters } from "@common/fakeData";
import { useIntl } from "react-intl";
import { commonMessages, errorMessages } from "@common/messages";
import { getLocale } from "@common/helpers/localize";
import { Button } from "@common/components";
import { notEmpty } from "@common/helpers/util";
import { toast } from "react-toastify";
import { navigate } from "@common/helpers/router";
import { searchPath } from "../../talentSearchRoutes";
import {
  Department,
  PoolCandidateFilter,
  LanguageAbility,
  CreatePoolCandidateSearchRequestInput,
  useGetPoolCandidateSearchRequestDataQuery,
  useCreatePoolCandidateSearchRequestMutation,
  CreatePoolCandidateSearchRequestMutation,
} from "../../api/generated";
import SummaryOfFilters from "./SummaryOfFilters";

type Option<V> = { value: V; label: string };
type FormValues = Pick<
  CreatePoolCandidateSearchRequestInput,
  | "fullName"
  | "email"
  | "jobTitle"
  | "additionalComments"
  | "poolCandidateFilter"
> & {
  department: string;
};
interface RequestFormProps {
  departments: Department[];
  poolCandidateFilter: PoolCandidateFilter;
  handleCreatePoolCandidateSearchRequest: (
    data: CreatePoolCandidateSearchRequestInput,
  ) => Promise<
    CreatePoolCandidateSearchRequestMutation["createPoolCandidateSearchRequest"]
  >;
}

export const RequestForm: React.FunctionComponent<RequestFormProps> = ({
  departments,
  poolCandidateFilter,
  handleCreatePoolCandidateSearchRequest,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const methods = useForm();
  const { handleSubmit } = methods;

  const formValuesToSubmitData = (
    values: FormValues,
  ): CreatePoolCandidateSearchRequestInput => ({
    ...values,
    department: { connect: values.department },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    return handleCreatePoolCandidateSearchRequest(formValuesToSubmitData(data))
      .then(() => {
        navigate(searchPath());
        toast.success(
          intl.formatMessage({
            defaultMessage: "Request created successfully!",
            description:
              "Message displayed to user after a pool candidate request is created successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: creating request failed",
            description:
              "Message displayed to user after a pool candidate request fails to get created.",
          }),
        );
      });
  };

  const departmentOptions: Option<string>[] = departments.map(
    ({ id, name }) => ({
      value: id,
      label: name[locale] ?? "Error: department name not loaded",
    }),
  );

  const classifications: string[] | undefined =
    poolCandidateFilter.classifications?.map(
      (classification) =>
        `${classification?.group.toLocaleUpperCase()}-0${
          classification?.level
        }`,
    );
  const educationLevel: string | undefined = poolCandidateFilter.hasDiploma
    ? "Required diploma from post-secondary institution"
    : "Can accept a combination of work experience and education";
  const employmentEquity: string[] | undefined = ["Woman", "Visible Minority"];
  const operationalRequirements: string[] | undefined =
    poolCandidateFilter.operationalRequirements?.map(
      (operationalRequirement) =>
        operationalRequirement?.name.en || "operational requirement",
    );
  const skills: string[] | undefined = poolCandidateFilter.cmoAssets?.map(
    (cmoAsset) => cmoAsset?.name.en || "cmo asset",
  );
  const typeOfOpportunity = "Indeterminate position";
  const workLocation: string[] = poolCandidateFilter.workRegions as string[];

  return (
    <div>
      <h2 data-h2-margin="b(top, none)">
        {intl.formatMessage({
          defaultMessage: "Request Form",
          description: "Heading for request form.",
        })}
      </h2>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "To submit a request, please provide the following information so we can contact you.",
          description: "Explanation message for request form.",
        })}
      </p>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          data-h2-flex-grid="b(top, contained, padded, none)"
        >
          <div
            style={{ paddingRight: "1rem" }}
            data-h2-flex-item="b(1of1) m(1of2)"
          >
            <Input
              id="fullName"
              type="text"
              name="fullName"
              label={intl.formatMessage({
                defaultMessage: "Full Name",
                description: "Label for full name input in the request form",
              })}
              placeholder={intl.formatMessage({
                defaultMessage: "Full name...",
                description:
                  "Placeholder for full name input in the request form.",
              })}
              rules={{ required: errorMessages.required }}
            />
            <Input
              id="email"
              type="email"
              name="email"
              label={intl.formatMessage({
                defaultMessage: "Government e-mail",
                description:
                  "Label for government email input in the request form",
              })}
              placeholder={intl.formatMessage({
                defaultMessage: "example@canada.ca...",
                description:
                  "Placeholder for government email input in the request form",
              })}
              rules={{ required: errorMessages.required }}
            />
          </div>
          <div data-h2-flex-item="b(1of1) m(1of2)">
            <Select
              id="department"
              name="department"
              label={intl.formatMessage({
                defaultMessage: "Department / Hiring Organization",
                description:
                  "Label for department select input in the request form",
              })}
              nullSelection={intl.formatMessage({
                defaultMessage: "Select a department...",
                description:
                  "Null selection for department select input in the request form.",
              })}
              options={departmentOptions}
              rules={{ required: errorMessages.required }}
            />
            <Input
              id="jobTitle"
              type="text"
              name="jobTitle"
              label={intl.formatMessage({
                defaultMessage: "What is the job title for this position?",
                description: "Label for job title input in the request form",
              })}
              placeholder={intl.formatMessage({
                defaultMessage: "Developer...",
                description:
                  "Placeholder for job title input in the request form.",
              })}
              rules={{ required: errorMessages.required }}
            />
          </div>
          <div data-h2-flex-item="b(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "In this field please include any additional details and qualifications you are seeking from the candidates such as: programming languages, certifications, knowledge, or a specific work location.",
                description:
                  "Blurb before additional comments textarea in the request form.",
              })}
            </p>
            <TextArea
              id="additionalComments"
              name="additionalComments"
              label={intl.formatMessage({
                defaultMessage: "Additional Comments",
                description:
                  "Label for additional comments textarea in the request form.",
              })}
            />
          </div>
          <SummaryOfFilters
            classifications={classifications}
            educationLevel={educationLevel}
            employmentEquity={employmentEquity}
            languageAbility={LanguageAbility.Bilingual}
            operationalRequirements={operationalRequirements}
            skills={skills}
            totalEstimatedCandidates={12}
            typeOfOpportunity={typeOfOpportunity}
            workLocation={workLocation}
          />
          <p>
            {intl.formatMessage({
              defaultMessage:
                "After you click submit, you will receive a confirmation email of your request.",
              description: "Message before submit button on the request form.",
            })}
          </p>
          <div data-h2-flex-item="b(1of1)">
            <Button color="primary" mode="outline" data-h2-margin="b(right, s)">
              {intl.formatMessage({
                defaultMessage: "Back",
                description:
                  "Back button located next to the submit button on the request form.",
              })}
            </Button>
            <Submit
              color="cta"
              mode="solid"
              text={intl.formatMessage({
                defaultMessage: "Submit Request",
                description: "Submit button text on request form.",
              })}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export const CreateRequest: React.FunctionComponent = () => {
  const intl = useIntl();
  const [lookupResult] = useGetPoolCandidateSearchRequestDataQuery();
  const { data: lookupData, fetching, error } = lookupResult;

  const departments: Department[] =
    lookupData?.departments.filter(notEmpty) ?? [];

  const [_result, executeMutation] =
    useCreatePoolCandidateSearchRequestMutation();
  const handleCreatePoolCandidateSearchRequest = (
    data: CreatePoolCandidateSearchRequestInput,
  ) =>
    executeMutation({ poolCandidateSearchRequest: data }).then((result) => {
      if (result.data?.createPoolCandidateSearchRequest) {
        return result.data?.createPoolCandidateSearchRequest;
      }
      return Promise.reject(result.error);
    });

  if (fetching) return <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>;
  if (error)
    return (
      <p>
        {intl.formatMessage(commonMessages.loadingError)} {error.message}
      </p>
    );

  return (
    <RequestForm
      departments={departments}
      poolCandidateFilter={fakePoolCandidateFilters()[0] as PoolCandidateFilter} // TODO: Replace with poolCandidateFilter from history
      handleCreatePoolCandidateSearchRequest={
        handleCreatePoolCandidateSearchRequest
      }
    />
  );
};
