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

export const link = (name: string, url: string) => `[${name}](${url})`

export const tgIdLink = (id: number | string) => `tg://user?id=${id}`
