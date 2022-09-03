import config from 'config/env'
import logger from 'services/loggers'

export const messages = {
  STARTED: 'Swagger has started.',
  MISSING_FILE: "Swagger couldn't start because the swagger.json file is missing or corrupted.",
  DISABLED: 'Swagger is not enabled, put SWAGGER_ENABLED=true in your .env to turn it on.'
}

export default async (
  app,
  { enabled, specFilePath } = config.swagger
) => {
  if (enabled) {
    try {
      app.use('/swagger', (req, res) => res.redirect(301, 'https://shiny-meme-8ceee40f.pages.github.io/'))
      app.use('/swagger.json', (req, res) => res.redirect(301, 'https://shiny-meme-8ceee40f.pages.github.io/swagger.json'))
      logger.info(messages.STARTED)
    } catch (err) {
      logger.warn(messages.MISSING_FILE)
      app.get('/swagger', (req, res) => res.status(500).send(messages.MISSING_FILE))
    }
  } else {
    logger.warn(messages.DISABLED)
    app.get('/swagger', (req, res) => res.status(500).send(messages.DISABLED))
  }
}
