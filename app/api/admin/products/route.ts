import { NextResponse } from "next/server";
import { admin } from "@/lib/db";
export async function GET(){
  const { data, error } = await admin.from('products').select('*').order('created_at',{ascending:false});
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data });
}
export async function POST(req: Request){
  const body = await req.json().catch(()=>null);
  if (!body || !body.name || !body.sku || typeof body.price_pence !== 'number') {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const { data, error } = await admin.from('products').insert(body).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}
