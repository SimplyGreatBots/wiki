import * as botpress from '.botpress'
import * as constants from './const'
import * as clientHelper from './clientHelper'
import axios from 'axios'

const paramsError = 'Error! Missing required input parameters.'
const validationError = 'Returned an unexpected result format. See integration logger in dashboard for more information'

export const searchTitle: botpress.IntegrationProps['actions']['searchTitle'] = async ({ input, logger }) => {
  const url = `https://api.wikimedia.org/core/v1/${input.project}/${input.language}/search/title?q=${encodeURIComponent(input.q)}&limit=${input.limit}`

  if (!input.project || !input.language || !input.limit || !input.q) {
    logger.forBot().warn(paramsError)
    return { success: false, log: paramsError, data: constants.searchEmpty }
  }

  try {
    const response = await axios.get(url)
    const rawData = response.data

    const validationResult = constants.searchOutputSchema.safeParse(rawData)
    if (!validationResult.success) {
      logger.forBot().error('Validation Failed:', validationResult.error)
      return { success: false, log: validationError, data: constants.searchEmpty }
    }

    return { success: true, log: 'Successfully retrieved pages from title', data: validationResult.data }

  } catch (error) {
    return clientHelper.handleWikiError(error, logger, constants.searchEmpty)
  }
}

export const searchContent: botpress.IntegrationProps['actions']['searchContent'] = async ({ input, logger }) => {
  const url = `https://api.wikimedia.org/core/v1/${input.project}/${input.language}/search/page?q=${encodeURIComponent(input.q)}&limit=${input.limit}`

  if (!input.project || !input.language || !input.limit || !input.q) {
    logger.forBot().warn(paramsError)
    return { success: false, log: paramsError, data: constants.searchEmpty }
  }

  try {
    const response = await axios.get(url)
    const rawData = response.data

    const validationResult = constants.searchOutputSchema.safeParse(rawData)
    if (!validationResult.success) {
      logger.forBot().error('Validation Failed:', validationResult.error)
      return { success: false, log: validationError, data: constants.searchEmpty }
    }

    return { success: true, log: 'Successfully retrieved pages from content', data: validationResult.data}

  } catch (error) {
    return clientHelper.handleWikiError(error, logger, constants.searchEmpty)
  }
}

export const getPage: botpress.IntegrationProps['actions']['getPage'] = async ({ input, logger }) => {

  const url = `https://api.wikimedia.org/core/v1/${input.project}/${input.language}/page/${input.title}/bare`

  if (!input.project || !input.language || !input.title) {
    logger.forBot().warn(paramsError)
    return { success: false, log: paramsError, data: constants.pageEmpty }
  }

  try {
    const response = await axios.get(url)
    const rawData = response.data

    const validationResult = constants.pageOutputSchema.safeParse(rawData)

    if (!validationResult.success) {
      logger.forBot().error('Validation Failed:', validationResult.error)
      return { success: false, log: validationError, data: constants.pageEmpty }
    }
    return { success: true, log: 'Sucessully retrieved page from Title.', data: validationResult.data }

  } catch (error) {
    return clientHelper.handleWikiError(error, logger, constants.pageEmpty)
  }
}
export const getPageContent: botpress.IntegrationProps['actions']['getPageContent'] = async ({ input, logger }) => {

  if (!input.project || !input.language || !input.title) {
    logger.forBot().error('Error: Missing required input parameters')
    return { success: false, log: paramsError, data: constants.pageContentEmpty }
  }

  const url = `https://${input.language}.${input.project}.org/w/api.php`;
  const params = {
    action: 'parse',
    page: input.title,
    format: 'json',
  }

  try {
    const response = await axios.get(url, { params })
    const rawData = response.data

    logger.forBot().debug('Page Content:', rawData)

    // Check if returned no content
    const errorValidation = constants.noContentResultsErrorSchema.safeParse(rawData)
    if (errorValidation.success) {
      logger.forBot().warn('No content found for the given title')
      return { success: false, log: 'No content found for the given title', data: constants.pageContentEmpty }
    }

    // Check if returned content is valid
    const validationResult = constants.pageContentWikiSchema.safeParse(rawData)
    if (!validationResult.success) {
      logger.forBot().error('Validation Failed:', validationResult.error)
      return { success: false, log: validationError, data: constants.pageContentEmpty }
    }

    // Parse the HTML content for easier use
    const htmlContent = response.data.parse.text['*'] || ''
    const content  = clientHelper.processWikiContent(input.title, htmlContent)
    const pageContentOutput = {
      title: validationResult.data.parse.title,
      pageid: validationResult.data.parse.pageid,
      revid: validationResult.data.parse.revid,
      content
    }

    return { success: true, log: 'Successfully retrieved content.', data: pageContentOutput }

  } catch (error) {
    return clientHelper.handleWikiError(error, logger, constants.pageContentEmpty)
  }
}
export const getFeaturedArticle: botpress.IntegrationProps['actions']['getFeaturedArticle'] = async ({ input, logger }) => {

  const url = `https://api.wikimedia.org/feed/v1/wikipedia/${input.language}/featured/${input.year}/${input.month}/${input.day}`

  if (!input.day || !input.month || !input.year || !input.language) {
    logger.forBot().warn('Missing required input parameters')
    return { success: false, log: paramsError, data: constants.featuredArticleEmpty }
  }

  try {
    const response = await axios.get(url)
    const rawData = response.data

    logger.forBot().debug('Featured Article:', rawData)

    const validationResult = constants.featuredArticleOutputSchema.safeParse(rawData)
    if (!validationResult.success) {
      logger.forBot().error('Validation Failed:', validationResult.error)
      return { success: false, log: validationError, data: constants.featuredArticleEmpty }
    }

    return { success: true, log: 'Successully retrieved Featured Article', data: validationResult.data }

  } catch (error) {
    return clientHelper.handleWikiError(error, logger, constants.featuredArticleEmpty)
  }
}
export const getOnThisDay: botpress.IntegrationProps['actions']['getOnThisDay'] = async ({ input, logger }) => {

    const url = `https://api.wikimedia.org/feed/v1/wikipedia/${input.language}/onthisday/${input.type}/${input.month}/${input.day}`

    if (!input.day || !input.month || !input.language) {
      logger.forBot().warn('Missing required input parameters')
      return { success: false, log: paramsError, data: constants.onThisDayEmpty }
    }
  
    try {
      const response = await axios.get(url)
      const rawData = response.data

      const validationResult = constants.onThisDayOutputSchema.safeParse(rawData)

      if (!validationResult.success) {
        logger.forBot().error('Validation Failed:', validationResult.error)
        return { success: false, log: validationError, data: constants.onThisDayEmpty }
      }
      return { success: true, log: 'Successfully retrieved On This Day', data: validationResult.data }
  
    } catch (error) {
      return clientHelper.handleWikiError(error, logger, constants.onThisDayEmpty)
    }
}