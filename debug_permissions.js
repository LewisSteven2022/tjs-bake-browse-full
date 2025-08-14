// Debug script to test database permissions and see exactly what's happening

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE;

console.log("🔍 Testing Database Connections...\n");

// Test 1: Admin client (service role)
const adminClient = createClient(supabaseUrl, serviceRole);
const adminResult = await adminClient
	.from("products")
	.select("id, name, price_pence, image_url")
	.eq("name", "Chocolate Cookies")
	.single();

console.log("📊 ADMIN CLIENT (service role):");
console.log("Data:", adminResult.data);
console.log("Error:", adminResult.error);
console.log("---");

// Test 2: Anonymous client
const anonClient = createClient(supabaseUrl, anonKey, {
	auth: { persistSession: false },
});
const anonResult = await anonClient
	.from("products")
	.select("id, name, price_pence, image_url")
	.eq("name", "Chocolate Cookies")
	.single();

console.log("📊 ANONYMOUS CLIENT (anon key):");
console.log("Data:", anonResult.data);
console.log("Error:", anonResult.error);
console.log("---");

// Test 3: Check if they return the same data
const adminData = adminResult.data;
const anonData = anonResult.data;

if (adminData && anonData) {
	console.log("🔍 COMPARISON:");
	console.log("Admin price_pence:", adminData.price_pence);
	console.log("Anon price_pence:", anonData.price_pence);
	console.log("Admin image_url:", adminData.image_url);
	console.log("Anon image_url:", anonData.image_url);

	if (adminData.price_pence !== anonData.price_pence) {
		console.log("❌ PRICE MISMATCH! Different database views!");
	}
	if (adminData.image_url !== anonData.image_url) {
		console.log("❌ IMAGE_URL MISMATCH! Different database views!");
	}
	if (
		adminData.price_pence === anonData.price_pence &&
		adminData.image_url === anonData.image_url
	) {
		console.log("✅ Data matches - issue is elsewhere");
	}
} else {
	console.log("❌ One or both queries failed");
}
