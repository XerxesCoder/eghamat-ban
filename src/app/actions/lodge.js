"use server";
import { auth } from "@clerk/nextjs/server";
import { supabaseClient as supabase } from "@/lib/supabse";
import { revalidateTag, unstable_cache } from "next/cache";

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
          motel_card: motelData.card,
          motel_card_name: motelData.cardName,
          motel_iban: motelData.iban,
          motel_phone: motelData.phone,
          motel_amenities: motelData.amenities,
          motel_checkin: motelData.checkInTime,
          motel_checkout: motelData.checkOutTime,
        },
      ])
      .select()
      .eq("clerk", userId);

    if (error) {
      console.error("Server error:", error);
      return { error: error.message };
    }
    revalidateTag("userLodge");
    return { success: true, data };
  } catch (err) {
    console.error("Server error:", err);
    return { error: "Failed to create user" };
  }
}

const getCachedUserLodge = unstable_cache(
  async (userId) => {
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("clerk", userId);

    if (error) throw error;
    return data;
  },
  ["user-data"],
  { tags: ["userLodge"], revalidate: 3600 }
);

export async function getUserLodge() {
  const { userId } = await auth();

  if (!userId) return { error: "User ID is required" };

  try {
    const data = await getCachedUserLodge(userId);

    return { success: true, data };
  } catch (err) {
    console.error("Server error:", err);
    return { error: "Failed to get user data" };
  }
}

export async function getUserDataJson() {
  const { userId } = await auth();

  if (!userId) return { error: "User ID is required" };

  try {
    // Get user data
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select()
      .eq("clerk", userId)
      .single();

    if (userError) throw userError;

    const { data: roomData, error: roomError } = await supabase
      .from("rooms")
      .select()
      .eq("owner_id", userId);

    if (roomError) throw roomError;

    const { data: reservationData, error: reservationError } = await supabase
      .from("reservations")
      .select()
      .eq("owner_id", userId);

    if (reservationError) throw reservationError;

    return {
      success: true,
      data: {
        lodge: userData,
        rooms: roomData,
        reservations: reservationData,
      },
    };
  } catch (err) {
    console.error("Server error:", err);
    return { error: "Failed to get user data" };
  }
}
