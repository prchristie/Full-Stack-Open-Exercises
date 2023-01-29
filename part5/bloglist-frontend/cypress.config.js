const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 'rp2ixu',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
