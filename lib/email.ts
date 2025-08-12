import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendOrderConfirmation(to: string, payload: any) {
	return resend.emails.send({
		from: "orders@tjsbakeandbrowse.example",
		to,
		subject: `Your order #${String(payload.order_number || "").padStart(
			3,
			"0"
		)} is confirmed`,
		html: `<p>Hello ${payload.name || ""},</p>
    <p>Thanks for your order.</p>
    <p>Collection: ${payload.pickup_date} ${payload.pickup_time}</p>
    <p>${payload.bag_opt_in ? "Bag surcharge £0.70 applied." : ""}</p>
    <p>Please note: Our kitchen is gluten-free but may handle other allergens.</p>`,
	});
}

// Generic email sending function
export async function sendEmail({
	to,
	subject,
	text,
	html,
}: {
	to: string;
	subject: string;
	text?: string;
	html?: string;
}) {
	const emailData: any = {
		from: "noreply@tjsbakeandbrowse.example",
		to,
		subject,
	};

	if (text) emailData.text = text;
	if (html) emailData.html = html;

	return resend.emails.send(emailData);
}

// Notification helper functions
export function showSuccessNotification(
	showNotification: any,
	title: string,
	message: string
) {
	showNotification({
		type: "success",
		title,
		message,
	});
}

export function showErrorNotification(
	showNotification: any,
	title: string,
	message: string
) {
	showNotification({
		type: "error",
		title,
		message,
	});
}
