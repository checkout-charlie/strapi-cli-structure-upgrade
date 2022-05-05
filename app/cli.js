import consola from 'consola'
import prompts from 'prompts'
import Node from 'graph-fs'
import dotenv from 'dotenv'
import { handleRoutes } from './helpers/routes.js'
import { handleControllers } from './helpers/controllers.js'
import { handleServices } from './helpers/services.js'
import { handleSchemas } from './helpers/schemas.js'

dotenv.config()

const execute = async () => {
  let directory = null
  if (process.env.STRAPI_UPDATE_DIR) {
    directory = process.env.STRAPI_UPDATE_DIR
  } else {
    const input = await prompts([{
      type: 'text',
      name: 'directory',
      message: 'full path to strapi directory'
    }])

    directory = input.directory
  }
  const apiDir = new Node.Node(`${directory}/api`)

  apiDir.children.forEach(model => {
    if (!model.name.match(/\./g)) {
      consola.info(`Starting with Model ${model.name}`)
      handleRoutes({ model })
      handleServices({ model })
      handleControllers({ model })
      handleSchemas({ model })
    }
  })
}


await execute()
