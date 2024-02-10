import * as botpress from '.botpress'
import axios from 'axios';
import { searchContentSchema, wikiPageSchema, wikiPageEmpty, BotLogger } from 'src/const'

const baseUrl = 'https://api.wikimedia.org/core/v1'

function handleAxiosError(error: unknown, logger: BotLogger) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // HTTP response status code is in the 2xx range
      logger.forBot().error(`Error: ${error.response.status} ${error.response.statusText}`);
    } else if (error.request) {
      // The request was made but no response was received
      logger.forBot().error('No response received', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      logger.forBot().error('Request Failed', error.message);
    }
  } else {
    // For non-Axios errors
    logger.forBot().error('Operation Failed', error instanceof Error ? error.message : String(error));
  }
}

export const searchWikiPages: botpress.IntegrationProps['actions']['searchWikiPages'] = async ({ input, logger }) => {
  const url = `${baseUrl}${input.project}/${input.language}/search/page?q=${encodeURIComponent(input.q)}&limit=${input.limit}`
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
    handleAxiosError(error, logger)
    return searchContentSchema.parse({ pages: [] })
  }
}

export const getWikiPage: botpress.IntegrationProps['actions']['getWikiPage'] = async ({ input, logger }) => {

  const url = `${baseUrl}${input.project}/${input.language}/page/${input.title}/bare`;

  try {
    const response = await axios.get(url)
    const rawData = response.data

    const validationResult = wikiPageSchema.safeParse(rawData)

    if (!validationResult.success) {
      logger.forBot().error('Validation Failed:', validationResult.error);
      return wikiPageEmpty
    }
    return validationResult.data

  } catch (error) {
    handleAxiosError(error, logger)
    return wikiPageEmpty
    }
}