const { EOL } = require('os')

module.exports = (api, options) => {
  if (options.addODS) {
    api.extendPackage({
      dependencies: {
        '@onesait/onesait-ds': '^0.1.79'
      }
    })
  }
  api.extendPackage({
    dependencies: {
      'sass-resources-loader': '^2.0.1'
    }
  })
  // api.injectImports(api.entryFile, 'Vue.use(ODS)')

  api.injectImports(api.entryFile, [
    "import ODS from '@onesait/onesait-ds' // eslint-disable-line",
    "import i18n from './lang/i18n.js' // eslint-disable-line",
    "import { closest } from './utils/ie' // eslint-disable-line",
    "import { truncate, formatDate } from './utils/filters' // eslint-disable-line"
  ])

  api.onCreateComplete(() => {
    const entryFile = api.resolve(api.entryFile)
    const fs = require('fs')
    const contentMain = fs.readFileSync(entryFile, { encoding: 'utf-8' })
    const lines = contentMain.split(/\r?\n/g)
    const renderIndex = lines.findIndex(line => line.match(/new Vue/))
    lines[renderIndex] = `
      closest()${EOL}${EOL}
      Vue.filter('truncate', truncate)${EOL}
      Vue.filter('formatDate', formatDate)${EOL}${EOL}
      Vue.use(ODS)${EOL}${EOL}
      ${lines[renderIndex]}${EOL}
      i18n,`
    fs.writeFileSync(entryFile, lines.join(EOL), { encoding: 'utf-8' })
  })

  api.render('./template')
}
