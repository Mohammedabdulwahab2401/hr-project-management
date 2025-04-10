import supabase from "../../services/supabaseClient";

export async function getUserRole() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (error) throw error;
      return data.role;
    }
    return null;
  }