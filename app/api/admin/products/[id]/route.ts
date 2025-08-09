import { NextResponse } from "next/server";
import { admin } from "@/lib/db";
export async function PATCH(req: Request, { params }: { params: { id: string } }){
  const body = await req.json().catch(()=>null);
  const { data, error } = await admin.from('products').update(body).eq('id', params.id).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}
export async function DELETE(_: Request, { params }: { params: { id: string } }){
  const { error } = await admin.from('products').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
