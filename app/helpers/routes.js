import consola from 'consola'
import prompts from 'prompts'
import Node from 'graph-fs'

export const handleRoutes = ({ model }) => {
  consola.success(`Updating Routes`)
  consola.info(`Creating default routes`)
  model.newDirectory('router')
  model.newFile(`router/${model.name}.js`,
`const { createCoreRouter } = require('@strapi/strapi').factories
  module.exports = createCoreRouter('api::${model.name}.${model.name}')
`)

  // check if there is a custom route
  const routes = model.resolve('config/routes.json');
  const customRoutes = JSON.parse(routes.getContent()).routes.map(route => {
    if ([
      model.name + '.delete',
      model.name + '.update',
      model.name + '.create',
      model.name + '.findOne',
      model.name + '.count',
      model.name + '.find',
    ].includes(route.handler)) {
      return null
    }

    return route
  }).filter(route => route)

  if (customRoutes.length) {
    consola.info(`Creating custom routes`)
    model.newDirectory('routes')
    model.newFile(`routes/${model.name}-custom.js`,
`module.exports = {
routes: ${JSON.stringify(customRoutes).replaceAll('"', '\'')}
}`)
  } else {
    consola.info(`No custom routes found`)
  }

  consola.info(`Cleaning old routes`)
  const oldRouteConfigDir = model.resolve('config')
  oldRouteConfigDir.clear()
  oldRouteConfigDir.delete()
}