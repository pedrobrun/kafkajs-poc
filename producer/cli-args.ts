import yargs from "yargs"

export const parseArguments = async (args: string[]) => {
  return await yargs(args).options({
    topic: {
      type: 'string',
      default: 'default-topic',
      describe: 'The Kafka topic to send messages to',
    },
    messages: { type: 'array', default: [], describe: 'Messages to send' },
  }).argv
}