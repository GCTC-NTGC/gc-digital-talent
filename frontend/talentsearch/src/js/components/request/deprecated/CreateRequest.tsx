import { Input, Select, Submit, TextArea } from "@common/components/form";
import * as React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { errorMessages } from "@common/messages";
import { getLocale } from "@common/helpers/localize";
import { Button } from "@common/components";
import { notEmpty } from "@common/helpers/util";
import { toast } from "react-toastify";
import { navigate, pushToStateThenNavigate } from "@common/helpers/router";
import SearchRequestFilters from "@common/components/SearchRequestFilters/deprecated/SearchRequestFilters";
import {
  getFromSessionStorage,
  removeFromSessionStorage,
  setInSessionStorage,
} from "@common/helpers/storageUtils";
import { EquitySelections } from "@common/api/generated";
import Pending from "@common/components/Pending";
import { useTalentSearchRoutes } from "../../../talentSearchRoutes";
import {
  Department,
  PoolCandidateFilter,
  CreatePoolCandidateSearchRequestInput,
  useGetPoolCandidateSearchRequestDataQuery,
  useCreatePoolCandidateSearchRequestMutation,
  CreatePoolCandidateSearchRequestMutation,
  Maybe,
  DepartmentBelongsTo,
  CmoAsset,
  Classification,
  OperationalRequirement,
  Pool,
} from "../../../api/generated";
import { FormValues as SearchFormValues } from "../../search/SearchForm";

type Option<V> = { value: V; label: string };
// Have to explicitly define this type since the backing object of the form has to be fully nullable.
type FormValues = {
  fullName?: CreatePoolCandidateSearchRequestInput["fullName"];
  email?: CreatePoolCandidateSearchRequestInput["email"];
  jobTitle?: CreatePoolCandidateSearchRequestInput["jobTitle"];
  additionalComments?: CreatePoolCandidateSearchRequestInput["additionalComments"];
  poolCandidateFilter?: {
    classifications?: {
      sync?: Array<Maybe<Classification["id"]>>;
    };
    cmoAssets?: {
      sync?: Array<Maybe<CmoAsset["id"]>>;
    };
    hasDiploma?: PoolCandidateFilter["hasDiploma"];
    equity?: EquitySelections;
    languageAbility?: PoolCandidateFilter["languageAbility"];
    operationalRequirements?: Array<Maybe<OperationalRequirement>>;
    pools?: {
      sync?: Array<Maybe<Pool["id"]>>;
    };
    workRegions?: PoolCandidateFilter["workRegions"];
  };
  department?: DepartmentBelongsTo["connect"];
};
export interface RequestFormProps {
  departments: Department[];
  poolCandidateFilter: Maybe<PoolCandidateFilter>;
  candidateCount: Maybe<number>;
  searchFormInitialValues: Maybe<SearchFormValues>;
  handleCreatePoolCandidateSearchRequest: (
    data: CreatePoolCandidateSearchRequestInput,
  ) => Promise<
    CreatePoolCandidateSearchRequestMutation["createPoolCandidateSearchRequest"]
  >;
}

