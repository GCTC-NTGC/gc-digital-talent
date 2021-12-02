import { Input, Select, Submit, TextArea } from "@common/components/form";
import * as React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { commonMessages, errorMessages } from "@common/messages";
import { getLocale } from "@common/helpers/localize";
import { Button } from "@common/components";
import { notEmpty } from "@common/helpers/util";
import { toast } from "react-toastify";
import {
  navigate,
  pushToStateThenNavigate,
  useLocation,
} from "@common/helpers/router";
import { SearchRequestFilters } from "@common/components/SearchRequestFilters";
import { searchPath } from "../../talentSearchRoutes";
import {
  Department,
  PoolCandidateFilter,
  CreatePoolCandidateSearchRequestInput,
  useGetPoolCandidateSearchRequestDataQuery,
  useCreatePoolCandidateSearchRequestMutation,
  CreatePoolCandidateSearchRequestMutation,
  Maybe,
} from "../../api/generated";

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
  poolCandidateFilter: Maybe<PoolCandidateFilter>;
  totalEstimatedCandidates: Maybe<number>;
  handleCreatePoolCandidateSearchRequest: (
    data: CreatePoolCandidateSearchRequestInput,
  ) => Promise<
    CreatePoolCandidateSearchRequestMutation["createPoolCandidateSearchRequest"]
  >;
}

export const RequestForm: React.FunctionComponent<RequestFormProps> = ({
  departments,
  poolCandidateFilter,
  totalEstimatedCandidates,
  handleCreatePoolCandidateSearchRequest,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const methods = useForm();
  const location = useLocation();
  const { handleSubmit } = methods;

  const initialValues = location.state
    ? location.state.some.initialValues
    : null;

  const formValuesToSubmitData = (
    values: FormValues,
  ): CreatePoolCandidateSearchRequestInput => ({
    ...values,
    poolCandidateFilter: {
      create: {
        classifications: {
          sync: poolCandidateFilter?.classifications
            ?.filter(notEmpty)
            .map(({ id }) => id),
        },
        cmoAssets: {
          sync: poolCandidateFilter?.cmoAssets
            ?.filter(notEmpty)
            .map(({ id }) => id),
        },
        hasDiploma: poolCandidateFilter?.hasDiploma,
        hasDisability: poolCandidateFilter?.hasDisability,
        isIndigenous: poolCandidateFilter?.isIndigenous,
        isVisibleMinority: poolCandidateFilter?.isVisibleMinority,
        isWoman: poolCandidateFilter?.isWoman,
        languageAbility: poolCandidateFilter?.languageAbility,
        operationalRequirements: {
          sync: poolCandidateFilter?.operationalRequirements
            ?.filter(notEmpty)
            .map(({ id }) => id),
        },
        pools: {
          sync: poolCandidateFilter?.pools
            ?.filter(notEmpty)
            .map(({ id }) => id),
        },
        workRegions: poolCandidateFilter?.workRegions,
      },
    },
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
      label:
        name[locale] ??
        intl.formatMessage({
          defaultMessage: "Error: department name not found.",
          description:
            "Error message when department name is not found on request page.",
        }),
    }),
  );

  function totalEstimatedCandidatesNull(): JSX.Element {
    return (
      <span data-h2-font-color="b(lightpurple)">
        {totalEstimatedCandidates === null &&
          intl.formatMessage({
            defaultMessage: "N/A",
            description: "Text shown when the filter was not selected",
          })}
      </span>
    );
  }

  function span(msg: string): JSX.Element {
    return <span data-h2-font-color="b(lightpurple)">{msg}</span>;
  }

  return (
    <section>
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div data-h2-flex-grid="b(top, contained, padded, none)">
            <div data-h2-flex-item="b(1of1) m(1of2)">
              <div data-h2-padding="b(right, none) m(right, l)">
                <Input
                  id="fullName"
                  type="text"
                  name="fullName"
                  label={intl.formatMessage({
                    defaultMessage: "Full Name",
                    description:
                      "Label for full name input in the request form",
                  })}
                  placeholder={intl.formatMessage({
                    defaultMessage: "Full name...",
                    description:
                      "Placeholder for full name input in the request form.",
                  })}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                />
              </div>
            </div>
            <div data-h2-flex-item="b(1of1) m(1of2)">
              <div data-h2-padding="b(left, none) m(left, l)">
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
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                />
              </div>
            </div>
            <div data-h2-flex-item="b(1of1) m(1of2)">
              <div data-h2-padding="b(right, none) m(right, l)">
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
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                />
              </div>
            </div>
            <div data-h2-flex-item="b(1of1) m(1of2)">
              <div data-h2-padding="b(left, none) m(left, l)">
                <Input
                  id="jobTitle"
                  type="text"
                  name="jobTitle"
                  label={intl.formatMessage({
                    defaultMessage: "What is the job title for this position?",
                    description:
                      "Label for job title input in the request form",
                  })}
                  placeholder={intl.formatMessage({
                    defaultMessage: "Developer...",
                    description:
                      "Placeholder for job title input in the request form.",
                  })}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                />
              </div>
            </div>
          </div>
          <div>
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
              rows={8}
            />
          </div>
          <h2 data-h2-font-weight="b(500)">
            {intl.formatMessage({
              defaultMessage: "Summary of filters",
              description: "Title of Summary of filters section",
            })}
          </h2>
          <SearchRequestFilters poolCandidateFilter={poolCandidateFilter} />
          <p data-h2-font-weight="b(600)">
            {intl.formatMessage(
              {
                defaultMessage:
                  "Request for pool candidates: <null></null> <span>{totalEstimatedCandidates, plural, zero {no candidates} one {1 candidate} other {{totalEstimatedCandidates} estimated candidates}}</span>",
                description:
                  "Total estimated candidates message in summary of filters",
              },
              {
                null: totalEstimatedCandidatesNull,
                span,
                totalEstimatedCandidates,
              },
            )}
          </p>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "After you click submit, you will receive a confirmation email of your request.",
              description: "Message before submit button on the request form.",
            })}
          </p>
          <div data-h2-flex-item="b(1of1)">
            <Button
              color="primary"
              mode="outline"
              data-h2-margin="b(right, s)"
              onClick={() => {
                // Save the initial search form values to the state so they are available to user when click back.
                pushToStateThenNavigate(searchPath(), {
                  initialValues,
                });
              }}
            >
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
    </section>
  );
};

export const CreateRequest: React.FunctionComponent<{
  poolCandidateFilter: PoolCandidateFilter;
}> = ({ poolCandidateFilter }) => {
  const intl = useIntl();
  const [lookupResult] = useGetPoolCandidateSearchRequestDataQuery();
  const { data: lookupData, fetching, error } = lookupResult;

  const departments: Department[] =
    lookupData?.departments.filter(notEmpty) ?? [];

  const [, executeMutation] = useCreatePoolCandidateSearchRequestMutation();
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
      poolCandidateFilter={poolCandidateFilter}
      totalEstimatedCandidates={null} // TODO: Replace with estimated total queried from api.
      handleCreatePoolCandidateSearchRequest={
        handleCreatePoolCandidateSearchRequest
      }
    />
  );
};
