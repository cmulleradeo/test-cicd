import { cloneDeep } from 'lodash'

import { ensureArray } from 'utils/array'

/**
 * Transform the parsed query string into JS types.
 *
 * @param {object<string>} query - The parsed query string.
 * @param {object} schema - A description of each field of the query string.
 * @param {object} options - Options.
 * @param {boolean} options.omitExtraParameters - Remove fields not specified in the schema.
 * @returns {object} Transformed query.
 */
export const transform = (
  query,
  schema,
  {
    omitExtraParameters = true
  } = {}
) => {
  const transformed = omitExtraParameters
    ? {}
    : cloneDeep(query || {})

  Object.keys(schema).forEach((key) => {
    // eslint-disable-next-line security/detect-object-injection
    transformed[key] = schema[key](query?.[key])
  })

  return transformed
}

export const string = (value) => value
// eslint-disable-next-line no-undefined
export const bool = (value) => (typeof value !== 'undefined' ? value === 'true' : undefined)
// eslint-disable-next-line no-undefined
export const number = (value) => (typeof value !== 'undefined' ? +value : undefined)
export const array = (value) => ensureArray(value || [])
export const arrayOf = (tranformer) => (value) => ensureArray(value || []).map(tranformer) // ASSEMBLE
