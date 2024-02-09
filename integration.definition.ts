import { IntegrationDefinition } from '@botpress/sdk'
import { INTEGRATION_NAME } from './src/const'
import z from 'zod'

export default new IntegrationDefinition({
  name: INTEGRATION_NAME,
  version: '0.2.0',
  description: 'This integration allows you to use Wikipedia.',
  icon: 'icon.svg',
  configuration: {
    schema: z.object({})
  },
  channels: {},
  actions: {
  }
})
