import string
import random
import time
from locust import HttpUser, task, between

class TestAsset(HttpUser):
    @task
    def get_asset(self):
        response = self.client.get(
            "/assets/dnd-hero-card-D_30_yLp.webp",
        )

        # print (response.text)
