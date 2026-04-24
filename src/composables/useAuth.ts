import { ref } from "vue";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

const user = ref<User | null>(null);
const loading = ref(true);

async function initializeAuth(): Promise<void> {
  const callbackUrl = new URL(window.location.href);
  const hasOAuthCode = callbackUrl.searchParams.has("code");

  if (hasOAuthCode) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(
      window.location.href,
    );

    if (error) {
      console.error("[auth] Failed to exchange OAuth code:", error.message);
    } else {
      user.value = data.session?.user ?? null;
      callbackUrl.searchParams.delete("code");
      callbackUrl.searchParams.delete("state");
      window.history.replaceState(
        {},
        document.title,
        `${callbackUrl.pathname}${callbackUrl.search}${callbackUrl.hash}`,
      );
    }
  }

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error("[auth] Failed to load session:", error.message);
  }

  user.value = data.session?.user ?? null;
  loading.value = false;
}

void initializeAuth();

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