export const RequestForm: React.FunctionComponent<RequestFormProps> = ({
  departments,
  poolCandidateFilter,
  candidateCount,
  searchFormInitialValues,
  handleCreatePoolCandidateSearchRequest,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useTalentSearchRoutes();
  const cacheKey = "ts-createRequest";

  const formMethods = useForm<FormValues>({
    defaultValues: getFromSessionStorage(cacheKey, {}),
  });
  const { handleSubmit, watch } = formMethods;

  watch((data) => setInSessionStorage(cacheKey, data));

  const formValuesToSubmitData = (
    values: FormValues,
  ): CreatePoolCandidateSearchRequestInput => {
    return {
      fullName: values.fullName ?? "",
      email: values.email ?? "",
      jobTitle: values.jobTitle ?? "",
      additionalComments: values.additionalComments,
      poolCandidateFilter: {
        create: {
          classifications: {
            sync: poolCandidateFilter?.classifications
              ? poolCandidateFilter?.classifications
                  ?.filter(notEmpty)
                  .map(({ id }) => id)
              : [],
          },
          cmoAssets: {
            sync: poolCandidateFilter?.cmoAssets
              ? poolCandidateFilter?.cmoAssets
                  ?.filter(notEmpty)
                  .map(({ id }) => id)
              : [],
          },
          hasDiploma: poolCandidateFilter?.hasDiploma
            ? poolCandidateFilter?.hasDiploma
            : false,
          equity: poolCandidateFilter?.equity,
          languageAbility: poolCandidateFilter?.languageAbility,
          operationalRequirements: poolCandidateFilter?.operationalRequirements,
          pools: {
            sync: poolCandidateFilter?.pools
              ? poolCandidateFilter?.pools?.filter(notEmpty).map(({ id }) => id)
              : [],
          },
          workRegions: poolCandidateFilter?.workRegions
            ? poolCandidateFilter?.workRegions
            : [],
        },
      },
      department: { connect: values.department ?? "" },
    };
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    return handleCreatePoolCandidateSearchRequest(formValuesToSubmitData(data))
      .then(() => {
        removeFromSessionStorage(cacheKey); // clear the locally saved from once it is successfully submitted
        navigate(paths.search());
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

  const departmentOptions: Option<string>[] = departments
    .sort((a, b) => {
      const aName: Maybe<string> = a.name[locale];
      const bName: Maybe<string> = b.name[locale];
      if (aName && bName) {
        return aName.localeCompare(bName, locale);
      }

      return 0;
    })
    .map(({ id, name }) => ({
      value: id,
      label:
        name[locale] ??
        intl.formatMessage({
          defaultMessage: "Error: department name not found.",
          description:
            "Error message when department name is not found on request page.",
        }),
    }));

  function span(msg: string): JSX.Element {
    return <span data-h2-color="base(dt-primary.light)">{msg}</span>;
  }

  return (
    <section>
      <h2 data-h2-margin="base(0)">
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
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div data-h2-flex-grid="base(top, contained, padded, none)">
            <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
              <div data-h2-padding="base(0) p-tablet(0, x2, 0, 0)">
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
            <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
              <div data-h2-padding="base(0) p-tablet(0, 0, 0, x2)">
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
            <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
              <div data-h2-padding="base(0) p-tablet(0, x2, 0, 0)">
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
            <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
              <div data-h2-padding="base(0) p-tablet(0, 0, 0, x2)">
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
          <h2 data-h2-font-weight="base(500)">
            {intl.formatMessage({
              defaultMessage: "Summary of filters",
              description: "Title of Summary of filters section",
            })}
          </h2>
          <SearchRequestFilters
            poolCandidateFilter={poolCandidateFilter}
            poolApplicantFilter={undefined}
          />
          <p data-h2-font-weight="base(600)">
            {intl.formatMessage(
              {
                defaultMessage:
                  "Request for pool candidates: <span>{candidateCountNumber, plural, =0 {no candidates} =1 {1 estimated candidate} other {{candidateCountNumber} estimated candidates}}</span>",
                description:
                  "Total estimated candidates message in summary of filters",
              },
              {
                span,
                candidateCountNumber: candidateCount || 0,
              },
            )}
          </p>

          <div data-h2-flex-item="base(1of1)">
            <Button
              color="primary"
              mode="outline"
              data-h2-margin="base(right, s)"
              onClick={() => {
                // Save the initial search form values to the state so they are available to user when click back.
                pushToStateThenNavigate(paths.search(), {
                  searchFormInitialValues,
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
  poolCandidateFilter: Maybe<PoolCandidateFilter>;
  candidateCount: Maybe<number>;
  searchFormInitialValues: Maybe<SearchFormValues>;
}> = ({ poolCandidateFilter, candidateCount, searchFormInitialValues }) => {
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

  return (
    <Pending fetching={fetching} error={error}>
      <RequestForm
        departments={departments}
        poolCandidateFilter={poolCandidateFilter}
        candidateCount={candidateCount}
        searchFormInitialValues={searchFormInitialValues}
        handleCreatePoolCandidateSearchRequest={
          handleCreatePoolCandidateSearchRequest
        }
      />
    </Pending>
  );
};
