import { Kafka, Message } from 'kafkajs'
import { kafkaInstance } from '..'

import { hideBin } from 'yargs/helpers'
import { parseArguments } from './cli-args'

const startProducer = async (kafka: Kafka) => {
  const producer = kafka.producer()
  await producer.connect()

  console.log('Producer connected successfully')

  const args = await parseArguments(hideBin(process.argv))

  if (!args.topic) {
    console.log('No topic sent')
    await producer.disconnect()
    return
  }
  if (args.messages.length === 0) {
    console.log(
      'No messages to send. Provide messages as command line arguments.'
    )
    await producer.disconnect()
    return
  }

  const messages: Message[] = args.messages.map((msg) => ({ value: msg.toString() }))

  await producer.send({
    topic: args.topic,
    messages,
  })

  console.log('Topic:', args.topic)
  console.log(
    'Messages sent:',
    messages.map((msg) => msg.value)
  )
  await producer.disconnect()
}

startProducer(kafkaInstance)
