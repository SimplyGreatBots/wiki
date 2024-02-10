import { IntegrationDefinition } from '@botpress/sdk'
import { INTEGRATION_NAME, searchContentSchema, wikiPageSchema } from './src/const'
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
    searchWikiPages: {
      title: 'Search Wiki Pages',
      description: 'Searches wiki pages for the given search terms and returns matching pages.',
      input: {
        schema: z.object({
          project: z.string().describe('Project name, e.g., wikipedia, commons, wiktionary.'),
          language: z.string().describe('Language code, e.g., en for English, es for Spanish. Note: Prohibited for commons and other multilingual projects.'),
          q: z.string().describe('Search terms.'),
          limit: z.number().min(1).max(100).default(50).optional().describe('Maximum number of search results to return. Default is 50.')
        }),
      },
      output: {
        schema: searchContentSchema
      },
    },
    getWikiPage: {
      title: 'Get Wiki Page',
      description: 'Returns a wiki page from a title.',
      input: {
        schema: z.object({
          project: z.string().describe('Project name, e.g., wikipedia, commons, wiktionary.'),
          language: z.string().describe('Language code, e.g., en for English, es for Spanish. Note: Prohibited for commons and other multilingual projects.'),
          title: z.string().describe('Title of the wiki page. Must be exact name.'),
        })
      },
      output: {
        schema: wikiPageSchema
      }
    }
  }
})
