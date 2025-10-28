"use server";
import { auth } from "@clerk/nextjs/server";
import { supabaseClient as supabase } from "@/lib/supabse";
import { revalidateTag, unstable_cache } from "next/cache";

export async function addNewReserve(reserveData) {
  const { userId } = await auth();

  if (!userId) return { error: "User ID is required" };

  try {
    const { data, error } = await supabase
      .from("reservations")
      .insert([
        {
          room_id: reserveData.roomId,
          guest_name: reserveData.guestName,
          guest_phone: reserveData.guestPhone,
          check_in: reserveData.checkIn,
          check_out: reserveData.checkOut,
          special_requests: reserveData.notes,
          adults: reserveData.adults,
          total_price: reserveData.totalAmount,
          status: "CONFIRMED",
          discount: reserveData.discount,
          discounttotal: reserveData.discounttotal,
          addprice: reserveData.addPrice,
          addpricedesc: reserveData.addpricedesc,
          roomprice: reserveData.roomPrice,
          owner_id: userId,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return { error: error.message };
    }
    revalidateTag("userReserves");
    return { success: true, data };
  } catch (err) {
    console.error("Server error:", err);
    return { error: "Failed to create new reserve" };
  }
}

export async function editReservation(reserveData, reserveID) {
  const { userId } = await auth();

  if (!userId) return { error: "User ID is required" };

  try {
    const { data, error } = await supabase
      .from("reservations")
      .update([
        {
          room_id: reserveData.roomId,
          guest_name: reserveData.guestName,
          guest_phone: reserveData.guestPhone,
          check_in: reserveData.checkIn,
          check_out: reserveData.checkOut,
          special_requests: reserveData.notes,
          adults: reserveData.adults,
          total_price: reserveData.totalAmount,
          status: String(reserveData.status).toUpperCase(),
          owner_id: userId,
          discount: reserveData.discount,
          discounttotal: reserveData.discounttotal,
          addprice: reserveData.addPrice,
          addpricedesc: reserveData.addpricedesc,
          roomprice: reserveData.roomPrice,
        },
      ])
      .eq("owner_id", userId)
      .eq("id", reserveID)
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return { error: error.message };
    }
    revalidateTag("userReserves");
    return { success: true, data };
  } catch (err) {
    console.error("Server error:", err);
    return { error: "Failed to edit reserve" };
  }
}

export async function deleteReservation(reserveID) {
  const { userId } = await auth();

  if (!userId) return { error: "User ID is required" };

  try {
    const { data, error } = await supabase
      .from("reservations")
      .delete()
      .eq("owner_id", userId)
      .eq("id", reserveID)
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return { error: error.message };
    }
    revalidateTag("userReserves");
    return { success: true, data };
  } catch (err) {
    console.error("Server error:", err);
    return { error: "Failed to delete reserve" };
  }
}

const getUserReservationsCache = unstable_cache(
  async (userId) => {
    const { data, error } = await supabase
      .from("reservations")
      .select()
      .eq("owner_id", userId);

    if (error) throw error;
    return data;
  },
  ["user-data"],
  { tags: ["userReserves"], revalidate: 3600 }
);

export async function getUserReservations() {
  const { userId } = await auth();

  if (!userId) return { error: "User ID is required" };

  try {
    const data = await getUserReservationsCache(userId);
    return { success: true, data };
  } catch (err) {
    console.error("Server error:", err);
    return { error: "Failed to fetch reserves" };
  }
}
