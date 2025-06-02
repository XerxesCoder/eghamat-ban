"use server";
import { auth } from "@clerk/nextjs/server";
import { supabaseClient as supabase } from "@/lib/supabse";

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
          status: "AVAILABLE",
        },
      ])
      .select();

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
          status: roomData.status
        },
      ])
      .eq("owner_id", userId)
      .eq("id", roomID)
      .select();

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

    return { success: true, data };
  } catch (err) {
    console.error("Server error:", err);
    return { error: "Failed to create motel" };
  }
}

export async function getUserRooms() {
  const { userId } = await auth();

  if (!userId) return { error: "User ID is required" };

  try {
    const { data, error } = await supabase
      .from("rooms")
      .select()
      .eq("owner_id", userId);

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
