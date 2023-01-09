import { getLocale } from "@common/helpers/localize";
import { FilterBlock } from "@common/components/SearchRequestFilters/deprecated/SearchRequestFilters";
import SearchRequestFilters from "@common/components/SearchRequestFilters/SearchRequestFilters";
import * as React from "react";
import { useIntl } from "react-intl";
import { commonMessages } from "@common/messages";
import { getPoolCandidateSearchStatus } from "@common/constants/localizedConstants";
import Pending from "@common/components/Pending";
import NotFound from "@common/components/NotFound";
import { formatDate, parseDateTimeUtc } from "@common/helpers/dateUtils";
import { getFullPoolAdvertisementTitle } from "@common/helpers/poolUtils";
import Heading from "@common/components/Heading/Heading";
import {
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
    doneDate,
    poolCandidateFilter,
    applicantFilter,
  } = searchRequest;

  const nonApplicableMessage = intl.formatMessage({
    defaultMessage: "N/A",
    id: "i9AjuX",
    description: "Text shown when the filter was not selected",
  });

  return (
    <>
      <Heading level="h2" size="h4">
        {intl.formatMessage({
          defaultMessage: "Manager Information",
          id: "UEsexn",
          description:
            "Heading for the manager info section of the single search request view.",
        })}
      </Heading>
      <div data-h2-background-color="base(dt-gray.lightest)">
        <div data-h2-padding="base(x1)">
          <div
            data-h2-flex-grid="base(stretch, x1, 0)"
            style={{ overflowWrap: "break-word" }}
          >
            <div
              data-h2-flex-item="base(1of1) p-tablet(1of4)"
              data-h2-border-right="p-tablet(1px solid dt-gray)"
            >
              <div
                data-h2-padding="base(0, x1, 0, 0)"
                data-h2-height="base(100%)"
              >
                <FilterBlock
                  title={intl.formatMessage({
                    defaultMessage: "Full Name",
                    id: "W9DTVh",
                    description:
                      "Title for the full name block in the manager info section of the single search request view.",
                  })}
                  content={fullName}
                />
                <FilterBlock
                  title={intl.formatMessage({
                    defaultMessage: "Government Email",
                    id: "d3oN4p",
                    description:
                      "Title for the government email block in the manager info section of the single search request view.",
                  })}
                  content={email}
                />
              </div>
            </div>
            <div
              data-h2-flex-item="base(1of1) p-tablet(1of4)"
              data-h2-border-right="p-tablet(1px solid dt-gray)"
            >
              <div
                data-h2-padding="base(0, x1, 0, 0)"
                data-h2-height="base(100%)"
              >
                <FilterBlock
                  title={intl.formatMessage({
                    defaultMessage: "Department",
                    id: "zwcUgi",
                    description:
                      "Title for the department block in the manager info section of the single search request view.",
                  })}
                  content={department?.name?.[locale]}
                />
                <FilterBlock
                  title={intl.formatMessage({
                    defaultMessage: "Job title for this position",
                    id: "gRPGQN",
                    description:
                      "Title for the job title block in the manager info section of the single search request view.",
                  })}
                  content={jobTitle}
                />
              </div>
            </div>
            <div
              data-h2-flex-item="base(1of1) p-tablet(1of4)"
              data-h2-border-right="p-tablet(1px solid dt-gray)"
            >
              <div
                data-h2-padding="base(0, x1, 0, 0)"
                data-h2-height="base(100%)"
              >
                <FilterBlock
                  title={intl.formatMessage({
                    defaultMessage: "Pool Requested",
                    id: "rz8uPO",
                    description:
                      "Title for the pool block in the manager info section of the single search request view.",
                  })}
                  content={
                    applicantFilter
                      ? applicantFilter?.pools?.map((pool) =>
                          getFullPoolAdvertisementTitle(intl, pool, {
                            defaultTitle: nonApplicableMessage,
                          }),
                        )
                      : poolCandidateFilter?.pools?.map((pool) =>
                          getFullPoolAdvertisementTitle(intl, pool, {
                            defaultTitle: nonApplicableMessage,
                          }),
                        )
                  }
                />

                <FilterBlock
                  title={intl.formatMessage({
                    defaultMessage: "Status",
                    id: "Lzd38d",
                    description:
                      "Title for the status block in the manager info section of the single search request view.",
                  })}
                  content={
                    status
                      ? intl.formatMessage(getPoolCandidateSearchStatus(status))
                      : intl.formatMessage({
                          defaultMessage: "N/A",
                          id: "i9AjuX",
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
                    id: "hzL/Gd",
                    description:
                      "Title for the date requested block in the manager info section of the single search request view.",
                  })}
                  content={
                    requestedDate
                      ? formatDate({
                          date: parseDateTimeUtc(requestedDate),
                          formatString: "PPP p",
                          intl,
                        })
                      : null
                  }
                />
                <FilterBlock
                  title={intl.formatMessage({
                    defaultMessage: "Date done",
                    id: "BAzKWq",
                    description:
                      "Title for the date done block in the manager info section of the single search request view.",
                  })}
                  content={
                    doneDate
                      ? formatDate({
                          date: parseDateTimeUtc(doneDate),
                          formatString: "PPP p",
                          intl,
                        })
                      : intl.formatMessage({
                          defaultMessage: "(Request is still pending)",
                          id: "FxceQZ",
                          description:
                            "Text for when date done is pending in the manager info section of the single search request view.",
                        })
                  }
                />
              </div>
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

  const abstractFilter = applicantFilter ?? poolCandidateFilter;
  return (
    <section>
      <p>
        {intl.formatMessage(
          {
            defaultMessage:
              "<strong>{jobTitle}</strong> at <strong>{department}</strong>",
            id: "ZLDt/c",
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
        <Heading level="h2" size="h4">
          {intl.formatMessage({
            defaultMessage: "Request Information",
            id: "AAmd5G",
            description:
              "Heading for the request information section of the single search request view.",
          })}
        </Heading>
        <div
          data-h2-padding="base(x1)"
          data-h2-background-color="base(dt-gray.lightest)"
        >
          <SearchRequestFilters filters={abstractFilter} />
          <div
            data-h2-padding="base(x1, 0, 0, 0)"
            data-h2-border-top="base(1px solid dt-gray)"
            data-h2-margin="base(x1, 0, 0, 0)"
          >
            <FilterBlock
              title={intl.formatMessage({
                defaultMessage: "Additional Comments",
                id: "WqOnFF",
                description:
                  "Title for the additional comments block in the search request filters",
              })}
              content={additionalComments}
            />
          </div>
        </div>
      </div>
      <div>
        <Heading level="h2" size="h4">
          {intl.formatMessage({
            defaultMessage: "Candidate Results",
            id: "Duswz0",
            description:
              "Heading for the candidate results section of the single search request view.",
          })}
        </Heading>
        {abstractFilter ? (
          <SingleSearchRequestTableApi filter={abstractFilter} />
        ) : (
          <>
            {intl.formatMessage({
              defaultMessage: "Request doesn't include a filter!",
              id: "hmacO5",
              description: "Null state for a request not including a filter.",
            })}
          </>
        )}
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
                id: "BbaMf0",
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
