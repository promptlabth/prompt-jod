import { describe, it, expect } from 'vitest'

describe('Test Environment Setup', () => {
  it('should have working test environment', () => {
    expect(true).toBe(true)
  })

  it('should have mocked window.matchMedia', () => {
    expect(window.matchMedia).toBeDefined()
    const mql = window.matchMedia('(min-width: 768px)')
    expect(mql.matches).toBeDefined()
  })

  it('should have mocked ResizeObserver', () => {
    expect(global.ResizeObserver).toBeDefined()
    const ro = new ResizeObserver(() => {})
    expect(ro.observe).toBeDefined()
    expect(ro.unobserve).toBeDefined()
    expect(ro.disconnect).toBeDefined()
  })

  it('should have mocked IntersectionObserver', () => {
    expect(global.IntersectionObserver).toBeDefined()
    const io = new IntersectionObserver(() => {})
    expect(io.observe).toBeDefined()
    expect(io.unobserve).toBeDefined()
    expect(io.disconnect).toBeDefined()
  })
}) 