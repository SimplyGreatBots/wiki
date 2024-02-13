import { IntegrationDefinition } from '@botpress/sdk'
import * as constants from './src/const'
import z from 'zod'

export default new IntegrationDefinition({
  name: constants.INTEGRATION_NAME,
  version: '0.2.0',
  description: 'This integration allows you to use Wikipedia.',
  icon: 'icon.svg',
  configuration: {
    schema: z.object({})
  },
  channels: {},
  actions: {
    searchPages: {
      title: 'Search Pages',
      description: 'Searches wikipedia for pages containing the given search terms.',
      input: {
        schema: constants.searchContentInputSchema
      },
      output: {
        schema: constants.searchContentOutputSchema
      },
    },
    getPage: {
      title: 'Get Page',
      description: 'Returns a wiki page from a title.',
      input: {
        schema: constants.pageInputSchema
      },
      output: {
        schema: constants.pageOutputSchema
      }
    },
    getPageContent: {
      title: 'Get Page Content',
      description: 'Returns the text content (headers and paragraphs) of a wiki page from a specified Wikimedia project.',
      input: {
        schema: constants.pageInputSchema
      },
      output: {
        schema: z.object({
          content: z.array(constants.tableRowSchema)
        }),
      },
    }
  }
})
