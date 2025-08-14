import { admin } from "@/lib/db";

const DEFAULT_BAG_FEE_PENCE = 70;

export async function getBagFeePence(): Promise<number> {
	try {
		const { data, error } = await admin
			.from("configurable_fees")
			.select("name, amount_pence, is_active")
			.eq("is_active", true);
		if (error) throw error;
		const bag = (data || []).find(
			(r: any) => (r?.name || "").toLowerCase() === "bag fee"
		);
		const amt = Number(bag?.amount_pence);
		return Number.isFinite(amt) && amt >= 0 ? amt : DEFAULT_BAG_FEE_PENCE;
	} catch {
		return DEFAULT_BAG_FEE_PENCE;
	}
}
