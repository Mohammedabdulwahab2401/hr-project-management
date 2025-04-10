import supabase from "/src/services/supabaseClient.js";

export const getUserRole = async () => {
  try {
    // Get the current authenticated user
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("[getUserRole] ❌ Error fetching session:", sessionError.message);
      return "guest"; // Return default role
    }

    const userId = session?.user?.id;
    if (!userId) {
      console.warn("[getUserRole] ⚠️ User not authenticated. Returning 'guest'.");
      return "guest";
    }

    console.log(`[getUserRole] 🔍 Fetching role for User ID: ${userId}`);

    // Fetch the role from the 'profiles' table
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("[getUserRole] ❌ Error fetching user role:", error.message);
      return "guest"; // Return a default role on error
    }

    const userRole = data?.role || "guest"; // Default to "guest" if no role is found
    console.log(`[getUserRole] ✅ User Role: ${userRole}`);

    return userRole;
  } catch (err) {
    console.error("[getUserRole] ❌ Unexpected Error:", err);
    return "guest"; // Default role if an exception occurs
  }
};
