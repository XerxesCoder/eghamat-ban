"use server";
import { auth } from "@clerk/nextjs/server";
import { supabaseClient as supabase } from "@/lib/supabse";
import { revalidateTag, unstable_cache } from "next/cache";

export async function addNewRoom(roomData) {
  const { userId } = await auth();

  if (!userId) return { error: "User ID is required" };

  try {
    const { data, error } = await supabase
      .from("rooms")
      .insert([
        {
          room_number: roomData.number,
          type: String(roomData.type).toUpperCase(),
          capacity: roomData.capacity,
          price_per_night: roomData.price,
          amenities: roomData.amenities,
          owner_id: userId,
          price_tag: roomData.priceTag,
          status: roomData.status,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return { error: error.message };
    }
    revalidateTag("userRooms");

    return { success: true, data };
  } catch (err) {
    console.error("Server error:", err);
    return { error: err.message };
  }
}

export async function editRoom(roomData, roomID) {
  const { userId } = await auth();

  if (!userId) return { error: "User ID is required" };

  try {
    const { data, error } = await supabase
      .from("rooms")
      .update([
        {
          room_number: roomData.number,
          type: String(roomData.type).toUpperCase(),
          capacity: roomData.capacity,
          price_per_night: roomData.price,
          amenities: roomData.amenities,
          price_tag: roomData.pricaTag,
          status: roomData.status,
        },
      ])
      .eq("owner_id", userId)
      .eq("id", roomID)
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return { error: error.message };
    }
    revalidateTag("userRooms");

    return { success: true, data };
  } catch (err) {
    console.error("Server error:", err);
    return { error: err.message };
  }
}

export async function deleteRoom(roomID) {
  const { userId } = await auth();

  if (!userId) return { error: "User ID is required" };

  try {
    const { data, error } = await supabase
      .from("rooms")
      .delete()
      .eq("owner_id", userId)
      .eq("id", roomID)
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return { error: error.message };
    }
    revalidateTag("userRooms");
    return { success: true, data };
  } catch (err) {
    console.error("Server error:", err);
    return { error: "خطای سرور" };
  }
}

const getCachedUserRooms = unstable_cache(
  async (userId) => {
    const { data, error } = await supabase
      .from("rooms")
      .select()
      .eq("owner_id", userId);

    if (error) throw error;
    return data;
  },
  ["user-data"],
  { tags: ["userRooms"], revalidate: 3600 }
);

export async function getUserRooms() {
  const { userId } = await auth();
  if (!userId) return { error: "User ID is required" };

  try {
    const data = await getCachedUserRooms(userId);

    return { success: true, data };
  } catch (err) {
    console.error("Server Error:", err);
    return { error: "Failed to get rooms" };
  }
}
