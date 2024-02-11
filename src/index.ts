import * as botpress from '.botpress'
import { searchWikiPages, getWikiPage, getWikiPageHtml } from 'src/client'

export default new botpress.Integration({
  register: async () => { },
  unregister: async () => { },
  actions: {
    searchWikiPages,
    getWikiPage,
    getWikiPageHtml
  },
  channels: {},
  handler: async () => { },
})