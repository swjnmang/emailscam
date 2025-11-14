import { describe, it, expect } from 'vitest'
import { isDecisionCorrect, computeScore } from './game'

describe('game utils', () => {
  it('recognizes correct decisions', () => {
    expect(isDecisionCorrect('legit', 'keep')).toBe(true)
    expect(isDecisionCorrect('spam', 'spam')).toBe(true)
  })

  it('recognizes incorrect decisions', () => {
    expect(isDecisionCorrect('legit', 'spam')).toBe(false)
    expect(isDecisionCorrect('spam', 'keep')).toBe(false)
  })

  it('computes score correctly', () => {
    expect(computeScore(0, true)).toBe(100)
    expect(computeScore(100, true)).toBe(200)
    expect(computeScore(100, false)).toBe(50)
    expect(computeScore(20, false)).toBe(0)
  })
})
