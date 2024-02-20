import * as botpress from '.botpress'
import { searchTitle, searchContent, getPage, getPageContent, getFeaturedArticle, getOnThisDay } from 'src/client'

export default new botpress.Integration({
  register: async () => { },
  unregister: async () => { },
  actions: {
    searchTitle,
    searchContent,
    getPage,
    getPageContent,
    getFeaturedArticle,
    getOnThisDay
  },
  channels: {},
  handler: async () => { },
})