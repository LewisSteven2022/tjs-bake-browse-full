import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE!;
if (!supabaseUrl) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
// silent
export const admin = createClient(supabaseUrl, serviceRole || "invalid");
export const db = {
	oneUserByEmail(email: string) {
		return admin.from("users").select("*").eq("email", email).maybeSingle();
	},
	listVisibleProducts() {
		return admin
			.from("products")
			.select("*")
			.gt("stock_quantity", 0)
			.eq("is_visible", true)
			.order("created_at", { ascending: false });
	},
};
