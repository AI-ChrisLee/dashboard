import { cn } from '../utils'

describe('cn (classname utility)', () => {
  it('should combine class names', () => {
    const result = cn('class1', 'class2', 'class3')
    expect(result).toBe('class1 class2 class3')
  })

  it('should handle conditional classes', () => {
    const result = cn('base', {
      'active': true,
      'disabled': false,
      'highlighted': true
    })
    expect(result).toBe('base active highlighted')
  })

  it('should handle arrays of classes', () => {
    const result = cn(['class1', 'class2'], 'class3')
    expect(result).toBe('class1 class2 class3')
  })

  it('should handle undefined and null values', () => {
    const result = cn('class1', undefined, null, 'class2')
    expect(result).toBe('class1 class2')
  })

  it('should handle empty strings', () => {
    const result = cn('class1', '', 'class2')
    expect(result).toBe('class1 class2')
  })

  it('should merge tailwind classes correctly', () => {
    const result = cn('px-2 py-1', 'px-4')
    expect(result).toBe('py-1 px-4') // px-4 should override px-2
  })

  it('should handle complex tailwind merging', () => {
    const result = cn(
      'bg-red-500 hover:bg-red-600',
      'bg-blue-500',
      'text-white'
    )
    expect(result).toBe('hover:bg-red-600 bg-blue-500 text-white')
  })

  it('should handle no arguments', () => {
    const result = cn()
    expect(result).toBe('')
  })

  it('should handle boolean values', () => {
    const result = cn('class1', true && 'class2', false && 'class3')
    expect(result).toBe('class1 class2')
  })
})