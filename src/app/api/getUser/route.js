import { supabaseClient as supabase } from "@/lib/supabse";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { data: users, error } = await supabase.from("users").select("*");

    if (error) {
      throw error;
    }

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
