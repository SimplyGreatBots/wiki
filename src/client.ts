import * as botpress from '.botpress'
import * as cheerio from 'cheerio'
import axios from 'axios'
import { searchContentSchema, wikiPageSchema, wikiPageEmpty, BotLogger } from 'src/const'

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

export const getWikiPageContent: botpress.IntegrationProps['actions']['getWikiPageContent'] = async ({ input, logger }) => {
  // Validate input parameters
  if (!input.project || !input.language || !input.title) {
    logger.forBot().error('Missing required input parameters');
    return { rows: [] }; // Return an empty array to indicate no content was processed
  }

  const url = `https://${input.language}.${input.project}.org/w/api.php`;

  // Prepare parameters for the API request
  const params = {
    action: 'parse',
    page: input.title,
    format: 'json',
  };

  try {
    // Make the API request using the dynamically constructed base URL
    const response = await axios.get(url, { params });
    // Extract HTML content from the response
    const htmlContent = response.data.parse?.text['*'] || '';

    // Process the HTML content to format it as described (rows with Page, Header, Paragraph)
    const rows = processWikiContent(input.title, htmlContent); // Use the title as the Page value

    return { rows }; // Return the processed rows
  } catch (error) {
    handleAxiosError(error, logger);
    return { rows: [] }; // Return an empty array in case of an error
  }
}

// Represents a row in your table
interface TableRow {
  Page: string;
  Header: string;
  Content: string;
}

const processWikiContent = (pageTitle: string, htmlContent: string): TableRow[] => {
  const $ = cheerio.load(htmlContent);
  const rows: TableRow[] = [];
  let currentHeader = '';

  $('h1, h2, h3, h4, h5, h6, p').each((_, el) => {
    if ($(el).is('h1, h2, h3, h4, h5, h6')) {
      // New header found, update the currentHeader variable
      currentHeader = $(el).text();
    } else {
      // Paragraph element, create rows
      const paragraphText = $(el).text();
      const maxChars = 3500 - (pageTitle.length + currentHeader.length + 100); // Adjust for overhead
      for (let i = 0; i < paragraphText.length; i += maxChars) {
        const chunk = paragraphText.substring(i, i + maxChars);
        rows.push({
          Page: pageTitle,
          Header: currentHeader,
          Content: chunk,
        });
      }
    }
  });

  return rows; // Return the accumulated rows after processing
}
