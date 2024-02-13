import * as botpress from '.botpress'
import { searchWikiPages, getWikiPage, getPageContent } from 'src/client'

export default new botpress.Integration({
  register: async () => { },
  unregister: async () => { },
  actions: {
    searchWikiPages,
    getWikiPage,
    getPageContent
  },
  channels: {},
  handler: async () => { },
})