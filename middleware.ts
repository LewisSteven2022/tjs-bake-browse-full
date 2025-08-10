// middleware.ts (project root)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { admin } from "@/lib/db";

const ADMIN_EMAILS = (
	process.env.NEXT_PUBLIC_ADMIN_EMAILS || "admin@example.com"
)
	.split(",")
	.map((s) => s.trim().toLowerCase());

function isAdminFromToken(token: any) {
	const email = (token?.email || "").toLowerCase();
	const role = token?.role;
	return role === "admin" || ADMIN_EMAILS.includes(email);
}

async function logApiRequest(
	req: NextRequest,
	message = "Request received (middleware)"
) {
	const urlPath = req.nextUrl.pathname;
	const method = req.method;
	let body: any = null;

	if (method !== "GET" && method !== "HEAD") {
		try {
			body = await req.clone().json();
		} catch {
			// ignore non-JSON bodies
		}
	}

	try {
		await admin.from("api_logs").insert({
			endpoint: urlPath,
			method,
			message,
			details: body ? JSON.stringify(body) : null,
		});
	} catch (err) {
		console.error("Failed to save API log to Supabase:", err);
	}
}

export async function middleware(req: NextRequest) {
	const { pathname, search } = req.nextUrl;

	// ✅ Log ALL /api/* (including ones we block)
	if (pathname.startsWith("/api/")) {
		await logApiRequest(req);
	}

	// ✅ Guard admin API: /api/admin/**
	if (pathname.startsWith("/api/admin")) {
		const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
		if (!token || !isAdminFromToken(token)) {
			await logApiRequest(req, "Denied (unauthorised admin API)");
			return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
		}
	}

	// ✅ Guard admin pages: /admin/**
	if (pathname.startsWith("/admin")) {
		const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
		if (!token) {
			const loginUrl = new URL(
				`/login?callbackUrl=${encodeURIComponent(pathname + search)}`,
				req.url
			);
			return NextResponse.redirect(loginUrl);
		}
		if (!isAdminFromToken(token)) {
			const home = new URL("/", req.url);
			return NextResponse.redirect(home);
		}
	}

	return NextResponse.next();
}

// Runs on both admin pages and all API routes
export const config = {
	matcher: ["/admin/:path*", "/api/:path*"],
};
