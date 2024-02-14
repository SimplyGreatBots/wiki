import * as botpress from '.botpress'
import * as cheerio from 'cheerio'
import * as constants from './const'
import axios from 'axios'

const baseUrl = 'https://api.wikimedia.org/core/v1/'

function handleAxiosError(error: unknown, logger: constants.BotLogger) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // HTTP response status code is in the 2xx range
      logger.forBot().error(`Error: ${error.response.status} ${error.response.statusText}`)
    } else if (error.request) {
      // The request was made but no response was received
      logger.forBot().error('No response received', error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      logger.forBot().error('Request Failed', error.message)
    }
  } else {
    // For non-Axios errors
    logger.forBot().error('Operation Failed', error instanceof Error ? error.message : String(error))
  }
}

export const findPages: botpress.IntegrationProps['actions']['findPages'] = async ({ input, logger }) => {
  const url = `${baseUrl}${input.project}/${input.language}/search/page?q=${encodeURIComponent(input.q)}&limit=${input.limit}`
  try {
    const response = await axios.get(url)
    const rawData = response.data

    const validationResult = constants.searchContentOutputSchema.safeParse(rawData)
    if (!validationResult.success) {
      logger.forBot().error('Validation Failed:', validationResult.error)
      return constants.searchContentOutputSchema.parse({ pages: [] })
    }
    return validationResult.data

  } catch (error) {
    handleAxiosError(error, logger)
    return constants.searchContentOutputSchema.parse({ pages: [] })
  }
}

export const getPage: botpress.IntegrationProps['actions']['getPage'] = async ({ input, logger }) => {

  const url = `${baseUrl}${input.project}/${input.language}/page/${input.title}/bare`

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
    handleAxiosError(error, logger)
    return constants.wikiPageEmpty
    }
}

export const getPageContent: botpress.IntegrationProps['actions']['getPageContent'] = async ({ input, logger }) => {
  // Validate input parameters
  if (!input.project || !input.language || !input.title) {
    logger.forBot().error('Missing required input parameters')
    return { content: [] }; // Return an empty array to indicate no content was processed
  }

  // Prepare API request
  const url = `https://${input.language}.${input.project}.org/w/api.php`;
  const params = {
    action: 'parse',
    page: input.title,
    format: 'json',
  }

  try {
    const response = await axios.get(url, { params })

    // Extract HTML content from the response
    const htmlContent = response.data.parse?.text['*'] || ''

    // Process the HTML content to format it as described (rows with Page, Header, Paragraph)
    const content = processWikiContent(input.title, htmlContent)
    return { content }

  } catch (error) {
    handleAxiosError(error, logger)
    return { content: [] }
  }
}

export const getFeaturedArticle: botpress.IntegrationProps['actions']['getFeaturedArticle'] = async ({ input, logger }) => {
  const url = `https://api.wikimedia.org/feed/v1/wikipedia/${input.language}/featured/${input.YYYY}/${input.MM}/${input.DD}`

  try {
    const response = await axios.get(url)

    if (response.status < 200 || response.status > 299) {
      logger.forBot().error(`HTTP error! Status: ${response.status}`)
    }

    logger.forBot().info("Okay Response from Wiki. Pulled the following data:", response)

    const data = response.data
    const tfa = data.tfa
    return tfa

  } catch (error) {
    logger.forBot().error("Error fetching featured content:", error)
  }
}

const processWikiContent = (pageTitle: string, htmlContent: string): constants.TWikiParagraph[] => {
  const $ = cheerio.load(htmlContent)
  const content: constants.TWikiParagraph[] = []
  let currentHeader = ''

  $('h1, h2, h3, h4, h5, h6, p').each((_, el) => {
    if ($(el).is('h1, h2, h3, h4, h5, h6')) {
      // New header found, update the currentHeader variable
      currentHeader = $(el).text()
    } else {
      // Paragraph element, directly create a row without chunking
      const paragraphText = $(el).text()
      content.push({
        Page: pageTitle,
        Header: currentHeader,
        Content: paragraphText,
      })
    }
  })

  return content
}
