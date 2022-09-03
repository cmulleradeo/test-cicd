import {
  transform,
  number,
  bool,
  array,
  arrayOf,
  string
} from './index'

describe('query/transform', () => {
  it('transforms query strings parameters', () => {
    const schema = {
      a: number,
      b: number,
      c: bool,
      d: bool,
      e: bool,
      f: bool,
      g: array,
      h: array,
      i: arrayOf(number),
      j: array,
      k: arrayOf(string)
    }

    const input = {
      a: '1',
      c: 'true',
      e: 'TRUE',
      f: 'klqsjd',
      g: '1',
      h: ['1'],
      i: ['1', '2']
    }

    expect(transform(input, schema)).toEqual({
      a: 1,
      // eslint-disable-next-line no-undefined
      b: undefined,
      c: true,
      // eslint-disable-next-line no-undefined
      d: undefined,
      e: false,
      f: false,
      g: ['1'],
      h: ['1'],
      i: [1, 2],
      j: [],
      k: []
    })
  })

  it('handles falsy queries', () => {
    const schema = {
      a: string
    }

    // eslint-disable-next-line no-undefined
    expect(transform(null, schema, { omitExtraParameters: false })).toEqual({ a: undefined })
  })

  describe('omitExtraParameters', () => {
    it('omits extra parameters by default', () => {
      const schema = {
        a: string
      }

      const input = {
        a: '1',
        b: 'true'
      }

      expect(transform(input, schema)).toEqual({ a: '1' })
    })

    it('does not omit extra parameters if specified', () => {
      const schema = {
        a: string
      }

      const input = {
        a: '1',
        b: 'true'
      }

      expect(transform(input, schema, { omitExtraParameters: false })).toEqual({ a: '1', b: 'true' })
    })
  })
})
