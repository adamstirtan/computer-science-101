import { ref } from "vue";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

const user = ref<User | null>(null);
const loading = ref(true);

// Initialize session from existing Supabase session on module load
supabase.auth.getSession().then(({ data }) => {
  user.value = data.session?.user ?? null;
  loading.value = false;
});

// Keep user in sync with Supabase auth state changes (OAuth callbacks, signout, etc.)
supabase.auth.onAuthStateChange((_event, session) => {
  user.value = session?.user ?? null;
  loading.value = false;
});

async function signInWithGitHub(): Promise<void> {
  await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: window.location.origin,
    },
  });
}

async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export function useAuth() {
  return { user, loading, signInWithGitHub, signOut };
}
