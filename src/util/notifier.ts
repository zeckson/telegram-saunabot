import { Config } from './config.ts'

export const notifyAdmins = (
  action: (id: number) => Promise<unknown>,
): Promise<unknown[]> => {
  const responses = []

  for (const id of Config.ADMIN_IDS) {
    responses.push(action(id))
  }

  return Promise.all(responses)
}

abstract class Notifier<T> {

  abstract notify(action: (param: T) => Promise<unknown>): Promise<unknown>
}

export class AllAdminNotifier extends Notifier<number> {
	override notify(action: (id: number) => Promise<unknown>): Promise<unknown> {
		return notifyAdmins(action)
	}

}

export class UserNotifier {}



