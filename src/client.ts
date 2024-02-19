import * as botpress from '.botpress'
import * as constants from './const'
import * as clientHelper from './clientHelper'
import axios from 'axios'

export const searchContent: botpress.IntegrationProps['actions']['searchContent'] = async ({ input, logger }) => {
  const url = `https://api.wikimedia.org/core/v1/${input.project}/${input.language}/search/page?q=${encodeURIComponent(input.q)}&limit=${input.limit}`
  try {
    const response = await axios.get(url)
    const rawData = response.data

    const validationResult = constants.searchOutputSchema.safeParse(rawData)
    if (!validationResult.success) {
      logger.forBot().error('Validation Failed:', validationResult.error)
      return constants.searchOutputSchema.parse({ pages: [] })
    }
    return validationResult.data

  } catch (error) {
    clientHelper.handleAxiosError(error, logger)
    return constants.searchOutputSchema.parse({ pages: [] })
  }
}
export const searchTitle: botpress.IntegrationProps['actions']['searchTitle'] = async ({ input, logger }) => {
  const url = `https://api.wikimedia.org/core/v1/${input.project}/${input.language}/search/title?q=${encodeURIComponent(input.q)}&limit=${input.limit}`
  logger.forBot().info('Search Title Initiated')
  try {
    const response = await axios.get(url)
    const rawData = response.data

    const validationResult = constants.searchOutputSchema.safeParse(rawData)
    if (!validationResult.success) {
      logger.forBot().error('Validation Failed:', validationResult.error)
      return constants.searchOutputSchema.parse({ pages: [] })
    }
    logger.forBot().info('Validation Passed:', validationResult.data)
    return validationResult.data

  } catch (error) {
    clientHelper.handleAxiosError(error, logger)
    return constants.searchOutputSchema.parse({ pages: [] })
  }
}
export const getPage: botpress.IntegrationProps['actions']['getPage'] = async ({ input, logger }) => {

  const url = `https://api.wikimedia.org/core/v1/${input.project}/${input.language}/page/${input.title}/bare`

  try {
    const response = await axios.get(url)
    const rawData = response.data

    const validationResult = constants.pageOutputSchema.safeParse(rawData)

    if (!validationResult.success) {
      logger.forBot().error('Validation Failed:', validationResult.error)
      return constants.wikiPageEmpty
    }
    return validationResult.data

  } catch (error) {
    clientHelper.handleAxiosError(error, logger)
    return constants.wikiPageEmpty
    }
}
export const getPageContent: botpress.IntegrationProps['actions']['getPageContent'] = async ({ input, logger }) => {

  if (!input.project || !input.language || !input.title) {
    logger.forBot().error('Error: Missing required input parameters')
    return { content: [] }
  }

  const url = `https://${input.language}.${input.project}.org/w/api.php`;
  const params = {
    action: 'parse',
    page: input.title,
    format: 'json',
  }

  try {
    const response = await axios.get(url, { params })

    const htmlContent = response.data.parse?.text['*'] || ''

    const content = clientHelper.processWikiContent(input.title, htmlContent)
    return { content }

  } catch (error) {
    clientHelper.handleAxiosError(error, logger)
    return { content: [] }
  }
}
export const getFeaturedArticle: botpress.IntegrationProps['actions']['getFeaturedArticle'] = async ({ input, logger }) => {

  const url = `https://api.wikimedia.org/feed/v1/wikipedia/${input.language}/featured/${input.year}/${input.month}/${input.day}`

  if (!input.day || !input.month || !input.year || !input.language) {
    logger.forBot().error('Missing required input parameters')
    return constants.tfaEmpty
  }

  try {
    const response = await axios.get(url)

    if (response.status < 200 || response.status > 299) {
      logger.forBot().error(`HTTP error! Status: ${response.status}`)
      return constants.tfaEmpty
    }

    const validationResult = constants.tfaSchema.safeParse(response.data)

    if (!validationResult.success) {
      logger.forBot().error('Validation Failed:', validationResult.error)
      return constants.tfaEmpty
    }
    return validationResult.data

  } catch (error) {
    clientHelper.handleAxiosError(error, logger)
    return constants.tfaEmpty
  }
}
export const getOnThisDay: botpress.IntegrationProps['actions']['getOnThisDay'] = async ({ input, logger }) => {

    const url = `https://api.wikimedia.org/feed/v1/wikipedia/${input.language}/onthisday/${input.type}/${input.month}/${input.day}`

    if (!input.day || !input.month || !input.language) {
      logger.forBot().error('Missing required input parameters')
      return constants.onThisDayEmpty
    }
  
    try {
      const response = await axios.get(url)
  
      if (response.status < 200 || response.status > 299) {
        logger.forBot().error(`HTTP error! Status: ${JSON.stringify(response.status)}`)
        return constants.onThisDayEmpty
      }

      const validationResult = constants.onThisDayOutputSchema.safeParse(response.data)

      if (!validationResult.success) {
        logger.forBot().error('Validation Failed:', validationResult.error)
        return constants.onThisDayEmpty
      }
      return validationResult.data
  
    } catch (error) {
      clientHelper.handleAxiosError(error, logger)
      return { events: [] }
    }
}