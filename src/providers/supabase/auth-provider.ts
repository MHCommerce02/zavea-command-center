import { AuthProvider } from "../ports/repositories";
import { getSupabaseBrowserClient } from "./client";

export class SupabaseAuthProvider implements AuthProvider {
  async signInWithPassword(email: string, password: string) {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      return {
        error: error?.message ?? "Sign-in failed with no error details returned.",
        status: error?.status,
        code: (error as { code?: string } | null)?.code,
      };
    }
    return { userId: data.user.id };
  }

  async signOut() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
  }

  async getCurrentUserId() {
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase.auth.getUser();
    return data.user?.id ?? null;
  }

  onAuthStateChange(callback: (userId: string | null) => void) {
    const supabase = getSupabaseBrowserClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }
}
