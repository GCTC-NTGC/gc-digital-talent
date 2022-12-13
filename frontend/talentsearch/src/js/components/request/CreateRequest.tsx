import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import SEO from "@common/components/SEO/SEO";
import { Input, Select, Submit, TextArea } from "@common/components/form";
import { Link } from "@common/components";
import { errorMessages } from "@common/messages";
import { notEmpty } from "@common/helpers/util";
import { toast } from "@common/components/Toast";
import { SearchRequestFilters } from "@common/components/SearchRequestFilters";
import {
  getFromSessionStorage,
  removeFromSessionStorage,
  setInSessionStorage,
} from "@common/helpers/storageUtils";
import { EquitySelections } from "@common/api/generated";
import Pending from "@common/components/Pending";
import { objectsToSortedOptions } from "@common/helpers/formUtils";

import useRoutes from "../../hooks/useRoutes";
import {
  Department,
  CreatePoolCandidateSearchRequestInput,
  useGetPoolCandidateSearchRequestDataQuery,
  useCreatePoolCandidateSearchRequestMutation,
  CreatePoolCandidateSearchRequestMutation,
  Maybe,
  DepartmentBelongsTo,
  Classification,
  OperationalRequirement,
  Pool,
  Skill,
  ApplicantFilter,
  ApplicantFilterInput,
} from "../../api/generated";
import { FormValues as SearchFormValues } from "../search/SearchForm";
import { SimpleClassification } from "../../types/poolUtils";
import { BrowserHistoryState } from "../search/SearchContainer";

// Have to explicitly define this type since the backing object of the form has to be fully nullable.
type FormValues = {
  fullName?: CreatePoolCandidateSearchRequestInput["fullName"];
  email?: CreatePoolCandidateSearchRequestInput["email"];
  jobTitle?: CreatePoolCandidateSearchRequestInput["jobTitle"];
  additionalComments?: CreatePoolCandidateSearchRequestInput["additionalComments"];
  applicantFilter?: {
    expectedClassifications?: {
      sync?: Array<Maybe<Classification["id"]>>;
    };
    skills?: {
      sync?: Array<Maybe<Skill["id"]>>;
    };
    hasDiploma?: ApplicantFilterInput["hasDiploma"];
    positionDuration?: ApplicantFilterInput["positionDuration"];
    equity?: EquitySelections;
    languageAbility?: ApplicantFilter["languageAbility"];
    operationalRequirements?: Array<Maybe<OperationalRequirement>>;
    pools?: {
      sync?: Array<Maybe<Pool["id"]>>;
    };
    locationPreferences?: ApplicantFilterInput["locationPreferences"];
  };
  department?: DepartmentBelongsTo["connect"];
};
export interface RequestFormProps {
  departments: Department[];
  skills: Skill[];
  classifications: Classification[];
  applicantFilter: Maybe<ApplicantFilterInput>;
  candidateCount: Maybe<number>;
  searchFormInitialValues?: SearchFormValues;
  selectedClassifications?: Maybe<SimpleClassification>[];
  handleCreatePoolCandidateSearchRequest: (
    data: CreatePoolCandidateSearchRequestInput,
  ) => Promise<
    CreatePoolCandidateSearchRequestMutation["createPoolCandidateSearchRequest"]
  >;
}

