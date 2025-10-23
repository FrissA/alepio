import { useEffect, useRef } from "react";
import { useGameStore } from "@zustand/store";
import { useScoreSubmission } from "@hooks/useScoreSubmission";

/**
 * Component that automatically submits scores every 50 points during gameplay
 * This runs in the background and doesn't render anything
 */
const ScoreTracker = () => {
  const score = useGameStore((state) => state.score);
  const { submitScore } = useScoreSubmission();
  const lastSubmittedRef = useRef(0);

  useEffect(() => {
    // Calculate the milestone (every 50 points)
    const milestone = Math.floor(score / 50) * 50;

    // Submit if we've reached a new milestone and haven't submitted this one yet
    if (score > 0 && milestone > lastSubmittedRef.current && milestone > 0) {
      submitScore(score)
        .then(() => {
          lastSubmittedRef.current = milestone;
          console.log(`Score milestone ${milestone} submitted`);
        })
        .catch((error) => {
          console.error("Failed to submit score milestone:", error);
        });
    }
  }, [score, submitScore]);

  // Reset when score goes back to 0 (new game)
  useEffect(() => {
    if (score === 0) {
      lastSubmittedRef.current = 0;
    }
  }, [score]);

  return null; // This component doesn't render anything
};

export default ScoreTracker;
