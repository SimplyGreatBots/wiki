import * as botpress from '.botpress'
import * as cheerio from 'cheerio'
import axios from 'axios'
import { searchContentOutputSchema, pageOutputSchema, wikiPageEmpty, BotLogger, TableRow } from 'src/const'

const baseUrl = 'https://api.wikimedia.org/core/v1/'

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

export const searchWikiPages: botpress.IntegrationProps['actions']['searchPages'] = async ({ input, logger }) => {
  const url = `${baseUrl}${input.project}/${input.language}/search/page?q=${encodeURIComponent(input.q)}&limit=${input.limit}`
  try {
    const response = await axios.get(url)
    const rawData = response.data

    const validationResult = searchContentOutputSchema.safeParse(rawData)
    if (!validationResult.success) {
      logger.forBot().error('Validation Failed:', validationResult.error)
      return searchContentOutputSchema.parse({ pages: [] })
    }
    return validationResult.data

  } catch (error) {
    handleAxiosError(error, logger)
    return searchContentOutputSchema.parse({ pages: [] })
  }
}

export const getWikiPage: botpress.IntegrationProps['actions']['getPage'] = async ({ input, logger }) => {

  const url = `${baseUrl}${input.project}/${input.language}/page/${input.title}/bare`;

  try {
    const response = await axios.get(url)
    const rawData = response.data

    const validationResult = pageOutputSchema.safeParse(rawData)

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

export const getPageContent: botpress.IntegrationProps['actions']['getPageContent'] = async ({ input, logger }) => {
  // Validate input parameters
  if (!input.project || !input.language || !input.title) {
    logger.forBot().error('Missing required input parameters');
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
    const response = await axios.get(url, { params });

    // Extract HTML content from the response
    const htmlContent = response.data.parse?.text['*'] || '';

    // Process the HTML content to format it as described (rows with Page, Header, Paragraph)
    const content = processWikiContent(input.title, htmlContent)
    return { content }

  } catch (error) {
    handleAxiosError(error, logger);
    return { content: [] }
  }
}

const processWikiContent = (pageTitle: string, htmlContent: string): TableRow[] => {
  const $ = cheerio.load(htmlContent)
  const tableRows: TableRow[] = []
  let currentHeader = ''

  $('h1, h2, h3, h4, h5, h6, p').each((_, el) => {
    if ($(el).is('h1, h2, h3, h4, h5, h6')) {
      // New header found, update the currentHeader variable
      currentHeader = $(el).text()
    } else {
      // Paragraph element, create rows
      const paragraphText = $(el).text()
      const maxChars = 3500 - (pageTitle.length + currentHeader.length + 100); // Adjust for overhead
      for (let i = 0; i < paragraphText.length; i += maxChars) {
        const chunk = paragraphText.substring(i, i + maxChars)
        tableRows.push({
          Page: pageTitle,
          Header: currentHeader,
          Content: chunk,
        })
      }
    }
  })

  return tableRows // Return the accumulated rows after processing
}