export const RequestForm: React.FunctionComponent<RequestFormProps> = ({
  departments,
  skills,
  classifications,
  applicantFilter,
  candidateCount,
  searchFormInitialValues,
  selectedClassifications,
  handleCreatePoolCandidateSearchRequest,
}) => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();
  const cacheKey = "ts-createRequest";
  const location = useLocation();
  const state = location.state as BrowserHistoryState;

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
      applicantFilter: {
        create: {
          positionDuration:
            applicantFilter && applicantFilter.positionDuration
              ? applicantFilter.positionDuration
              : null,
          hasDiploma: applicantFilter?.hasDiploma
            ? applicantFilter?.hasDiploma
            : false,
          equity: applicantFilter?.equity,
          languageAbility: applicantFilter?.languageAbility,
          operationalRequirements: applicantFilter?.operationalRequirements,
          pools: {
            sync: applicantFilter?.pools
              ? applicantFilter?.pools?.filter(notEmpty).map(({ id }) => id)
              : [],
          },
          locationPreferences: applicantFilter?.locationPreferences
            ? applicantFilter?.locationPreferences
            : [],
          skills: {
            sync: applicantFilter?.skills
              ? applicantFilter?.skills?.filter(notEmpty).map(({ id }) => id)
              : [],
          },
          expectedClassifications: {
            sync: applicantFilter?.expectedClassifications
              ? applicantFilter.expectedClassifications
                  .filter(notEmpty)
                  .map((expectedClassification) => {
                    const cl = classifications.find((classification) => {
                      return (
                        classification.group ===
                          expectedClassification?.group &&
                        classification.level === expectedClassification.level
                      );
                    });
                    return cl?.id ?? "";
                  })
              : [],
          },
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
            id: "gUb3PY",
            description:
              "Message displayed to user after a pool candidate request is created successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: creating request failed",
            id: "9nIALc",
            description:
              "Message displayed to user after a pool candidate request fails to get created.",
          }),
        );
      });
  };

  // The applicantFilter from the location state needs to be changed from ApplicantFilterInput to the type ApplicantFilter for the SearchRequestFilters visual component.
  const applicantFilterInputToType: ApplicantFilter = {
    __typename: "ApplicantFilter",
    id: "", // Set Id to empty string since the PoolCandidateSearchRequest doesn't exist yet.
    ...applicantFilter,
    expectedClassifications:
      applicantFilter?.expectedClassifications?.map(
        (expectedClassification) => {
          return classifications.find((classification) => {
            return (
              classification.group === expectedClassification?.group &&
              classification.level === expectedClassification.level
            );
          });
        },
      ) ?? [],
    skills:
      applicantFilter?.skills?.map((skillId) => {
        return skills.find((skill) => {
          return skill && skillId && skill.id === skillId.id;
        });
      }) ?? [],
  };

  return (
    <section>
      <h2 data-h2-margin="base(0, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage: "Request Form",
          id: "LOYv+/",
          description: "Heading for request form.",
        })}
      </h2>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "To submit a request, please provide the following information so we can contact you.",
          id: "GHvRHc",
          description: "Explanation message for request form.",
        })}
      </p>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div data-h2-flex-grid="base(flex-start, 0) p-tablet(flex-start, x2, 0)">
            <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
              <Input
                id="fullName"
                type="text"
                name="fullName"
                label={intl.formatMessage({
                  defaultMessage: "Full Name",
                  id: "dRnKNR",
                  description: "Label for full name input in the request form",
                })}
                placeholder={intl.formatMessage({
                  defaultMessage: "Full name...",
                  id: "OjhS6t",
                  description:
                    "Placeholder for full name input in the request form.",
                })}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
            </div>
            <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
              <Select
                id="department"
                name="department"
                label={intl.formatMessage({
                  defaultMessage: "Department / Hiring Organization",
                  id: "UUIb3j",
                  description:
                    "Label for department select input in the request form",
                })}
                nullSelection={intl.formatMessage({
                  defaultMessage: "Select a department...",
                  id: "WE/Nu+",
                  description:
                    "Null selection for department select input in the request form.",
                })}
                options={objectsToSortedOptions(departments, intl)}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
            </div>
            <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
              <Input
                id="email"
                type="email"
                name="email"
                label={intl.formatMessage({
                  defaultMessage: "Government e-mail",
                  id: "mRNmrR",
                  description:
                    "Label for government email input in the request form",
                })}
                placeholder={intl.formatMessage({
                  defaultMessage: "example@canada.ca...",
                  id: "N6+rnM",
                  description:
                    "Placeholder for government email input in the request form",
                })}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
            </div>
            <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
              <Input
                id="jobTitle"
                type="text"
                name="jobTitle"
                label={intl.formatMessage({
                  defaultMessage: "What is the job title for this position?",
                  id: "7lCUIL",
                  description: "Label for job title input in the request form",
                })}
                placeholder={intl.formatMessage({
                  defaultMessage: "Developer...",
                  id: "zz9pwK",
                  description:
                    "Placeholder for job title input in the request form.",
                })}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
            </div>
          </div>
          <div>
            <p data-h2-margin="base(x2, 0, 0, 0)">
              {intl.formatMessage({
                defaultMessage:
                  "In this field please include any additional details and qualifications you are seeking from the candidates such as: programming languages, certifications, knowledge, or a specific work location.",
                id: "Zzd/sJ",
                description:
                  "Blurb before additional comments textarea in the request form.",
              })}
            </p>
            <TextArea
              id="additionalComments"
              name="additionalComments"
              label={intl.formatMessage({
                defaultMessage: "Additional Comments",
                id: "FC5tje",
                description:
                  "Label for additional comments textarea in the request form.",
              })}
              rows={8}
            />
          </div>
          <h2 data-h2-margin="base(x2, 0, x1, 0)">
            {intl.formatMessage({
              defaultMessage: "Summary of filters",
              id: "emx1cK",
              description: "Title of Summary of filters section",
            })}
          </h2>
          <SearchRequestFilters
            filters={applicantFilterInputToType}
            selectedClassifications={selectedClassifications}
          />
          <p
            data-h2-margin="base(x2, 0, x1, 0)"
            data-h2-font-weight="base(600)"
          >
            {intl.formatMessage(
              {
                defaultMessage:
                  "Request for pool candidates: <primary>{candidateCountNumber, plural, =0 {no candidates} =1 {1 estimated candidate} other {{candidateCountNumber} estimated candidates}}</primary>",
                id: "og5vUB",
                description:
                  "Total estimated candidates message in summary of filters",
              },
              {
                candidateCountNumber: candidateCount || 0,
              },
            )}
          </p>
          <div data-h2-flex-grid="base(flex-start, 0, x1) p-tablet(center, x2, 0)">
            <div
              data-h2-text-align="base(center) p-tablet(left)"
              data-h2-flex-item="base(1of1) p-tablet(1of2)"
            >
              <Link
                color="primary"
                mode="outline"
                data-h2-margin="base(0, x.5, 0, 0)"
                href={paths.search()}
                state={{
                  ...state,
                  initialValues: searchFormInitialValues,
                }}
              >
                {intl.formatMessage({
                  defaultMessage: "Back",
                  id: "L8k+lC",
                  description:
                    "Back button located next to the submit button on the request form.",
                })}
              </Link>
            </div>
            <div
              data-h2-text-align="base(center) p-tablet(right)"
              data-h2-flex-item="base(1of1) p-tablet(1of2)"
            >
              <Submit
                color="cta"
                mode="solid"
                text={intl.formatMessage({
                  defaultMessage: "Submit Request",
                  id: "eTTlR0",
                  description: "Submit button text on request form.",
                })}
              />
            </div>
          </div>
        </form>
      </FormProvider>
    </section>
  );
};

