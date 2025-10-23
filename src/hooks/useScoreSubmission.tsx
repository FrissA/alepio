import { useAuthStore, useGuestStore } from "@zustand/store";
import { scoresAPI } from "@helpers/api";
import { useCallback } from "react";

/**
 * Hook to handle score submissions for both authenticated users and guests
 * Automatically submits as guest if not logged in, or as authenticated user if logged in
 */
export const useScoreSubmission = () => {
  const { isAuthenticated } = useAuthStore();
  const { guestUuid, addGuestScore } = useGuestStore();

  const submitScore = useCallback(
    async (score: number) => {
      try {
        if (isAuthenticated) {
          // Submit as authenticated user
          await scoresAPI.submitScore(score);
          console.log("Score submitted for authenticated user:", score);
        } else if (guestUuid) {
          // Submit as guest
          await scoresAPI.submitGuestScore(score, guestUuid);
          addGuestScore(score);
          console.log("Score submitted for guest:", score, guestUuid);
        } else {
          console.warn("No guest UUID available, score not submitted");
        }
      } catch (error) {
        console.error("Failed to submit score:", error);
        throw error;
      }
    },
    [isAuthenticated, guestUuid, addGuestScore]
  );

  return {
    submitScore,
    isAuthenticated,
    guestUuid,
  };
};
