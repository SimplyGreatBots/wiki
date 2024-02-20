import { z } from 'zod';

export const INTEGRATION_NAME = 'wiki'

export type BotLogger = {
  forBot: () => {
    info: (message?: any, ...optionalParams: any[]) => void;
    warn: (message?: any, ...optionalParams: any[]) => void;
    error: (message?: any, ...optionalParams: any[]) => void;
    debug: (message?: any, ...optionalParams: any[]) => void;
  }
}

// Search Schemas
export const searchInputSchema = z.object({
  project: z.string().describe('Project name, e.g., wikipedia, commons, wiktionary.'),
  language: z.string().describe('Language code, e.g., en for English, es for Spanish. Note: Prohibited for commons and other multilingual projects.'),
  q: z.string().describe('Search terms.'),
  limit: z.number().min(1).max(100).default(50).optional().describe('Maximum number of search results to return. Default is 50.')
})
export const searchOutputSchema = z.object({
  pages: z.array(z.object({
    id: z.number(),
    key: z.string(),
    title: z.string(),
    excerpt: z.string().optional().nullable(),
    matched_title: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    thumbnail: z.object({
      mimetype: z.string().optional().nullable(),
      size: z.number().optional().nullable(),
      width: z.number().optional().nullable(),
      height: z.number().optional().nullable(),
      duration: z.number().optional().nullable(),
      html_url: z.string().optional().nullable(),
    }).optional().nullable(),
  })),
})
export const searchEmpty = {
  pages: []
}

// Page Schemas
export const pageInputSchema = z.object({
  project: z.string().describe('Project name, e.g., wikipedia, commons, wiktionary.'),
  language: z.string().describe('Language code, e.g., en for English, es for Spanish. Note: Prohibited for commons and other multilingual projects.'),
  title: z.string().describe('Title of the Wiki page.'),
 })
export const pageOutputSchema = z.object({
  id: z.number(),
  key: z.string(),
  title: z.string(),
  latest: z.object({
    id: z.number(),
    timestamp: z.string(),
  }),
  content_model: z.string().optional().nullable(),
  license: z.object({
    url: z.string().url(),
    title: z.string().optional().nullable(),
  }),
  html_url: z.string()
})
export const pageEmpty = {
  id: 0,
  key: '',
  title: '',
  latest: {
    id: 0,
    timestamp: '',
  },
  content_model: null,
  license: {
    url: '',
    title: null
  },
  html_url: ''
}

// Page Content Schemas
export const tableRowSchema = z.object({
  Page: z.string(),
  Header: z.string(),
  Content: z.string(),
})
export type TWikiParagraph = {
  Page: string
  Header: string
  Content: string
}
export const pageContentOutputSchema = z.object({
  content: z.array(tableRowSchema)
})
export const pageContentEmpty = {
  content: []
}

// Featured Content Input Schema
const baseInputSchema = z.object({
  language: z.string().describe('Language code, e.g., ar (Arabic), en (English), es (Spanish).'),
  month: z.string().regex(/^(0[1-9]|1[0-2])$/, 'Month of the year, 01 through 12').describe('Two digit Month (MM)'),
  day: z.string().regex(/^(0[1-9]|[12][0-9]|3[01])$/, 'Day of the month, 01 through 31').describe('Two digit Day (DD)')
})

// Featured: Article
export const featuredArticleInputSchema = baseInputSchema.extend({
  year: z.string().regex(/^\d{4}$/, 'Four-digit year').describe('Four Digit Year YYYY')
})

