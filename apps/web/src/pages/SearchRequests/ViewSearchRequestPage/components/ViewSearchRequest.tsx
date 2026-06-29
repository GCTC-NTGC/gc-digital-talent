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
  Separator,
  Container,
  Card,
  Sidebar,
} from "@gc-digital-talent/ui";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import SearchRequestFilters from "~/components/SearchRequestFilters/SearchRequestFilters";
import useRoutes from "~/hooks/useRoutes";
import adminMessages from "~/messages/adminMessages";
import FilterBlock from "~/components/SearchRequestFilters/FilterBlock";
import SEO from "~/components/SEO/SEO";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import pageTitles from "~/messages/pageTitles";
import talentRequestMessages from "~/messages/talentRequestMessages";
import Hero from "~/components/Hero";
import { FlexibleWorkLocationOptions_Fragment } from "~/components/Profile/components/WorkPreferences/fragment";

import SingleSearchRequestTableApi from "./SearchRequestCandidatesTable";
import TalentRequestSidebar from "./TalentRequestSidebar";

const ViewSearchRequest_SearchRequestFragment = graphql(/* GraphQL */ `
  fragment ViewSearchRequest_SearchRequest on PoolCandidateSearchRequest {
    ...PoolCandidateSearchRequestSidebar

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
        group
        level
        groupAndLevel
        displayName
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
          groupAndLevel
          displayName
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
          localized
        }
      }
      flexibleWorkLocations {
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
          groupAndLevel
          displayName
        }
      }
      qualifiedInClassifications {
        id
        group
        level
        groupAndLevel
        displayName
      }
      qualifiedInWorkStreams {
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

export const TalentRequestOptions_Fragment = graphql(/** GraphQL */ `
  fragment TalentRequestOptions on Query {
    ...FlexibleWorkLocationOptionsFragment
    ...TalentRequestStatusOptions
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
  optionsQuery?: FragmentType<typeof TalentRequestOptions_Fragment>;
}

export const ViewSearchRequest = ({
  searchRequestQuery,
  optionsQuery,
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

  const options = getFragment(TalentRequestOptions_Fragment, optionsQuery);
  const locationOptionsData = getFragment(
    FlexibleWorkLocationOptions_Fragment,
    options,
  );
  const locationOptionsDataUnpacked = unpackMaybes(
    locationOptionsData?.flexibleWorkLocation,
  );

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
      <Container size="full" className="mt-18">
        <Sidebar.Wrapper scrollbar>
          <Sidebar.Sidebar scrollbar>
            <TalentRequestSidebar
              query={searchRequest}
              optionsQuery={options}
            />
          </Sidebar.Sidebar>
          <Sidebar.Content>
            {wasEmpty && (
              <p className="mb-6">
                {intl.formatMessage({
                  defaultMessage:
                    "This request did not result in any matches, let us know more about this in the comments field at the end of this form.",
                  id: "ruEs9/",
                  description:
                    "Message to admins that a search request resulted in no candidates being found",
                })}
              </p>
            )}
            <Heading level="h2" size="h4" className="mt-0">
              {intl.formatMessage({
                defaultMessage: "Request information",
                id: "/3mqz9",
                description:
                  "Heading for the request information section of the single search request view.",
              })}
            </Heading>
            <Card>
              <FilterBlock
                title={intl.formatMessage({
                  defaultMessage: "Reason for talent request",
                  id: "enffKD",
                  description:
                    "Label for the reason for submitting the request.",
                })}
                content={getLocalizedName(reason?.label, intl, true)}
              />
              <Separator space="sm" />
              <SearchRequestFilters
                filters={abstractFilter}
                flexibleWorkLocationOptions={locationOptionsDataUnpacked}
              />
              <Separator space="sm" />

              <div className="grid gap-6 sm:grid-cols-2">
                <FilterBlock
                  title={intl.formatMessage({
                    defaultMessage: "Position job title",
                    id: "OI7Bc7",
                    description: "Label for an opportunity's job title.",
                  })}
                  content={jobTitle}
                />
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
              <FilterBlock
                title={intl.formatMessage(
                  talentRequestMessages.additionalComments,
                )}
                content={additionalComments}
              />
            </Card>
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
                  description:
                    "Null state for a request not including a filter.",
                })}
              </>
            )}
          </Sidebar.Content>
        </Sidebar.Wrapper>
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

const ViewSearchRequestPageOptions_Query = graphql(/* GraphQL */ `
  query ViewSearchRequestPageOptions {
    ...TalentRequestOptions
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

  const [
    { data: optionsData, fetching: optionsFetching, error: optionsError },
  ] = useQuery({
    query: ViewSearchRequestPageOptions_Query,
  });

  return (
    <Pending
      fetching={fetching || optionsFetching}
      error={error ?? optionsError}
    >
      {searchRequestData?.poolCandidateSearchRequest ? (
        <ViewSearchRequest
          searchRequestQuery={searchRequestData.poolCandidateSearchRequest}
          optionsQuery={optionsData}
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
