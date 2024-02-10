import * as botpress from '.botpress'
import axios from 'axios';
import { searchContentSchema, wikiPageSchema } from 'src/const'

export const searchWikiPages: botpress.IntegrationProps['actions']['searchWikiPages'] = async ({ input, logger }) => {
  const url = `https://api.wikimedia.org/core/v1/${input.project}/${input.language}/search/page?q=${encodeURIComponent(input.q)}&limit=${input.limit}`
  try {
    const response = await axios.get(url)
    const rawData = response.data

    const validationResult = searchContentSchema.safeParse(rawData)
    if (!validationResult.success) {
      logger.forBot().error('Validation Failed:', validationResult.error)
      return searchContentSchema.parse({ pages: [] })
    }

    return validationResult.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        logger.forBot().error(`Error: ${error.response.status} ${error.response.statusText}`)
      } else if (error.request) {
        logger.forBot().error('No response received:', error.request)
      } else {
        logger.forBot().error('Search Failed:', error.message)
      }
    } else {
      logger.forBot().error('Search Failed:', error instanceof Error ? error.message : String(error))
    }
    return searchContentSchema.parse({ pages: [] })
  }
}

export const getWikiPage: botpress.IntegrationProps['actions']['getWikiPage'] = async ({ input, logger }) => {
  const url = `https://api.wikimedia.org/core/v1/${input.project}/${input.language}/page/${input.title}/bare`;

  try {
    const response = await axios.get(url)
    const rawData = response.data

    const validationResult = wikiPageSchema.safeParse(rawData)

    if (!validationResult.success) {
      logger.forBot().error('Validation Failed:', validationResult.error);
      return {
        id: -1,
        key: '',
        title: '',
        latest: {
          id: -1,
          timestamp: '',
        },
        content_model: null,
        license: {
          url: '',
          title: null,
        },
        html_url: ''
      }
    }

    return validationResult.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        logger.forBot().error(`Error: ${error.response.status} ${error.response.statusText}`);
      } else if (error.request) {
        logger.forBot().error('No response received:', error.request);
      } else {
        logger.forBot().error('Search Failed:', error.message);
      }
    } else {
      logger.forBot().error('Search Failed:', error instanceof Error ? error.message : String(error));
    }
    return {
        id: -1,
        key: '',
        title: '',
        latest: {
          id: -1,
          timestamp: '',
        },
        content_model: null,
        license: {
          url: '',
          title: null,
        },
      html_url: ''
      }
    };
}