export const namespaceSchema = z.object({
  id: z.number(),
  text: z.string(),
})
export const titlesSchema = z.object({
  canonical: z.string(),
  normalized: z.string(),
  display: z.string(),
})
export const imageSchema = z.object({
  source: z.string().url(),
  width: z.number(),
  height: z.number(),
})
export const articleUrlSchema = z.object({
  page: z.string().url(),
  revisions: z.string().url(),
  edit: z.string().url(),
  talk: z.string().url(),
})
export const contentUrlsSchema = z.object({
  desktop: articleUrlSchema,
  mobile: articleUrlSchema,
})
export const featuredArticleOutputSchema = z.object({
  type: z.string(),
  namespace: namespaceSchema,
  wikibase_item: z.string(),
  titles: titlesSchema,
  pageid: z.number(),
  thumbnail: imageSchema.optional(),
  originalimage: imageSchema.optional(),
  lang: z.string(),
  dir: z.string(),
  revision: z.string(),
  tid: z.string(),
  timestamp: z.string(),
  description: z.string(),
  description_source: z.string(),
  content_urls: contentUrlsSchema,
  extract: z.string(),
  extract_html: z.string(),
  normalizedtitle: z.string()
})
export const featuredArticleEmpty = {
  type: 'standard',
  namespace: {
    id: 0,
    text: '',
  },
  wikibase_item: '',
  articleUrlSchema: {
  page: '',
    revisions: '',
    edit: '',
    talk: '',
  },
  titles: {
    canonical: '',
    normalized: '',
    display: '',
  },
  pageid: 0,
  thumbnail: {
    source: '',
    width: 0,
    height: 0,
  },
  originalimage: {
    source: '',
    width: 0,
    height: 0,
  },
  lang: '',
  dir: '',
  revision: '',
  tid: '',
  timestamp: '',
  description: '',
  description_source: '',
  content_urls: {
    desktop: {
      page: '',
      revisions: '',
      edit: '',
      talk: '',
    },
    mobile: {
      page: '',
      revisions: '',
      edit: '',
      talk: '',
    },
  },
  extract: '',
  extract_html: '',
  normalizedtitle: '',
}

// Featured: On This Day
export const onThisDayInputSchema = baseInputSchema.extend({
  type: z.string().describe('Type of event [all, events, births, deaths, holidays, selected]')
})

export const onThisDayOutputSchema = z.object({
  events: z.array(z.any()).optional(),
  births: z.array(z.any()).optional(),
  deaths: z.array(z.any()).optional(),
  holidays: z.array(z.any()).optional(),
  selected: z.array(z.any()).optional()
})
export const onThisDayEmpty = {
  events: [],
  births: [],
  deaths: [],
  holidays: [],
  selected: []
}

// Error Schemas
export const invalidSearchParamErrorSchema = z.object({
  error: z.string(),
  name: z.string(),
  value: z.string(),
  failureCode: z.string(),
  failureData: z.object({
    min: z.number().optional(),
    curmax: z.number().optional(),
    max: z.number().optional(),
    highmax: z.number().optional(),
  }).optional(),
  messageTranslations: z.object({
    en: z.string(),
  }),
  httpCode: z.number(),
  httpReason: z.string(),
})
export const invalidFeedParamErrorSchema = z.object({
  type: z.string(),
  method: z.string(),
  detail: z.string(),
  uri: z.string()
})
export const invalidOnThisDayParamErrorSchema = z.object({
  type: z.string(),
  title: z.string(),
  method: z.string(),
  detail: z.string(),
  uri: z.string()
})
export const noSearchResultsErrorSchema = z.object({
  messageTranslations: z.object({
    en: z.string(),
  }),
  httpCode: z.number(),
  httpReason: z.string()
})
export const noFeedResultsErrorSchema = z.object({
  type: z.string(),
  title: z.string(),
  method: z.string(),
})
export const unsupportedLangErrorSchema = z.object({
  type: z.string(),
  title: z.string(),
  method: z.string(),
  uri: z.string(),
})
export const errorSchemas = z.union([invalidSearchParamErrorSchema, invalidFeedParamErrorSchema, invalidOnThisDayParamErrorSchema, noSearchResultsErrorSchema, noFeedResultsErrorSchema, unsupportedLangErrorSchema])

// Response Wrapper
export const outputSchemas = z.union([searchOutputSchema, pageOutputSchema, pageContentOutputSchema, featuredArticleOutputSchema, onThisDayOutputSchema])
export const responseWrapperSchema = z.object({
  success: z.boolean(),
  log: z.string(),
  data: outputSchemas
})