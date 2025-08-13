import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const supabase = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
			{ auth: { persistSession: false } }
		);

		const { data, error } = await supabase
			.from("configurable_fees")
			.select("*")
			.eq("is_active", true);

		if (error) {
			// silent
			return NextResponse.json(
				{ error: "Failed to fetch fees" },
				{ status: 500 }
			);
		}

		return NextResponse.json({ fees: data || [] });
	} catch (error) {
		// silent
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
