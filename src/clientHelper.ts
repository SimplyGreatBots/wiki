import * as constants from './const'
import * as cheerio from 'cheerio'

export const handleWikiError = (error: any, logger: constants.BotLogger, emptyData: any) => {

  // Handle known error
  if (error.response && error.response.data) {
    const parsedError = constants.errorSchemas.safeParse(error.response.data)

    if (parsedError.success) {
      const errorMessage = `Error: ${JSON.stringify(parsedError.data)}`
      logger.forBot().error(errorMessage)
      return { success: false, log: errorMessage, data: emptyData }

    } else {
      logger.forBot().error(`Unhandled Axios Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`)
      return { success: false, log: 'Unhandled error', data: emptyData }
    }
  }

  // Handle uknown error
  logger.forBot().error(`Unhandled Error`)
  return { success: false, log: 'Unhandled error', data: emptyData }
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
