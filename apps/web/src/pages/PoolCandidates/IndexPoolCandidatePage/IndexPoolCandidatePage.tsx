import { defineMessage, useIntl } from "react-intl";
import { useQuery } from "urql";

import { Pending } from "@gc-digital-talent/ui";
import {
  graphql,
  CandidateExpiryFilter,
  CandidateSuspendedFilter,
  Scalars,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import PoolCandidatesTable from "~/components/PoolCandidatesTable/PoolCandidatesTable";
import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import adminMessages from "~/messages/adminMessages";
import useRequiredParams from "~/hooks/useRequiredParams";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

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
      stream {
        value
        label {
          en
          fr
        }
      }
      closingDate
      status {
        value
        label {
          en
          fr
        }
      }
      language {
        value
        label {
          en
          fr
        }
      }
      securityClearance {
        value
        label {
          en
          fr
        }
      }
      classification {
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
          key {
            value
            label {
              en
              fr
            }
          }
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
      poolSkills {
        id
        type {
          value
          label {
            en
            fr
          }
        }
        skill {
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
          category {
            value
            label {
              en
              fr
            }
          }
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
      }

      isRemote
      location {
        en
        fr
      }
      stream {
        value
        label {
          en
          fr
        }
      }
      processNumber
      publishingGroup {
        value
        label {
          en
          fr
        }
      }
      generalQuestions {
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

const subTitle = defineMessage({
  defaultMessage: "This table shows a list of all applicants to this process.",
  id: "Evn5Mo",
  description:
    "Descriptive text about the list of pool candidates in the admin portal.",
});

export const IndexPoolCandidatePage = () => {
  const intl = useIntl();
  const { poolId } = useRequiredParams<RouteParams>("poolId");

  const pageTitle = intl.formatMessage(adminMessages.poolCandidates);
  const formattedSubTitle = intl.formatMessage(subTitle);

  const [{ data, fetching, error }] = useQuery({
    query: IndexPoolCandidatePage_Query,
    variables: {
      id: poolId,
    },
  });

  return (
    <AdminContentWrapper>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Talent placement",
          id: "0YpfAG",
          description: "Title for candidates tab for a process",
        })}
        description={formattedSubTitle}
      />
      <Pending fetching={fetching} error={error}>
        <p data-h2-margin="base(x1, 0)">{formattedSubTitle}</p>
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

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PoolOperator, ROLE_NAME.RequestResponder]}>
    <IndexPoolCandidatePage />
  </RequireAuth>
);

Component.displayName = "AdminPoolCandidatePage";

export default IndexPoolCandidatePage;
