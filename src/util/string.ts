export const isNotEmpty = (strings: TemplateStringsArray, value: unknown) =>
  value ? `${strings[0]}${value}` : ``
