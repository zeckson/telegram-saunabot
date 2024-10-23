const COMMON_ESCAPE_SEQUENCE= `_*[]()~\`>#+-=|{}.!`
const LINK_ESCAPE_SEQUENCE= `\\)_`

const commonTable: boolean[] = []
const linkTable: boolean[] = []

for (const it of COMMON_ESCAPE_SEQUENCE) {
  commonTable[it.charCodeAt(0)] = true
}
for (const it of LINK_ESCAPE_SEQUENCE) {
  linkTable[it.charCodeAt(0)] = true
}

export const escapeText = (value: string): string => {
  const result = []
  for (const it of value) {
    if (commonTable[it.charCodeAt(0)]) {
      result.push(`\\`)
    }
    result.push(it)
  }
  return result.join(``)
}

export const escapeLink = (value: string): string => {
  const result = []
  for (const it of value) {
    if (linkTable[it.charCodeAt(0)]) {
      result.push(`\\`)
    }
    result.push(it)
  }
  return result.join(``)
}