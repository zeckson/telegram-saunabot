const COMMON_ESCAPE_SEQUENCE_= `_*[]()~\`>#+-=|{}.!`
const LINK_ESCAPE_SEQUENCE_= `\\)`

const commonTable: boolean[] = []

for (const it of COMMON_ESCAPE_SEQUENCE_) {
  commonTable[it.charCodeAt(0)] = true
}

export const escapeCommon = (value: string): string => {
  const result = []
  for (const it of value) {
    if (commonTable[it.charCodeAt(0)]) {
      result.push(`\\`)
    }
    result.push(it)
  }
  return result.join(``)
}
