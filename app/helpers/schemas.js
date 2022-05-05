import consola from 'consola'
import { replaceLast } from '../utils/replaceLast.js'

export const handleSchemas = ({ model }) => {
  const modelDir = model.resolve('models')

  if (modelDir.exists) {
    consola.success(`Updating Schema`)
    const schemaFile = modelDir.resolve(`${model.name}.settings.json`)
    let schemaJson = JSON.parse(schemaFile.getContent())

    schemaJson.info = {
      singularName: model.name,
      pluralName: `${model.name}s`.replace(/ys$/, 'ies'),
      displayName: schemaJson.info.name,
      name: schemaJson.info.name,
    }
    if (schemaJson.attributes) {
      Object.keys(schemaJson.attributes).forEach(key => {
        if (schemaJson.attributes[key].collection) {
          if (schemaJson.attributes[key].via) {
            if (schemaJson.attributes[key].dominant) {
              // manyToMany
              schemaJson.attributes[key] = {
                type: 'relation',
                relation: 'manyToMany',
                target: `api::${schemaJson.attributes[key].model}.${schemaJson.attributes[key].model}`,
                inversedBy: schemaJson.attributes[key].via,
              }
            } else {
              // oneToMany / both ways
              schemaJson.attributes[key] = {
                type: 'relation',
                relation: 'oneToMany',
                target: `api::${schemaJson.attributes[key].model}.${schemaJson.attributes[key].model}`,
                mappedBy: schemaJson.attributes[key].via,
              }
            }
          } else {
            // oneToMany / one way
            schemaJson.attributes[key] = {
              type: 'relation',
              relation: 'oneToMany',
              target: `api::${schemaJson.attributes[key].model}.${schemaJson.attributes[key].model}`
            }
          }
        }
        if (schemaJson.attributes[key].model) {
          if (schemaJson.attributes[key].via) {
            // oneToOne OR manyToOne
            schemaJson.attributes[key] = {
              type: 'relation',
              relation: 'TODO: chose if oneToOne OR manyToOne',
              target: `api::${schemaJson.attributes[key].model}.${schemaJson.attributes[key].model}`,
              inversedBy: schemaJson.attributes[key].via,
            }
          } else {
            // oneToOne // oneWay
            schemaJson.attributes[key] = {
              type: 'relation',
              relation: 'oneToOne',
              target: `api::${schemaJson.attributes[key].model}.${schemaJson.attributes[key].model}`
            }
          }
        }
      })
    }
    schemaFile.overwrite(JSON.stringify(schemaJson))

    consola.success(`Updating Lifecycle`)
    let lifecycleFile = modelDir.resolve(`${model.name}.js`)
    let lifecycleFileContents = lifecycleFile.getContent()
    lifecycleFileContents = lifecycleFileContents.replace('lifecycles: {', '')
    lifecycleFileContents = replaceLast('}', '', lifecycleFileContents)
    lifecycleFileContents = lifecycleFileContents.replace(/((before|after)[^(]+\()[^)]+\)/g, '$1event)')
    lifecycleFileContents = lifecycleFileContents.replace(/(data|where|select|populate|result|params)/g, 'event.$1')
    lifecycleFile.overwrite(lifecycleFileContents)
    lifecycleFile = lifecycleFile.rename('lifecycles.js')

    modelDir.newDirectory(model.name)
    schemaFile.move(`${model.name}/schema.json`)
    lifecycleFile.move(`${model.name}/lifecycles.js`)
    modelDir.rename('content-types')
  }

}