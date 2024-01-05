import * as React from "react";
import { useIntl } from "react-intl";

import {
  getLocale,
  commonMessages,
  getPoolCandidateSearchStatus,
  getLocalizedName,
  getPoolCandidateSearchPositionType,
} from "@gc-digital-talent/i18n";
import {
  Pending,
  NotFound,
  Heading,
  Link,
  Separator,
} from "@gc-digital-talent/ui";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { getSearchRequestReason } from "@gc-digital-talent/i18n/src/messages/localizedConstants";

import SearchRequestFilters from "~/components/SearchRequestFilters/SearchRequestFilters";
import {
  PoolCandidateSearchRequest,
  useGetPoolCandidateSearchRequestQuery,
} from "~/api/generated";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRoutes from "~/hooks/useRoutes";
import adminMessages from "~/messages/adminMessages";
import FilterBlock from "~/components/SearchRequestFilters/FilterBlock";
import AdminHero from "~/components/Hero/AdminHero";
import SEO from "~/components/SEO/SEO";

import SingleSearchRequestTableApi from "./SearchRequestCandidatesTable";
import UpdateSearchRequest from "./UpdateSearchRequest";

const ManagerInfo = ({
  searchRequest,
}: {
  searchRequest: PoolCandidateSearchRequest;
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const {
    fullName,
    department,
    email,
    managerJobTitle,
    status,
    requestedDate,
    statusChangedAt,
  } = searchRequest;

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
      <div data-h2-background-color="base(gray.lightest)">
        <div data-h2-padding="base(x1)">
          <div
            data-h2-flex-grid="base(stretch, x1, 0)"
            style={{ overflowWrap: "break-word" }}
          >
            <div
              data-h2-flex-item="base(1of1) p-tablet(1of4)"
              data-h2-border-right="p-tablet(1px solid gray)"
            >
              <div
                data-h2-padding="base(0, x1, 0, 0)"
                data-h2-height="base(100%)"
              >
                <FilterBlock
                  title={intl.formatMessage({
                    defaultMessage: "Full name",
                    id: "IBc2sp",
                    description: "Label for full name",
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
                  content={
                    email ? (
                      <Link external href={`mailto:${email}`}>
                        {email}
                      </Link>
                    ) : null
                  }
                />
              </div>
            </div>
            <div
              data-h2-flex-item="base(1of1) p-tablet(1of4)"
              data-h2-border-right="p-tablet(1px solid gray)"
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
                  title={intl.formatMessage(adminMessages.jobTitle)}
                  content={
                    managerJobTitle ??
                    intl.formatMessage(adminMessages.noneProvided)
                  }
                />
              </div>
            </div>
            <div
              data-h2-flex-item="base(1of1) p-tablet(1of4)"
              data-h2-border-right="p-tablet(1px solid gray)"
            >
              <div
                data-h2-padding="base(0, x1, 0, 0)"
                data-h2-height="base(100%)"
              >
                <FilterBlock
                  title={intl.formatMessage({
                    defaultMessage: "Date Received",
                    id: "r2gD/4",
                    description:
                      "Title displayed on the search request table requested date column.",
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
              </div>
            </div>
            <div data-h2-flex-item="base(1of1) p-tablet(1of4)">
              <div
                data-h2-padding="base(0, x1, 0, 0)"
                data-h2-height="base(100%)"
              >
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
                <FilterBlock
                  title={intl.formatMessage({
                    defaultMessage: "Status change",
                    id: "IUoUqs",
                    description:
                      "Title for the request status last changed at date block.",
                  })}
                  content={
                    statusChangedAt
                      ? formatDate({
                          date: parseDateTimeUtc(statusChangedAt),
                          formatString: "PPP p",
                          intl,
                        })
                      : intl.formatMessage({
                          defaultMessage: "(Not changed)",
                          id: "rfDHc0",
                          description: "Null state, nothing changed yet.",
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

export const ViewSearchRequest = ({
  searchRequest,
}: SingleSearchRequestProps) => {
  const intl = useIntl();
  const routes = useRoutes();
  const locale = getLocale(intl);
  const {
    id,
    additionalComments,
    poolCandidateFilter,
    fullName,
    department,
    applicantFilter,
    wasEmpty,
    jobTitle,
    positionType,
    reason,
  } = searchRequest;

  const navigationCrumbs = [
    {
      label: intl.formatMessage({
        defaultMessage: "Home",
        id: "EBmWyo",
        description: "Link text for the home link in breadcrumbs.",
      }),
      url: routes.adminDashboard(),
    },
    {
      label: intl.formatMessage(adminMessages.requests),
      url: routes.searchRequestTable(),
    },
    {
      label: `${fullName} - ${getLocalizedName(department?.name, intl)}`,
      url: routes.searchRequestView(id),
    },
  ];

  const pageTitle = intl.formatMessage({
    defaultMessage: "Request",
    id: "WYJnLs",
    description: "Heading displayed above the single search request component.",
  });

  const abstractFilter = applicantFilter ?? poolCandidateFilter;

  return (
    <>
      <SEO title={pageTitle} />
      <AdminHero
        title={pageTitle}
        subtitle={intl.formatMessage(
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
        nav={{ mode: "crumbs", items: navigationCrumbs }}
      />
      <AdminContentWrapper>
        {wasEmpty && (
          <p data-h2-margin="base(0 0 x1 0)">
            {intl.formatMessage({
              defaultMessage:
                "This request did not result in any matches, let us know more about this in the comments field at the end of this form.",
              id: "ruEs9/",
              description:
                "Message to admins that a search request resulted in no candidates being found",
            })}
          </p>
        )}

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
            data-h2-background-color="base(gray.lightest)"
          >
            <FilterBlock
              title={intl.formatMessage({
                defaultMessage: "Reason for talent request",
                id: "enffKD",
                description: "Label for the reason for submitting the request.",
              })}
              content={
                reason ? intl.formatMessage(getSearchRequestReason(reason)) : ""
              }
            />
            <Separator
              orientation="horizontal"
              data-h2-background-color="base(gray.lighter)"
              data-h2-margin-bottom="base(x1)"
            />
            <SearchRequestFilters filters={abstractFilter} />
            <div
              data-h2-padding="base(x1, 0, 0, 0)"
              data-h2-border-top="base(1px solid gray)"
              data-h2-margin="base(x1, 0, 0, 0)"
            >
              <div data-h2-flex-grid="base(flex-start, 0) p-tablet(flex-start, x2, x1)">
                <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
                  <FilterBlock
                    title={intl.formatMessage({
                      defaultMessage: "Position job title",
                      id: "OI7Bc7",
                      description: "Label for an opportunity's job title.",
                    })}
                    content={jobTitle}
                  />
                </div>
                <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
                  <FilterBlock
                    title={intl.formatMessage({
                      defaultMessage: "Type of position",
                      id: "nZT/WM",
                      description: "Label for an opportunity's position type.",
                    })}
                    content={
                      positionType
                        ? intl.formatMessage(
                            getPoolCandidateSearchPositionType(positionType),
                          )
                        : intl.formatMessage(adminMessages.noneProvided)
                    }
                  />
                </div>
              </div>
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
      </AdminContentWrapper>
    </>
  );
};

const ViewSearchRequestApi = ({
  searchRequestId,
}: {
  searchRequestId: string;
}) => {
  const intl = useIntl();
  const [{ data: searchRequestData, fetching, error }] =
    useGetPoolCandidateSearchRequestQuery({
      variables: { id: searchRequestId },
    });

  return (
    <Pending fetching={fetching} error={error}>
      {searchRequestData?.poolCandidateSearchRequest ? (
        <ViewSearchRequest
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

export default ViewSearchRequestApi;
