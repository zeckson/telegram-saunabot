import { FormattedString } from '../deps.ts'

export const hashtag = (value: string | number): FormattedString => {
	value = `#${value}i`
	return new FormattedString(value, [
		{
			type: 'hashtag',
			offset: 0,
			length: value.length,
		},
	])
}
