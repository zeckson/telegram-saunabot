import { Config } from "../util/config.ts"

export const notifyAdmins = (
  action: (id: number) => Promise<unknown>,
): Promise<unknown[]> => {
  const responses = []

  for (const id of Config.ADMIN_IDS) {
    responses.push(action(id))
  }

  return Promise.all(responses)
}
