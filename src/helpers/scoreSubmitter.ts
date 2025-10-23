import { useAuthStore } from "@zustand/store";
import { scoresAPI } from "@helpers/api";
import { useState } from "react";

/**
 * Example component showing how to submit scores with authentication
 * This can be integrated into your game logic when a player dies/finishes
 */
const ScoreSubmitter = () => {
  const { isAuthenticated } = useAuthStore();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string>("");

  const submitScore = async (score: number) => {
    if (!isAuthenticated) {
      setMessage("Please login to submit scores!");
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");
      await scoresAPI.submitScore(score);
      setMessage(`Score ${score} submitted successfully! 🎉`);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to submit score"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitScore,
    submitting,
    message,
    isAuthenticated,
  };
};

export default ScoreSubmitter;
