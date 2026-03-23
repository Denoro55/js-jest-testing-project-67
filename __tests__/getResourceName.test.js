import { test, expect } from '@jest/globals'

console.info('===> test 1')

const sum = (a, b) => a + b

test('should return the sum of two numbers', () => {
  console.info('===> test 2')

  expect(sum(1, 2)).toBe(3)

  console.info('===> test 3')
})
