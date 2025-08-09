import { NextResponse } from "next/server";
import { admin } from "@/lib/db";

const ALLOWED = [
	"pending",
	"preparing",
	"ready",
	"collected",
	"cancelled",
	"rejected",
];

export async function PATCH(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const { status } = await req.json();
		if (!ALLOWED.includes(status)) {
			return NextResponse.json({ error: "Invalid status" }, { status: 400 });
		}
		const { data, error } = await admin
			.from("orders")
			.update({ status })
			.eq("id", params.id)
			.select()
			.single();
		if (error) throw error;
		return NextResponse.json({ order: data });
	} catch (e: any) {
		return NextResponse.json({ error: e.message }, { status: 500 });
	}
}
