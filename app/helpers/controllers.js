import consola from 'consola'
import prompts from 'prompts'
import Node from 'graph-fs'

function replaceLast(find, replace, string) {
  var lastIndex = string.lastIndexOf(find);
  
  if (lastIndex === -1) {
      return string;
  }
  
  var beginString = string.substring(0, lastIndex);
  var endString = string.substring(lastIndex + find.length);
  
  return beginString + replace + endString;
}

export const handleControllers = ({ model }) => {
  const controller = model.resolve(`controllers/${model.name}.js`)
  consola.success(`Updating controllers`)
  if (controller.exists) {
    consola.info(`Controllers exist`)
    let controllerCode = controller.getContent()
    if (controllerCode.includes('module.exports = {}')) {
      consola.info(`No custom controller actions found`)
      controllerCode = controllerCode.replace(
        'module.exports = {}',
`const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController('api::${model.name}.${model.name}')
`
      )
    } else {
      consola.info(`Updating custom controllers`)
      controllerCode = controllerCode.replace(
        'module.exports = {',
        `const { createCoreController } = require('@strapi/strapi').factories
  
module.exports = createCoreController('api::${model.name}.${model.name}', ({ strapi }) => ({`
      )
      controllerCode = replaceLast('}', '}))', controllerCode)
    }
   
    controller.overwrite(controllerCode)
  } else {{
    consola.info(`No Controllers found`)
  }}

}
