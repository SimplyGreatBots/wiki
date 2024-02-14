import * as botpress from '.botpress'
import { findPages, getPage, getPageContent, getFeaturedArticle } from 'src/client'

export default new botpress.Integration({
  register: async () => { },
  unregister: async () => { },
  actions: {
    findPages,
    getPage,
    getPageContent,
    getFeaturedArticle
  },
  channels: {},
  handler: async () => { },
})