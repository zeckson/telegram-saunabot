export const isNotEmpty = (strings: TemplateStringsArray, value: unknown) =>
  value ? `${strings[0]}${value}` : ``

export const hash = (id: number | string) => `\\#${id}`

export const link = (name: string, url: string) => `[${name}](${url})`

export const tgIdLink = (id: number | string) => `tg://user?id=${id}`
