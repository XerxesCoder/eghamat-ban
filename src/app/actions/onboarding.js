"use server";

import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { supabaseClient as supabase } from "@/lib/supabse";

export const completeOnboarding = async (formData) => {
  const { userId } = await auth();

  if (!userId) {
    return { message: "No Logged In User" };
  }

  const user = await currentUser();
  if (!user) {
    return { message: "No User Found" };
  }
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        name: formData.firstName,
        lastname: formData.lastName,
        phone: formData.phone,
        email: user.emailAddresses[0].emailAddress,
        username: user.username,
        clerk: userId,
      },
    ])
    .select();

  const client = await clerkClient();

  try {
    const res = await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
      },
    });
    return { message: res.publicMetadata };
  } catch (err) {
    return { error: "There was an error updating the user metadata." };
  }
};
