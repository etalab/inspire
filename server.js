const express = require('express')
const path = require('path')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const i18nextMiddleware = require('i18next-express-middleware')
const Backend = require('i18next-node-fs-backend')
const i18n = require('./lib/i18n')

// Load .env if available, mostly for development.
require('dotenv').load()

i18n
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    preload: ['en', 'fr'],
    defaultNS: 'common',
    ns: [
      'common',
      'home',
      'catalogs'
    ],
    backend: {
      loadPath: path.join(__dirname, '/locales/{{lng}}/{{ns}}.json'),
      addPath: path.join(__dirname, '/locales/{{lng}}/{{ns}}.missing.json')
    },
    detection: {
      lookupCookie: 'locale'
    }
  }, () => {
    app.prepare()
      .then(() => {
        const server = express()

        server.use(i18nextMiddleware.handle(i18n))

        server.use('/locales', express.static(path.join(__dirname, '/locales')))

        if (dev) {
          server.post('/locales/add/:lng/:ns', i18nextMiddleware.missingKeyHandler(i18n))
        }

        server.get('*', (req, res) => {
          return handle(req, res)
        })

        server.listen(port, (err) => {
          if (err) throw err
          console.log(`> Ready on http://localhost:${port}`)
        })
      })
  })