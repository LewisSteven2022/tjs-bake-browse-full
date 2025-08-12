import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
	try {
		// Check authentication
		const session = await getServerSession(authOptions);
		if (!session?.user) {
			return NextResponse.json(
				{ error: "Authentication required" },
				{ status: 401 }
			);
		}

		// Parse request body
		const body = await request.json();
		const { subject, message, category } = body;

		// Validate required fields
		if (!subject || !message || !category) {
			return NextResponse.json(
				{ error: "Subject, message, and category are required" },
				{ status: 400 }
			);
		}

		// Validate subject length
		if (subject.length > 100) {
			return NextResponse.json(
				{ error: "Subject must be 100 characters or less" },
				{ status: 400 }
			);
		}

		// Validate message length
		if (message.length > 1000) {
			return NextResponse.json(
				{ error: "Message must be 1000 characters or less" },
				{ status: 400 }
			);
		}

		// Validate category
		const validCategories = [
			"general",
			"product",
			"service",
			"website",
			"ordering",
			"other",
		];
		if (!validCategories.includes(category)) {
			return NextResponse.json(
				{ error: "Invalid category selected" },
				{ status: 400 }
			);
		}

		// Prepare email content
		const emailSubject = `[Suggestion] ${subject}`;
		const emailBody = `
New suggestion submitted by ${session.user.name} (${session.user.email})

Category: ${category}
Subject: ${subject}

Message:
${message}

---
Submitted via TJ's Bake & Browse website
Time: ${new Date().toLocaleString("en-GB", { timeZone: "Europe/London" })}
		`.trim();

		// Send email to business
		await sendEmail({
			to: "tjsbakeandbrowse@gmail.com",
			subject: emailSubject,
			text: emailBody,
		});

		// Return success response
		return NextResponse.json(
			{
				message: "Suggestion submitted successfully",
				timestamp: new Date().toISOString(),
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error submitting suggestion:", error);

		return NextResponse.json(
			{
				error: "Internal server error",
				message: "Failed to submit suggestion. Please try again later.",
			},
			{ status: 500 }
		);
	}
}

// Prevent other HTTP methods
export async function GET() {
	return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
	return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
	return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
