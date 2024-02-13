import { z } from 'zod';

export const INTEGRATION_NAME = 'wiki'

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
export const wikiPageEmpty = {
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

// Search Content
export const searchContentInputSchema = z.object({
  project: z.string().describe('Project name, e.g., wikipedia, commons, wiktionary.'),
  language: z.string().describe('Language code, e.g., en for English, es for Spanish. Note: Prohibited for commons and other multilingual projects.'),
  q: z.string().describe('Search terms.'),
  limit: z.number().min(1).max(100).default(50).optional().describe('Maximum number of search results to return. Default is 50.')
})
export const searchContentOutputSchema = z.object({
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

// Page Content
 export const pageInputSchema = z.object({
  project: z.string().describe('Project name, e.g., wikipedia, commons, wiktionary.'),
  language: z.string().describe('Language code, e.g., en for English, es for Spanish. Note: Prohibited for commons and other multilingual projects.'),
  title: z.string().describe('Title of the Wiki page.'),
})
export type BotLogger = {
  forBot: () => {
    info: (message?: any, ...optionalParams: any[]) => void;
    warn: (message?: any, ...optionalParams: any[]) => void;
    error: (message?: any, ...optionalParams: any[]) => void;
    debug: (message?: any, ...optionalParams: any[]) => void;
  }
}