import { UserStatus } from '../type/user-status.ts'

export const isAllowed: (status: UserStatus) => boolean = (
	status: UserStatus,
) => {
	switch (status) {
		case 'member':
		case 'administrator':
		case 'creator':
		case 'restricted':
		case 'service_bot':
			return true
		default:
			return false
	}
}
