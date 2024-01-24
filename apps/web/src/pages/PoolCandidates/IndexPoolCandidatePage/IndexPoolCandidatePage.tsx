import React from "react";
import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { Pending } from "@gc-digital-talent/ui";
import {
  graphql,
  CandidateExpiryFilter,
  CandidateSuspendedFilter,
  Scalars,
} from "@gc-digital-talent/graphql";

import PoolCandidatesTable from "~/components/PoolCandidatesTable/PoolCandidatesTable";
import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import adminMessages from "~/messages/adminMessages";
import useRequiredParams from "~/hooks/useRequiredParams";

type RouteParams = {
  poolId: Scalars["ID"]["output"];
};

const IndexPoolCandidatePage_Query = graphql(/* GraphQL */ `
  query IndexPoolCandidatePage($id: UUID!) {
    me {
      id
      poolCandidates {
        id
        pool {
          id
        }
        submittedAt
      }
    }
    pool(id: $id) {
      id
      name {
        en
        fr
      }
      stream
      closingDate
      status
      language
      securityClearance
      classifications {
        id
        group
        level
        name {
          en
          fr
        }
        minSalary
        maxSalary
        genericJobTitles {
          id
          key
          name {
            en
            fr
          }
        }
      }
      yourImpact {
        en
        fr
      }
      keyTasks {
        en
        fr
      }
      whatToExpect {
        en
        fr
      }
      specialNote {
        en
        fr
      }
      essentialSkills {
        id
        key
        name {
          en
          fr
        }
        description {
          en
          fr
        }
        category
        families {
          id
          key
          description {
            en
            fr
          }
          name {
            en
            fr
          }
        }
      }
      nonessentialSkills {
        id
        key
        name {
          en
          fr
        }
        description {
          en
          fr
        }
        category
        families {
          id
          key
          description {
            en
            fr
          }
          name {
            en
            fr
          }
        }
      }
      isRemote
      location {
        en
        fr
      }
      stream
      processNumber
      publishingGroup
      screeningQuestions {
        id
        question {
          en
          fr
        }
      }
      team {
        id
        name
        contactEmail
        displayName {
          en
          fr
        }
      }
    }
  }
`);

export const IndexPoolCandidatePage = () => {
  const intl = useIntl();
  const { poolId } = useRequiredParams<RouteParams>("poolId");

  const pageTitle = intl.formatMessage(adminMessages.poolsCandidates);

  const [{ data, fetching, error }] = useQuery({
    query: IndexPoolCandidatePage_Query,
    variables: {
      id: poolId,
    },
  });

  return (
    <AdminContentWrapper>
      <SEO title={pageTitle} />
      <Pending fetching={fetching} error={error}>
        <p data-h2-margin="base(x1, 0)">
          {intl.formatMessage({
            defaultMessage:
              "This table shows a list of all applicants to this pool.",
            id: "0a8nPa",
            description:
              "Descriptive text about the list of pool candidates in the admin portal.",
          })}
        </p>
        <PoolCandidatesTable
          hidePoolFilter
          initialFilterInput={{
            applicantFilter: { pools: [{ id: poolId || "" }] },
            suspendedStatus: CandidateSuspendedFilter.Active,
            expiryStatus: CandidateExpiryFilter.Active,
          }}
          currentPool={data?.pool}
          title={pageTitle}
        />
      </Pending>
    </AdminContentWrapper>
  );
};

export default IndexPoolCandidatePage;
