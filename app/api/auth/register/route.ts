import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { admin } from "@/lib/db";

// POST /api/auth/register
// Body: { name, email, mobile?, password }
export async function POST(req: NextRequest) {
	try {
		const body = await req.json().catch(() => null);
		const name = (body?.name || "").toString().trim();
		const email = (body?.email || "").toString().trim().toLowerCase();
		const mobile = (body?.mobile || "").toString().trim();
		const password = (body?.password || "").toString();

		if (!name || !email || !password) {
			return NextResponse.json(
				{ error: "name, email, password are required" },
				{ status: 400 }
			);
		}

		// Check existing
		const { data: existing, error: exErr } = await admin
			.from("users")
			.select("id")
			.eq("email", email)
			.maybeSingle();
		if (exErr) throw exErr;
		if (existing) {
			return NextResponse.json(
				{ error: "An account with that email already exists" },
				{ status: 409 }
			);
		}

		const hash = await bcrypt.hash(password, 10);

		const { data, error } = await admin
			.from("users")
			.insert({
				name,
				email,
				mobile: mobile || null,
				password_hash: hash,
				role: "customer",
			})
			.select("id")
			.single();

		if (error) throw error;

		return NextResponse.json({ ok: true, id: data?.id }, { status: 201 });
	} catch (e: any) {
		return NextResponse.json(
			{ error: e?.message || "Failed to register" },
			{ status: 500 }
		);
	}
}
