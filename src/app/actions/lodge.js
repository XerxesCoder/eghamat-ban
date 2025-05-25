"use server";
import { auth } from "@clerk/nextjs/server";
import { supabaseClient as supabase } from "@/lib/supabse";

export async function createOrUpdateMotel(motelData) {
  const { userId } = await auth();

  if (!userId) return { error: "User ID is required" };

  try {
    const { data, error } = await supabase
      .from("users")
      .update([
        {
          motel_name: motelData.name,
          motel_address: motelData.address,
          motel_city: motelData.city,
          motel_state: motelData.county,
          motel_phone: motelData.phone,
          motel_amenities: motelData.amenities,
          motel_checkin: motelData.checkInTime,
          motel_checkout: motelData.checkOutTime,
        },
      ])
      .select()
      .eq("clerk", userId);

    if (error) {
      console.error("Supabase error:", error);
      return { error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Server error:", err);
    return { error: "Failed to create motel" };
  }
}

export async function getUserLodge() {
  const { userId } = await auth();

  if (!userId) return { error: "User ID is required" };

  try {
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("clerk", userId);

    if (error) {
      console.error("DB error:", error);
      return { error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Server error:", err);
    return { error: "Failed to create motel" };
  }
}
