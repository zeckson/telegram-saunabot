import { branch, pipeline } from "../pipeline.ts"
import type { PhoneFlowContext } from "./phone-context.ts"
import { extractPhoneStep } from "./steps/extract-phone-step.ts"
import { notifyAdminsNoPhoneStep } from "./steps/notify-admins-no-phone-step.ts"
import { notifyAdminsPhoneStep } from "./steps/notify-admins-phone-step.ts"
import { notifyUserContactRecieved } from "./steps/notify-user-contact-recieved.ts"
import { notifyUserNoContact } from "./steps/notify-user-no-contact.ts"
import { savePhoneStep } from "./steps/save-phone-step.ts"

const userMessagePipeline = pipeline<PhoneFlowContext>(`user_message`, [
	extractPhoneStep, // sets ctx.phone when present; does not stop the pipeline
	branch(
		(ctx) => Boolean(ctx.phone),
		[savePhoneStep, notifyAdminsPhoneStep, notifyUserContactRecieved],
		[notifyAdminsNoPhoneStep, notifyUserNoContact],
	),
])

export const handleUserMessage = (ctx: PhoneFlowContext) =>
	userMessagePipeline(ctx)
