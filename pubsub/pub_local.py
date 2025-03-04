from google.cloud import pubsub_v1
from gcp_credential_local import auth

import sys

def main():
   pub(sys.argv[1])



# TODO 수정
PROJECT_ID = 'gc-automation-test'
TOPIC_ID='my-topic'
publisher_audience = "https://pubsub.googleapis.com/google.pubsub.v1.Publisher"
CREDENTAILS = auth().with_claims(audience=publisher_audience)



def pub(arg):
    publisher = pubsub_v1.PublisherClient(credentials=CREDENTAILS)
    topic_path=publisher.topic_path(PROJECT_ID, TOPIC_ID)

   
    # 테스트 환경에 따라 젠킨스 JOB 분리 예정
    # message = 'selenium-mw'
    # message = 'selenium-pc'
    # message = 'appium_aos'
    # message = 'appium-ios'

    print(arg)
   
   
    # future = publisher.publish(
    #     topic_path, message.encode())

    # future.result()


def main():
   pub(sys.argv[1])

if __name__ == '__main__':
    main()