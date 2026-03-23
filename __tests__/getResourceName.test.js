import { jest } from '@jest/globals'

console.info('===> test 1')

const sum = (a, b) => a + b

jest.test('should return the sum of two numbers', () => {
  console.info('===> test 2')

  jest.expect(sum(1, 2)).toBe(3)

  console.info('===> test 3')
})
