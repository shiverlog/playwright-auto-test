import json

from google.auth import jwt


def auth():
    service_account_info = json.load(
        open("C:/dev/remotePC_batchfiles/pubsub/google_pubsub_test/service-account-punsub-key.json"))
    audience = "https://pubsub.googleapis.com/google.pubsub.v1.Subscriber"
    credentials = jwt.Credentials.from_service_account_info(
        service_account_info, audience=audience
    )
    return credentials