import { Kafka, KafkaMessage } from 'kafkajs'
import { kafkaInstance } from '..'
import { getTopics } from '../topics'
import { parseConsumerArguments } from './cli-args'
import { hideBin } from 'yargs/helpers'

const SLEEP_DURATION = 1000 // ms
const MAX_RETRIES = 3

const retryIfThrowsException = async (
  callback: () => void | Promise<void>,
  maxRetries: number
) => {
  for (let tries = 0; tries < maxRetries; tries++) {
    try {
      console.log(`Is retrying for the ${tries} time...`)
      await new Promise((resolve) => setTimeout(resolve, SLEEP_DURATION))
      await callback()
      return true // Success, exit the function
    } catch (e: any) {
      console.error(
        `Retry ${tries + 1}/${maxRetries} failed. Error: ${e.message}`
      )
      if (tries === maxRetries - 1) {
        console.error('Max retries reached. Failing...')
        throw e // Rethrow the error after max retries
      }
    }
  }
}

const processMessage = ({
  topic,
  partition,
  message,
}: {
  topic: string
  partition: number
  message: KafkaMessage
}) => {
  console.log()
  console.log('------- CONSUMER THAT THROWS GRACEFULLY -------')
  console.log(
    `Consuming message from topic ${topic} and partition ${partition}`
  )
  console.log(`Message key: ${message.key?.toString()}`)
  console.log(`Message value: ${message.value?.toString()}`)
  console.log("Will throw...")
  throw new Error('Consumer threw error')
}

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
      try {
        await retryIfThrowsException(
          () => processMessage({ topic, partition, message }),
          MAX_RETRIES
        )
      } catch (error) {
        console.error('Failed to process message after max retries:', error)
        // Handle the failure, e.g., log it, send it to a dead letter queue, etc.
      }
    },
  })
}

startConsumerThatThrows(kafkaInstance)
