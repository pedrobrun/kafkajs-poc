import { Kafka } from 'kafkajs'

export const kafkaInstance = new Kafka({
  clientId: 'my-poc',
  brokers: ['localhost:9092']
})
