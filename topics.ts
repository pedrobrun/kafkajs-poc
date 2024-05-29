import { ITopicConfig, Kafka } from "kafkajs"

export const getTopics = async (kafkaInstance: Kafka) => {
  const topics = await kafkaInstance.admin().listTopics()
  return topics
}

export const createTopic = async(kafkaInstance: Kafka, topic: ITopicConfig) => {
  return await kafkaInstance.admin().createTopics({
    topics: [topic]
  })
}