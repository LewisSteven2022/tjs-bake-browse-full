import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { admin } from "@/lib/db";
import { z } from "zod";

// POST /api/auth/register
// Body: { name, email, mobile?, password }
const registerSchema = z.object({
	name: z.string().trim().min(1, "name required"),
	email: z.string().trim().toLowerCase().email("invalid email"),
	mobile: z.string().trim().optional().default(""),
	password: z.string().min(8, "password must be at least 8 characters"),
});

export async function POST(req: NextRequest) {
	try {
		const raw = await req.json().catch(() => null);
		const parsed = registerSchema.safeParse(raw || {});
		if (!parsed.success) {
			const msg = parsed.error.issues?.[0]?.message || "Invalid input";
			return NextResponse.json({ error: msg }, { status: 400 });
		}
		const { name, email, mobile, password } = parsed.data;

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
				phone: mobile || null,
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
