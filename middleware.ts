import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { admin } from "@/lib/db"; // Your Supabase admin client

// List of API routes to log
const LOGGED_ROUTES = ["/api/"];

export async function middleware(req: NextRequest) {
	const urlPath = req.nextUrl.pathname;

	// Only log API requests
	if (LOGGED_ROUTES.some((route) => urlPath.startsWith(route))) {
		const endpoint = urlPath;
		const method = req.method;

		let body: any = null;
		if (method !== "GET" && method !== "HEAD") {
			try {
				body = await req.clone().json();
			} catch {
				body = null;
			}
		}

		// Save log to Supabase
		try {
			await admin.from("api_logs").insert({
				endpoint,
				method,
				message: "Request received",
				details: body ? JSON.stringify(body) : null,
			});
		} catch (err) {
			console.error("Failed to save API log to Supabase:", err);
		}
	}

	return NextResponse.next();
}

// Run only on API routes
export const config = {
	matcher: ["/api/:path*"],
};
