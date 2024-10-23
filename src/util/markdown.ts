const COMMON_ESCAPE_SEQUENCE = `_*[]()~\`>#+-=|{}.!`
const LINK_ESCAPE_SEQUENCE = `\\)_`

const commonTable: boolean[] = []
const linkTable: boolean[] = []

for (const it of COMMON_ESCAPE_SEQUENCE) {
  commonTable[it.charCodeAt(0)] = true
}
for (const it of LINK_ESCAPE_SEQUENCE) {
  linkTable[it.charCodeAt(0)] = true
}

const escapeText = (value: string): string => {
  const result = []
  for (const it of value) {
    if (commonTable[it.charCodeAt(0)]) {
      result.push(`\\`)
    }
    result.push(it)
  }
  return result.join(``)
}

const escapeLink = (value: string): string => {
  const result = []
  for (const it of value) {
    if (linkTable[it.charCodeAt(0)]) {
      result.push(`\\`)
    }
    result.push(it)
  }
  return result.join(``)
}

export const text = (value: string | number) =>
  escapeText((typeof value === `number`) ? String(value) : value)

export const link = (name: string, url: string) =>
  `[${text(name)}](${escapeLink(url)})`

export const userLink = (name: string, id: string | number) =>
  link(name, `tg://user?id=${id}`)

export const chatLink = (name: string, chatUsername: string) =>
  link(name, `tg://resolve?domain=${chatUsername}`)

export const hash = (value: string | number) => `\\#${text(value)}`
