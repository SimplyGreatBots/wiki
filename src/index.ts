import * as botpress from '.botpress'
import { searchWikiPages, getWikiPage } from 'src/client'

export default new botpress.Integration({
  register: async () => { },
  unregister: async () => { },
  actions: {
    searchWikiPages,
    getWikiPage
  },
  channels: {},
  handler: async () => { },
})