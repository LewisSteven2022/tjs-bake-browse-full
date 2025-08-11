// middleware.ts
import { NextRequest, NextResponse } from "next/server";
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

async function logApiRequest(req: NextRequest) {
	try {
		const { pathname } = req.nextUrl;
		const method = req.method;
		let body: any = null;
		if (method !== "GET" && method !== "HEAD") {
			try {
				body = await req.clone().json();
			} catch {}
		}
		await admin.from("api_logs").insert({
			endpoint: pathname,
			method,
			message: "Request (middleware)",
			details: body ? JSON.stringify(body) : null,
		});
	} catch {}
}

export async function middleware(req: NextRequest) {
	const { pathname, search } = req.nextUrl;

	// ✅ 0) Never intercept NextAuth’s own routes
	if (pathname.startsWith("/api/auth")) {
		return NextResponse.next();
	}

	// in middleware.ts, inside middleware(req)
	if (pathname.startsWith("/api/cart")) {
		const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
		if (!token)
			return NextResponse.json({ error: "Sign in required" }, { status: 401 });
	}

	// 1) Hard-redirect anon users away from /checkout
	if (pathname === "/checkout") {
		const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
		if (!token) {
			const loginUrl = new URL(
				`/login?callbackUrl=${encodeURIComponent("/checkout")}`,
				req.url
			);
			return NextResponse.redirect(loginUrl);
		}
	}

	// 2) Require auth to PLACE orders
	if (pathname === "/api/orders" && req.method === "POST") {
		const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
		if (!token) {
			return NextResponse.json({ error: "Sign in required" }, { status: 401 });
		}
	}

	// 3) Admin page guard
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
			return NextResponse.redirect(new URL("/", req.url));
		}
	}

	// 4) Admin API guard
	if (pathname.startsWith("/api/admin/")) {
		const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
		if (!token || !isAdminFromToken(token)) {
			return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
		}
	}

	// 5) Best-effort API logging
	if (pathname.startsWith("/api/")) {
		await logApiRequest(req);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/checkout", "/admin/:path*", "/api/:path*"],
};
