/**
 * Format the response for the API
 *
 * @param {object} res Express response object
 * @param {number} total Total number of entities in the database
 * @param {object[]} rows Array of entities from the database
 * @param {number} offset Entities to skip
 * @param {number} limit Maximum amount to fetch
 */
export const formatResponse = (res, total, rows, offset, limit) => {
  const status = rows.length === total ? 200 : 206

  const result = {
    metadata: {
      count: rows.length,
      offset,
      limit,
      total
    },
    payload: rows
  }

  res.status(status).json(result)
}
