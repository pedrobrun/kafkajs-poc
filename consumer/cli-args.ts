import yargs from "yargs"

export const parseConsumerArguments = async (args: string[]) => {
  return await yargs(args).options({
    topic: {
      type: 'string',
      describe: 'The Kafka topic to send messages to',
    },
    group: {
      type: 'string',
      describe: 'The group ID that the consumer belongs to',
    },
  }).argv
}