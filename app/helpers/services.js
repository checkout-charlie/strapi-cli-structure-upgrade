import consola from 'consola'
import { replaceLast } from '../utils/replaceLast.js'

export const handleServices = ({ model }) => {
  const service = model.resolve(`services/${model.name}.js`)
  consola.success(`Updating services`)
  if (service.exists) {
    consola.info(`Services exist`)
    let serviceCode = service.getContent()
    if (serviceCode.includes('module.exports = {}')) {
      consola.info(`No custom service actions found`)
      serviceCode = serviceCode.replace(
        'module.exports = {}',
`const { createCoreService } = require('@strapi/strapi').factories

module.exports = createCoreService('api::${model.name}.${model.name}')
`
      )
    } else {
      consola.info(`Updating custom services`)
      serviceCode = serviceCode.replace(
        'module.exports = {',
        `const { createCoreService } = require('@strapi/strapi').factories
  
module.exports = createCoreService('api::${model.name}.${model.name}', ({ strapi }) => ({`
      )
      serviceCode = replaceLast('}', '}))', serviceCode)
    }
   
    service.overwrite(serviceCode)
  } else {{
    consola.info(`No Services found`)
  }}

}
