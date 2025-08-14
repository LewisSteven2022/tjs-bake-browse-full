import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { admin } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions as any);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  const { data, error } = await admin.from("users").select("bag_pref").eq("id", userId).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ bag_pref: data?.bag_pref ?? null });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions as any);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const bag_pref = body?.bag_pref === true;
  const { error } = await admin
    .from("users")
    .update({ bag_pref, updated_at: new Date().toISOString() })
    .eq("id", userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, bag_pref });
}