export const CreateRequest: React.FunctionComponent<{
  applicantFilter: Maybe<ApplicantFilterInput>;
  candidateCount: Maybe<number>;
  searchFormInitialValues?: SearchFormValues;
  selectedClassifications?: Maybe<SimpleClassification>[];
}> = ({
  applicantFilter,
  candidateCount,
  searchFormInitialValues,
  selectedClassifications,
}) => {
  const intl = useIntl();
  const [lookupResult] = useGetPoolCandidateSearchRequestDataQuery();
  const { data: lookupData, fetching, error } = lookupResult;

  const classifications: Classification[] =
    lookupData?.classifications.filter(notEmpty) ?? [];
  const departments: Department[] =
    lookupData?.departments.filter(notEmpty) ?? [];
  const skills: Skill[] = lookupData?.skills.filter(notEmpty) ?? [];

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
    <>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Request pool candidates",
          id: "u3eefq",
          description: "Page title for the request candidates form page",
        })}
      />
      <Pending fetching={fetching} error={error}>
        <RequestForm
          classifications={classifications}
          departments={departments}
          skills={skills}
          applicantFilter={applicantFilter}
          candidateCount={candidateCount}
          searchFormInitialValues={searchFormInitialValues}
          selectedClassifications={selectedClassifications}
          handleCreatePoolCandidateSearchRequest={
            handleCreatePoolCandidateSearchRequest
          }
        />
      </Pending>
    </>
  );
};
