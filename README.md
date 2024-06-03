# KafkaJS POC

This POC contains boilerplate to test a few Kafka fundamentals and validate some things with KafkaJS.
The main things I wanted to test here when creating this v1 for the POC were:
- Mechanisms for retry when a consumer throws an error in the middle of consuming a message.
- What happens if a consumer completely crashes/dies instead of just throwing? What happens to the message that was being processed when it crashed?

## Commands:

```bash
# produce messages
$ yarn start:producer --topic "your-topic" --messages "hello world" "another msg" "123 321"

# start 'healthy' consumer
$ yarn start:consumer --topic "your-topic" --group "my-poc-group"

# start consumer that throws an error when consuming messages
$ yarn start:consumer:throw --topic "your-topic" --group "my-poc-group"

# start consumer that crashes when consuming messages
$ yarn start:consumer:crash --topic "test-topic" --group "my-poc-group"
```