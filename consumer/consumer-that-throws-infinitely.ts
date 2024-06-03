import { Kafka } from 'kafkajs'
import { kafkaInstance } from '..'
import { getTopics } from '../topics'
import { parseConsumerArguments } from './cli-args'
import { hideBin } from 'yargs/helpers'

const startConsumerThatThrows = async (kafka: Kafka) => {
  const args = await parseConsumerArguments(hideBin(process.argv))

  if (!args.topic) {
    console.log('No topic sent')
    return
  }
  if (!args.group) {
    console.log('No group sent')
    return
  }

  const consumer = kafka.consumer({
    groupId: args.group,
    retry: {
      retries: 3,
    },
  })

  const topics = await getTopics(kafka)
  if (!topics.find((t) => t === args.topic)) {
    console.log(`Topic ${args.topic} doesnt not exist`)
    return
  }

  await consumer.connect()

  console.log('Consumer connected successfully \n')
  await consumer.subscribe({ topic: args.topic })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log()
      console.log('------- CONSUMER THAT THROWS INFINITELY -------')
      console.log(
        `Consuming message from topic ${topic} and partition ${partition}`
      )
      console.log(`Message key: ${message.key?.toString()}`)
      console.log(`Message value: ${message.value?.toString()}`)
      console.log('Will throw...')
      throw new Error('Consumer threw error')
    },
  })
}

startConsumerThatThrows(kafkaInstance)
