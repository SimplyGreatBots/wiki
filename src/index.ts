import * as botpress from '.botpress'
import { searchContent, getPage, getPageContent, getFeaturedArticle, getOnThisDay, searchTitle } from 'src/client'

export default new botpress.Integration({
  register: async () => { },
  unregister: async () => { },
  actions: {
    searchContent,
    searchTitle,
    getPage,
    getPageContent,
    getFeaturedArticle,
    getOnThisDay
  },
  channels: {},
  handler: async () => { },
})