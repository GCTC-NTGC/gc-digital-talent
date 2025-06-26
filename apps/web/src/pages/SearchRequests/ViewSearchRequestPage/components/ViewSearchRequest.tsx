import { defineMessage, useIntl } from "react-intl";
import { useQuery } from "urql";

import {
  getLocale,
  commonMessages,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import {
  Pending,
  NotFound,
  Heading,
  Link,
  Separator,
  Container,
} from "@gc-digital-talent/ui";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import {
  FragmentType,
  PoolCandidateSearchRequest,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";

import SearchRequestFilters from "~/components/SearchRequestFilters/SearchRequestFilters";
import useRoutes from "~/hooks/useRoutes";
import adminMessages from "~/messages/adminMessages";
import FilterBlock from "~/components/SearchRequestFilters/FilterBlock";
import SEO from "~/components/SEO/SEO";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import pageTitles from "~/messages/pageTitles";
import talentRequestMessages from "~/messages/talentRequestMessages";
import Hero from "~/components/Hero";

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
    hrAdvisorEmail,
    status,
    requestedDate,
    statusChangedAt,
  } = searchRequest;

  return (
    <>
      <Heading level="h2" size="h4" data-h2-margin-top="base(0)">
        {intl.formatMessage({
          defaultMessage: "Manager information",
          id: "eyR6B+",
          description:
            "Heading for the manager info section of the single search request view.",
        })}
      </Heading>
      <div
        data-h2-background-color="base(foreground)"
        data-h2-radius="base(rounded)"
        data-h2-shadow="base(larger)"
      >
        <div data-h2-padding="base(x1)">
          <div
            data-h2-flex-grid="base(stretch, x1, 0)"
            style={{ overflowWrap: "break-word" }}
          >
            <div
              data-h2-flex-item="base(1of1) p-tablet(1of4)"
              data-h2-border-right="p-tablet(1px solid black.2)"
            >
              <div
                data-h2-padding="base(0, x1, 0, 0)"
                data-h2-height="base(100%)"
              >
                <FilterBlock
                  title={intl.formatMessage(commonMessages.fullName)}
                  content={fullName}
                />
                <FilterBlock
                  title={intl.formatMessage({
                    defaultMessage: "Government email",
                    id: "wLVo1I",
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
              data-h2-border-right="p-tablet(1px solid black.2)"
            >
              <div
                data-h2-padding="base(0, x1, 0, 0)"
                data-h2-height="base(100%)"
              >
                <FilterBlock
                  title={intl.formatMessage(commonMessages.department)}
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
              data-h2-border-right="p-tablet(1px solid black.2)"
            >
              <div
                data-h2-padding="base(0, x1, 0, 0)"
                data-h2-height="base(100%)"
              >
                <FilterBlock
                  title={intl.formatMessage({
                    defaultMessage: "Date received",
                    id: "m0Qcow",
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
                <FilterBlock
                  title={intl.formatMessage({
                    defaultMessage: "HR advisor email",
                    id: "PD7anu",
                    description:
                      "Title for the government email block in the manager info section of the single search request view.",
                  })}
                  content={
                    hrAdvisorEmail ? (
                      <Link external href={`mailto:${hrAdvisorEmail}`}>
                        {hrAdvisorEmail}
                      </Link>
                    ) : (
                      intl.formatMessage(commonMessages.notApplicable)
                    )
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
                  title={intl.formatMessage(commonMessages.status)}
                  content={
                    status?.label
                      ? getLocalizedName(status.label, intl)
                      : intl.formatMessage(commonMessages.notApplicable)
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

const ViewSearchRequest_SearchRequestFragment = graphql(/* GraphQL */ `
  fragment ViewSearchRequest_SearchRequest on PoolCandidateSearchRequest {
    id
    fullName
    email
    department {
      id
      departmentNumber
      name {
        en
        fr
      }
    }
    jobTitle
    managerJobTitle
    hrAdvisorEmail
    positionType {
      value
      label {
        en
        fr
      }
    }
    reason {
      value
      label {
        en
        fr
      }
    }
    wasEmpty
    additionalComments
    poolCandidateFilter {
      id
      classifications {
        id
        name {
          en
          fr
        }
        group
        level
      }
      hasDiploma
      equity {
        hasDisability
        isIndigenous
        isVisibleMinority
        isWoman
      }
      languageAbility {
        value
        label {
          en
          fr
        }
      }
      operationalRequirements {
        value
        label {
          en
          fr
        }
      }
      workRegions {
        value
        label {
          en
          fr
        }
      }
      pools {
        id
        name {
          en
          fr
        }
        classification {
          id
          group
          level
        }
        workStream {
          id
          name {
            en
            fr
          }
        }
      }
    }
    requestedDate
    status {
      value
      label {
        en
        fr
      }
    }
    statusChangedAt
    adminNotes
    applicantFilter {
      id
      hasDiploma
      equity {
        hasDisability
        isIndigenous
        isVisibleMinority
        isWoman
      }
      languageAbility {
        value
        label {
          en
          fr
        }
      }
      operationalRequirements {
        value
        label {
          en
          fr
        }
      }
      locationPreferences {
        value
        label {
          en
          fr
        }
      }
      positionDuration
      skills {
        id
        key
        name {
          en
          fr
        }
        category {
          value
          label {
            en
            fr
          }
        }
      }
      pools {
        id
        name {
          en
          fr
        }
        workStream {
          id
          name {
            en
            fr
          }
        }
        classification {
          id
          group
          level
        }
      }
      qualifiedClassifications {
        id
        name {
          en
          fr
        }
        group
        level
      }
      workStreams {
        id
        name {
          en
          fr
        }
      }
      community {
        id
        key
        name {
          en
          fr
        }
      }
    }
  }
`);

const pageTitle = defineMessage({
  defaultMessage: "Request",
  id: "WYJnLs",
  description: "Heading displayed above the single search request component.",
});

interface SingleSearchRequestProps {
  searchRequestQuery: FragmentType<
    typeof ViewSearchRequest_SearchRequestFragment
  >;
}

export const ViewSearchRequest = ({
  searchRequestQuery,
}: SingleSearchRequestProps) => {
  const intl = useIntl();
  const routes = useRoutes();
  const locale = getLocale(intl);
  const searchRequest = getFragment(
    ViewSearchRequest_SearchRequestFragment,
    searchRequestQuery,
  );
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

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.talentRequests),
        url: routes.searchRequestTable(),
      },
      {
        label: `${fullName} - ${getLocalizedName(department?.name, intl)}`,
        url: routes.searchRequestView(id),
      },
    ],
  });

  const formattedPageTitle = intl.formatMessage(pageTitle);
  const subTitle = intl.formatMessage(
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
  );

  const abstractFilter = applicantFilter ?? poolCandidateFilter;

  return (
    <>
      <SEO title={formattedPageTitle} description={subTitle} />
      <Hero
        title={formattedPageTitle}
        subtitle={subTitle}
        crumbs={navigationCrumbs}
      />
      <Container className="mt-18">
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
              defaultMessage: "Request information",
              id: "/3mqz9",
              description:
                "Heading for the request information section of the single search request view.",
            })}
          </Heading>
          <div
            data-h2-background-color="base(foreground)"
            data-h2-radius="base(rounded)"
            data-h2-shadow="base(larger)"
            data-h2-padding="base(x1)"
          >
            <FilterBlock
              title={intl.formatMessage({
                defaultMessage: "Reason for talent request",
                id: "enffKD",
                description: "Label for the reason for submitting the request.",
              })}
              content={getLocalizedName(reason?.label, intl, true)}
            />
            <Separator space="sm" data-h2-margin-top="base(0)" />
            <SearchRequestFilters filters={abstractFilter} />
            <div
              data-h2-padding="base(x1, 0, 0, 0)"
              data-h2-border-top="base(1px solid black.2)"
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
                      positionType?.label
                        ? getLocalizedName(positionType.label, intl)
                        : intl.formatMessage(adminMessages.noneProvided)
                    }
                  />
                </div>
              </div>
              <FilterBlock
                title={intl.formatMessage(
                  talentRequestMessages.additionalComments,
                )}
                content={additionalComments}
              />
            </div>
          </div>
        </div>
      </Container>
      <Container size="full">
        <Heading level="h2" size="h4">
          {intl.formatMessage({
            defaultMessage: "Candidate results",
            id: "bQ4iDW",
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
      </Container>
      <Container className="mb-18">
        <UpdateSearchRequest initialSearchRequest={searchRequest} />
      </Container>
    </>
  );
};

const ViewSearchRequest_Query = graphql(/* GraphQL */ `
  query ViewSearchRequest($id: ID!) {
    poolCandidateSearchRequest(id: $id) {
      ...ViewSearchRequest_SearchRequest
    }
  }
`);

const ViewSearchRequestApi = ({
  searchRequestId,
}: {
  searchRequestId: string;
}) => {
  const intl = useIntl();
  const [{ data: searchRequestData, fetching, error }] = useQuery({
    query: ViewSearchRequest_Query,
    variables: { id: searchRequestId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {searchRequestData?.poolCandidateSearchRequest ? (
        <ViewSearchRequest
          searchRequestQuery={searchRequestData.poolCandidateSearchRequest}
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
