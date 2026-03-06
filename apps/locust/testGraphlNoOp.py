import string
import random
import time
from locust import HttpUser, task, between

class TestGraphqlNoOp(HttpUser):
    @task
    def candidate_count(self):
        headerDict={}
        # headerDict['authorization'] = 'Bearer ...'

        cookieDict={}
        # cookieDict['key'] = 'value'

        response = self.client.post(
            "/graphql",
            name="GraphQL",
            json={
                "query": """
                  query NoOp {
                    __typename
                  },
                """,
                "variables": "",
            },
            headers=headerDict,
            cookies=cookieDict
        )

        # print (response.text)
