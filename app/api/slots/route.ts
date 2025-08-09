import { NextResponse } from "next/server";
import { generateSlots } from "@/lib/slots";
export async function GET(){
  const now = new Date();
  const slots = generateSlots(now, 7, '09:00', '17:00');
  return NextResponse.json({ slots });
}
