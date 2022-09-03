import { ensureArray } from './index'

describe('utils/array', () => {
  describe('ensureArray', () => {
    it('makes an array of a single value', () => {
      expect(ensureArray(1)).toEqual([1])
      expect(ensureArray([1])).toEqual([1])
      expect(ensureArray([[1]])).toEqual([[1]])
    })
  })
})
