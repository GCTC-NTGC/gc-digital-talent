import os
import string
import random
from locust import HttpUser, task, between

# Comma-separated subs to sign in as, e.g. LOCUST_SUBS=applicant@test.com,admin@test.com
# Needs the API running with AUTH_PROVIDER=dummy. Leave unset to send requests anonymously.
# The API rate limit is per user, so use several subs for high load.
SUBS = [sub.strip() for sub in os.environ.get("LOCUST_SUBS", "").split(",") if sub.strip()]

class TestSearchPage(HttpUser):
    access_token = None

    def on_start(self):
        if not SUBS:
            return
        response = self.client.post(
            "/api/dummy-auth/token",
            name="Dummy auth token",
            json={"sub": random.choice(SUBS)},
        )
        response.raise_for_status()
        self.access_token = response.json()["access_token"]

    @task
    def candidate_count(self):
        query = """
query CountTalentRequestMatches($where: TalentRequestMatchFilterInput) {
  countTalentRequestMatches(where: $where)
  countTalentRequestMatchesByPool(where: $where) {
    pool {
      id
      ...SearchResultCard_Pool
      __typename
    }
    count
    __typename
  }
  countTalentRequestMatchesByCommunity(where: $where) {
    community {
      id
      name {
        localized
        __typename
      }
      __typename
    }
    qualifiedInPoolCount
    atLevelCount
    count
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
{"where":{"applicantFilter":{"pools":[]}}}
        """
        headerDict={}
        if self.access_token:
            headerDict['authorization'] = 'Bearer ' + self.access_token

        cookieDict={}
        cookieDict['ai_user'] = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(10))

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
