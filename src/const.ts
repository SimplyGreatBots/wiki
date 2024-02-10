import { z } from 'zod';

export const INTEGRATION_NAME = 'wiki'

export const searchContentSchema = z.object({
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
      url: z.string().optional().nullable(),
    }).optional().nullable(),
  })),
})

export const wikiPageSchema = z.object({
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
