import time
import subprocess
from google.cloud import pubsub_v1
import json
from google.auth import jwt

# TODO 수정
PROJECT_ID = 'gc-automation-test'
SUB = f'projects/{PROJECT_ID}/subscriptions/my-sub'
TIMEOUT=None


def auth():
    service_account_info = json.load(
        open("C:/dev/remotePC_batchfiles/pubsub/google_pubsub_test/gc-automation-test-f24699f8af05.json"))
    audience = "https://pubsub.googleapis.com/google.pubsub.v1.Subscriber"
    credentials = jwt.Credentials.from_service_account_info(
        service_account_info, audience=audience
    )
    return credentials

def sub():

    def callback(message):
       # service_logic(message.data)
        message.ack()
        d_msg=message.data.decode()
        print(d_msg)
        
        if d_msg == 'selenium-mw':
            subprocess.call([r'C:/dev/remotePC_batchfiles/main.bat'])
        else:
            pass

    subscriber_audience = "https://pubsub.googleapis.com/google.pubsub.v1.Subscriber"  
    with pubsub_v1.SubscriberClient(credentials=auth().with_claims(audience=subscriber_audience)) as subscriber:
        future = subscriber.subscribe(SUB, callback)
        try:
            future.result(timeout=TIMEOUT)
        except:
            future.cancel()

def main():
    # while True:
        sub()
        # time.sleep(5)


if __name__ == '__main__':
    main()