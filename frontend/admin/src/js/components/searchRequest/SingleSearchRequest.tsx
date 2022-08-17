import { getLocale } from "@common/helpers/localize";
import { FilterBlock } from "@common/components/SearchRequestFilters/deprecated/SearchRequestFilters";
import SearchRequestFilters from "@common/components/SearchRequestFilters/SearchRequestFilters";
import * as React from "react";
import { useIntl } from "react-intl";
import { commonMessages } from "@common/messages";
import { notEmpty } from "@common/helpers/util";
import { getPoolCandidateSearchStatus } from "@common/constants/localizedConstants";
import Pending from "@common/components/Pending";
import NotFound from "@common/components/NotFound";
import {
  PoolCandidateFilterInput,
  PoolCandidateSearchRequest,
  useGetPoolCandidateSearchRequestQuery,
} from "../../api/generated";
import { SingleSearchRequestTableApi } from "./SingleSearchRequestTable";
import { UpdateSearchRequest } from "./UpdateSearchRequest";

const ManagerInfo: React.FunctionComponent<{
  searchRequest: PoolCandidateSearchRequest;
}> = ({ searchRequest }) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const {
    fullName,
    department,
    email,
    jobTitle,
    status,
    requestedDate,
    poolCandidateFilter,
    applicantFilter,
  } = searchRequest;

  const nonApplicableMessage = intl.formatMessage({
    defaultMessage: "N/A",
    description: "Text shown when the filter was not selected",
  });

  return (
    <>
      <h2
        data-h2-margin="base(x2, 0, x.5, 0)"
        data-h2-font-size="base(h4, 1.3)"
      >
        {intl.formatMessage({
          defaultMessage: "Manager Information",
          description:
            "Heading for the manager info section of the single search request view.",
        })}
      </h2>
      <div data-h2-background-color="base(lightest.dt-gray)">
        <div
          data-h2-flex-grid="base(stretch, x1, x1, 0)"
          style={{ overflowWrap: "break-word" }}
        >
          <div
            data-h2-flex-item="base(1of1) p-tablet(1of4)"
            data-h2-border="p-tablet(right, 1px, solid, dt-gray)"
          >
            <div
              data-h2-padding="base(0, x1, 0, 0)"
              data-h2-height="base(100%)"
            >
              <FilterBlock
                title={intl.formatMessage({
                  defaultMessage: "Full Name",
                  description:
                    "Title for the full name block in the manager info section of the single search request view.",
                })}
                content={fullName}
              />
              <FilterBlock
                title={intl.formatMessage({
                  defaultMessage: "Government Email",
                  description:
                    "Title for the government email block in the manager info section of the single search request view.",
                })}
                content={email}
              />
            </div>
          </div>
          <div
            data-h2-flex-item="base(1of1) p-tablet(1of4)"
            data-h2-border="p-tablet(right, 1px, solid, dt-gray)"
          >
            <div
              data-h2-padding="base(0, x1, 0, 0)"
              data-h2-height="base(100%)"
            >
              <FilterBlock
                title={intl.formatMessage({
                  defaultMessage: "Department",
                  description:
                    "Title for the department block in the manager info section of the single search request view.",
                })}
                content={department?.name?.[locale]}
              />
              <FilterBlock
                title={intl.formatMessage({
                  defaultMessage: "Job title for this position",
                  description:
                    "Title for the job title block in the manager info section of the single search request view.",
                })}
                content={jobTitle}
              />
            </div>
          </div>
          <div
            data-h2-flex-item="base(1of1) p-tablet(1of4)"
            data-h2-border="p-tablet(right, 1px, solid, dt-gray)"
          >
            <div
              data-h2-padding="base(0, x1, 0, 0)"
              data-h2-height="base(100%)"
            >
              <FilterBlock
                title={intl.formatMessage({
                  defaultMessage: "Pool Requested",
                  description:
                    "Title for the pool block in the manager info section of the single search request view.",
                })}
                content={
                  applicantFilter
                  ? applicantFilter?.pools?.map(
                      (pool) => pool?.name?.[locale] || nonApplicableMessage,
                    )
                  : poolCandidateFilter?.pools?.map(
                      (pool) => pool?.name?.[locale] || nonApplicableMessage,
                    )
                }
              />

              <FilterBlock
                title={intl.formatMessage({
                  defaultMessage: "Status",
                  description:
                    "Title for the status block in the manager info section of the single search request view.",
                })}
                content={
                  status
                    ? intl.formatMessage(getPoolCandidateSearchStatus(status))
                    : intl.formatMessage({
                        defaultMessage: "N/A",
                        description:
                          "Text shown when the filter was not selected",
                      })
                }
              />
            </div>
          </div>
          <div data-h2-flex-item="base(1of1) p-tablet(1of4)">
            <div
              data-h2-padding="base(0, x1, 0, 0)"
              data-h2-height="base(100%)"
            >
              <FilterBlock
                title={intl.formatMessage({
                  defaultMessage: "Date Requested",
                  description:
                    "Title for the date requested block in the manager info section of the single search request view.",
                })}
                content={requestedDate}
              />
              <FilterBlock
                title={intl.formatMessage({
                  defaultMessage: "Date done",
                  description:
                    "Title for the date done block in the manager info section of the single search request view.",
                })}
                content="NA (Request is still pending)"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

interface SingleSearchRequestProps {
  searchRequest: PoolCandidateSearchRequest;
}

export const SingleSearchRequest: React.FunctionComponent<
  SingleSearchRequestProps
> = ({ searchRequest }) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const { additionalComments, poolCandidateFilter, applicantFilter } =
    searchRequest;
  // TODO: data filter data from applicantFilter instead of poolCandidateFilter if possible.

  const poolCandidateFilterInput: PoolCandidateFilterInput = {
    classifications: [
      ...(poolCandidateFilter?.classifications
        ? poolCandidateFilter.classifications
            .filter(notEmpty)
            .map(({ group, level }) => {
              return {
                group,
                level,
              };
            })
        : []),
    ],
    cmoAssets: [
      ...(poolCandidateFilter?.cmoAssets
        ? poolCandidateFilter.cmoAssets.filter(notEmpty).map(({ key }) => {
            return {
              key,
            };
          })
        : []),
    ],
    operationalRequirements: poolCandidateFilter?.operationalRequirements,
    pools: [
      ...(poolCandidateFilter?.pools
        ? poolCandidateFilter.pools.filter(notEmpty).map(({ id }) => {
            return {
              id,
            };
          })
        : []),
    ],
    hasDiploma: poolCandidateFilter?.hasDiploma,
    equity: {
      hasDisability: poolCandidateFilter?.equity?.hasDisability,
      isIndigenous: poolCandidateFilter?.equity?.isIndigenous,
      isVisibleMinority: poolCandidateFilter?.equity?.isVisibleMinority,
      isWoman: poolCandidateFilter?.equity?.isWoman,
    },
    languageAbility: poolCandidateFilter?.languageAbility || undefined,
    workRegions: poolCandidateFilter?.workRegions,
  };

  return (
    <section>
      <p>
        {intl.formatMessage(
          {
            defaultMessage:
              "<strong>{jobTitle}</strong> at <strong>{department}</strong>",
            description:
              "Subtitle displayed above the single search request component.",
          },
          {
            jobTitle: searchRequest.jobTitle,
            department: searchRequest.department?.name[locale],
          },
        )}
      </p>
      <ManagerInfo searchRequest={searchRequest} />
      <div>
        <h2
          data-h2-margin="base(x2, 0, x.5, 0)"
          data-h2-font-size="base(h4, 1.3)"
        >
          {intl.formatMessage({
            defaultMessage: "Request Information",
            description:
              "Heading for the request information section of the single search request view.",
          })}
        </h2>
        <div
          data-h2-padding="base(x1)"
          data-h2-background-color="base(lightest.dt-gray)"
        >
          <SearchRequestFilters
            filters={applicantFilter || poolCandidateFilter}
          />
          <div
            data-h2-padding="base(x1, 0, 0, 0)"
            data-h2-border="base(top, 1px, solid, dt-gray)"
            data-h2-margin="base(x1, 0, 0, 0)"
          >
            <FilterBlock
              title={intl.formatMessage({
                defaultMessage: "Additional Comments",
                description:
                  "Title for the additional comments block in the search request filters",
              })}
              content={additionalComments}
            />
          </div>
        </div>
      </div>
      <div>
        <h2
          data-h2-margin="base(x2, 0, 0, 0)"
          data-h2-font-size="base(h4, 1.3)"
        >
          {intl.formatMessage({
            defaultMessage: "Candidate Results",
            description:
              "Heading for the candidate results section of the single search request view.",
          })}
        </h2>
        <SingleSearchRequestTableApi
          poolCandidateFilter={poolCandidateFilterInput}
        />
      </div>
      <UpdateSearchRequest initialSearchRequest={searchRequest} />
    </section>
  );
};

export const SingleSearchRequestApi: React.FunctionComponent<{
  searchRequestId: string;
}> = ({ searchRequestId }) => {
  const intl = useIntl();
  const [{ data: searchRequestData, fetching, error }] =
    useGetPoolCandidateSearchRequestQuery({
      variables: { id: searchRequestId },
    });

  return (
    <Pending fetching={fetching} error={error}>
      {searchRequestData?.poolCandidateSearchRequest ? (
        <SingleSearchRequest
          searchRequest={searchRequestData?.poolCandidateSearchRequest}
        />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>
            {intl.formatMessage(
              {
                defaultMessage: "Search Request {searchRequestId} not found.",
                description:
                  "Message displayed for search request not found on single search request page.",
              },
              { searchRequestId },
            )}
          </p>
        </NotFound>
      )}
    </Pending>
  );
};
