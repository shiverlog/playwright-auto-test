from google.cloud import pubsub_v1
from gcp_credential import auth




# TODO 수정
PROJECT_ID = 'gcp-dev-uhdc-id'
# TOPIC_ID=f'projects/{PROJECT_ID}/topics/qa-test'
TOPIC_ID='qa-test'
publisher_audience = "https://pubsub.googleapis.com/google.pubsub.v1.Publisher"
CREDENTAILS = auth().with_claims(audience=publisher_audience)



def pub():
    publisher = pubsub_v1.PublisherClient(credentials=CREDENTAILS)
    topic_path=publisher.topic_path(PROJECT_ID, TOPIC_ID)

   
    # 테스트 환경에 따라 젠킨스 JOB 분리 예정
    message = 'selenium-mw'
    # message = 'selenium-pc'
    # message = 'appium_aos'
    # message = 'appium-ios'
    # message = 'test2'
   
   
    os='win'
    future = publisher.publish(
        topic_path, message.encode(), os=os)

    future.result()


def main():
   pub()

if __name__ == '__main__':
    main()