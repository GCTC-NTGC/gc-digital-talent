import string
import random
from locust import HttpUser, task, between

class TestSearchPage(HttpUser):
    @task
    def candidate_count(self):
        query = """
query CandidateCount($where: ApplicantFilterInput) {
  countApplicantsForSearch(where: $where)
  countPoolCandidatesByPool(where: $where) {
    pool {
      id
      ...SearchResultCard_Pool
      __typename
    }
    candidateCount
    __typename
  }
}
fragment SearchResultCard_Pool on Pool {
  id
  workStream {
    id
    name {
      en
      fr
      __typename
    }
    __typename
  }
  publishingGroup {
    value
    label {
      en
      fr
      __typename
    }
    __typename
  }
  classification {
    group
    level
    __typename
  }
  name {
    en
    fr
    __typename
  }
  department {
    id
    name {
      en
      fr
      __typename
    }
    __typename
  }
  community {
    name {
      localized
      __typename
    }
    __typename
  }
  poolSkills(type: ESSENTIAL) {
    id
    type {
      value
      label {
        en
        fr
        __typename
      }
      __typename
    }
    skill {
      id
      name {
        en
        fr
        __typename
      }
      description {
        en
        fr
        __typename
      }
      category {
        value
        label {
          en
          fr
          __typename
        }
        __typename
      }
      key
      __typename
    }
    __typename
  }
  __typename
}
        """
        variables = """
{"where":{"pools":[]}}
        """
        headerDict={}
        # headerDict['authorization'] = 'Bearer ...'

        cookieDict={}
        # cookieDict['key'] = 'value'

        response = self.client.post(
            "/graphql",
            name="GraphQL",
            json={
                "query": query,
                "variables": variables,
            },
            headers=headerDict,
            cookies=cookieDict
        )

        # print (response.text)
