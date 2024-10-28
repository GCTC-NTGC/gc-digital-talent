import string
import random
import time
from locust import HttpUser, task, between

class TestUser(HttpUser):
    host = "http://webserver:8080"

    @task
    def getSkills(self):
        query = """
            query WhoAmI {
                me { id }
            }
        """

        headerDict={}
        # headerDict['authorization'] = 'Bearer ...'

        cookieDict={}
        cookieDict['ai_user'] = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(10))

        self.client.post(
            "/graphql",
            name="GraphQL",
            json={"query": query },
            headers=headerDict,
            cookies=cookieDict
        )
