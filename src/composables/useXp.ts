import { ref, watch } from "vue";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";

const totalXp = ref(0);

const { user } = useAuth();

async function loadXp(userId: string): Promise<void> {
  const { data, error } = await supabase
    .from("user_xp")
    .select("total_xp")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("[xp] Failed to load XP:", error.message);
    return;
  }

  totalXp.value = (data?.total_xp as number | null) ?? 0;
}

async function awardXp(amount: number): Promise<void> {
  const userId = user.value?.id;

  if (!userId || amount <= 0) {
    return;
  }

  // Optimistic update
  totalXp.value += amount;

  const { error } = await supabase
    .from("user_xp")
    .upsert(
      {
        user_id: userId,
        total_xp: totalXp.value,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );

  if (error) {
    console.error("[xp] Failed to award XP:", error.message);
    // Revert
    totalXp.value -= amount;
  }
}

async function recordAnswers(
  articleSlug: string,
  answers: Array<{ questionId: string; correct: boolean }>,
): Promise<void> {
  const userId = user.value?.id;

  if (!userId) {
    return;
  }

  const rows = answers.map((a) => ({
    user_id: userId,
    article_slug: articleSlug,
    question_id: a.questionId,
    answered_correctly: a.correct,
  }));

  const { error } = await supabase
    .from("user_question_answers")
    .upsert(rows, { onConflict: "user_id,article_slug,question_id" });

  if (error) {
    console.error("[xp] Failed to record answers:", error.message);
  }
}

watch(
  user,
  (currentUser) => {
    if (currentUser) {
      void loadXp(currentUser.id);
    } else {
      totalXp.value = 0;
    }
  },
  { immediate: true },
);

export function useXp() {
  return { totalXp, awardXp, recordAnswers };
}
