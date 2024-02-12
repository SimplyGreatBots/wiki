import * as botpress from '.botpress'
import { searchWikiPages, getWikiPage, getWikiPageContent } from 'src/client'

export default new botpress.Integration({
  register: async () => { },
  unregister: async () => { },
  actions: {
    searchWikiPages,
    getWikiPage,
    getWikiPageContent
  },
  channels: {},
  handler: async () => { },
})