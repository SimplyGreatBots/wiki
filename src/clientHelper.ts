import * as constants from './const'
import axios from 'axios'
import * as cheerio from 'cheerio'

export const handleAxiosError = (error: unknown, logger: constants.BotLogger) => {
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
export const processWikiContent = (pageTitle: string, htmlContent: string): constants.TWikiParagraph[] => {
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
