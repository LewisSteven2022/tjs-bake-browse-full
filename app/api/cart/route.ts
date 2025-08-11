// app/api/cart/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { admin } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Item = {
	product_id: string;
	name: string;
	price_pence: number;
	qty: number;
};

const ok = (json: any, status = 200) => NextResponse.json(json, { status });
const err = (message: string, status = 400) =>
	NextResponse.json({ error: message }, { status });

const toInt = (v: any, d = 0) => {
	const n = Number(v);
	return Number.isFinite(n) ? Math.trunc(n) : d;
};

async function ensureCart(userId: string) {
	// Idempotent: creates a row in carts if not present
	const { error } = await admin
		.from("carts")
		.upsert({ user_id: userId }, { onConflict: "user_id" });
	if (error) throw new Error(error.message);
}

function getUserIdFromSession(session: any): string | null {
	// relies on your NextAuth session callback setting user.id
	return (session?.user as any)?.id ?? null;
}

// GET /api/cart — list items for the signed-in user
export async function GET() {
	try {
		const session = await getServerSession(authOptions);
		const userId = getUserIdFromSession(session);
		if (!userId) return ok({ items: [] }, 200);

		const { data, error } = await admin
			.from("cart_items")
			.select("product_id,name,price_pence,qty")
			.eq("user_id", userId)
			.order("created_at", { ascending: true });

		if (error) return err(error.message, 500);
		return ok({ items: data ?? [] }, 200);
	} catch (e: any) {
		return err(e?.message || "Unexpected error", 500);
	}
}

// POST /api/cart — add/increment an item
export async function POST(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		const userId = getUserIdFromSession(session);
		if (!userId) return err("Sign in required", 401);

		const body = await req.json().catch(() => ({}));
		const product_id = String(body?.product_id || "").trim();
		const name = String(body?.name || "").trim();
		const price_pence = toInt(body?.price_pence, -1);
		const qty = toInt(body?.qty, -1);

		if (!product_id || !name || price_pence < 0 || qty <= 0) {
			return err("product_id, name, price_pence (>=0), qty (>0) required", 400);
		}

		await ensureCart(userId);

		// Read existing qty (if any)
		const { data: existing, error: readErr } = await admin
			.from("cart_items")
			.select("qty")
			.eq("user_id", userId)
			.eq("product_id", product_id)
			.maybeSingle();

		if (readErr) return err(readErr.message, 500);

		const newQty = toInt((existing?.qty ?? 0) + qty, qty);

		const { error: upsertErr } = await admin
			.from("cart_items")
			.upsert(
				{ user_id: userId, product_id, name, price_pence, qty: newQty },
				{ onConflict: "user_id,product_id" }
			);

		if (upsertErr) return err(upsertErr.message, 500);
		return ok({ ok: true }, 200);
	} catch (e: any) {
		return err(e?.message || "Unexpected error", 500);
	}
}

// PATCH /api/cart — set quantity for an item (or delete if <= 0)
export async function PATCH(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		const userId = getUserIdFromSession(session);
		if (!userId) return err("Sign in required", 401);

		const body = await req.json().catch(() => ({}));
		const product_id = String(body?.product_id || "").trim();
		const qty = toInt(body?.qty, NaN);

		if (!product_id || !Number.isFinite(qty)) {
			return err("product_id and qty required", 400);
		}

		if (qty <= 0) {
			const { error: delErr } = await admin
				.from("cart_items")
				.delete()
				.eq("user_id", userId)
				.eq("product_id", product_id);
			if (delErr) return err(delErr.message, 500);
			return ok({ ok: true }, 200);
		}

		const { error: updErr } = await admin
			.from("cart_items")
			.update({ qty })
			.eq("user_id", userId)
			.eq("product_id", product_id);

		if (updErr) return err(updErr.message, 500);
		return ok({ ok: true }, 200);
	} catch (e: any) {
		return err(e?.message || "Unexpected error", 500);
	}
}

// DELETE /api/cart — remove a specific item
export async function DELETE(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		const userId = getUserIdFromSession(session);
		if (!userId) return err("Sign in required", 401);

		const body = await req.json().catch(() => ({}));
		const product_id = String(body?.product_id || "").trim();
		if (!product_id) return err("product_id required", 400);

		const { error } = await admin
			.from("cart_items")
			.delete()
			.eq("user_id", userId)
			.eq("product_id", product_id);

		if (error) return err(error.message, 500);
		return ok({ ok: true }, 200);
	} catch (e: any) {
		return err(e?.message || "Unexpected error", 500);
	}
}
