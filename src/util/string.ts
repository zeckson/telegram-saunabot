export const isNotEmpty = (strings: TemplateStringsArray, value: unknown) =>
  value ? `${strings[0]}${value}` : ``

export const escapeSpecial = (value: string): string => {
  const result = []
  for (const it of value) {
    switch (it) {
      case `#`:
        result.push(`\\`)
      // fall through
      default:
        result.push(it)
    }
  }
  return result.join(``)
}
