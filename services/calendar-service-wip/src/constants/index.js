const path = require('path')
// import .env variables
require('dotenv-safe').config({
  path: path.join(__dirname, '../../.env')
})

const common = require('./constants.common')

const getEnvironmentSpecificConstants = (env) => {
  switch (env) {
    case 'development': {
      return require('./constants.dev')
    }
    case 'production': {
      return require('./constants.prod')
    }
    case 'test': {
      return require('./constants.testing')
    }
    default: {
      throw new Error(`no matching constants file found for env '${env}'`)
    }
  }
}

module.exports = Object.assign(common, getEnvironmentSpecificConstants(process.env.NODE_ENV))
