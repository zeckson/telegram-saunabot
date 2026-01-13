export const enum JoinRequestAction {
	APPROVE = `approve`,
	DECLINE = `decline`,
}

export interface JoinRequestData {
	action: JoinRequestAction
	userId: number
	chatId: number
}
