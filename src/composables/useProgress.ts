import { ref, watch } from "vue";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";

const completedSlugs = ref<Set<string>>(new Set());

const { user } = useAuth();

async function loadProgress(userId: string): Promise<void> {
  const { data, error } = await supabase
    .from("user_progress")
    .select("slug")
    .eq("user_id", userId);

  if (error) {
    console.error("[progress] Failed to load progress:", error.message);
    return;
  }

  completedSlugs.value = new Set((data ?? []).map((row) => row.slug as string));
}

async function markComplete(slug: string): Promise<void> {
  const userId = user.value?.id;

  if (!userId) {
    return;
  }

  // Optimistic update
  completedSlugs.value = new Set([...completedSlugs.value, slug]);

  const { error } = await supabase
    .from("user_progress")
    .upsert({ user_id: userId, slug }, { onConflict: "user_id,slug" });

  if (error) {
    console.error("[progress] Failed to mark complete:", error.message);
    // Revert optimistic update on failure
    const next = new Set(completedSlugs.value);
    next.delete(slug);
    completedSlugs.value = next;
  }
}

// Load progress when user logs in, clear when user logs out
watch(
  user,
  (currentUser) => {
    if (currentUser) {
      void loadProgress(currentUser.id);
    } else {
      completedSlugs.value = new Set();
    }
  },
  { immediate: true },
);

export function useProgress() {
  return { completedSlugs, markComplete };
}
