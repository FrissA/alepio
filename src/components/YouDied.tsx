import { useEffect, useState } from "react";

import { useGameStore } from "@zustand/store";
import { useAuthStore } from "@zustand/store";
import { GameStatuses } from "@zustand/GameStore";
import { useSound } from "@hooks/useSound";
import { useScoreSubmission } from "@hooks/useScoreSubmission";
import { authAPI } from "@helpers/api";

import actionSound from "@assets/sounds/action.wav";

const YouDied: React.FC = () => {
  const setGameStatus = useGameStore((state) => state.setGameStatus);
  const score = useGameStore((state) => state.score);
  const setScore = useGameStore((state) => state.setScore);
  const maxScore = useGameStore((state) => state.maxScore);
  const { isAuthenticated } = useAuthStore();
  const { submitScore } = useScoreSubmission();

  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isMobileControls = useGameStore((state) => state.isMobileControls);

  const actionAudio = useSound(actionSound);


  const handleBackToMenu = () => {
    actionAudio.play();
    setGameStatus(GameStatuses.menu);
    setScore(0);

    setScoreSubmitted(false);
    setSubmitError(null);
  };

  // Auto-submit score when component mounts (user dies)
  useEffect(() => {
    const handleScoreSubmit = async () => {
      if (score > 0 && !scoreSubmitted) {
        try {
          await submitScore(score);
          setScoreSubmitted(true);
        } catch (error) {
          console.error("Failed to submit score:", error);
          setSubmitError("Failed to save score");
        }
      }
    };

    handleScoreSubmit();
  }, [score, scoreSubmitted, submitScore]);

  useEffect(() => {
    if (isMobileControls) return; // Don't listen for keyboard on mobile

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        handleBackToMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileControls]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = () => {
    window.location.href = authAPI.loginUrl;
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black text-green-400 font-mono">
      <div
        className="border-4 border-green-500 rounded-lg p-6 shadow-lg bg-black/80 backdrop-blur-md max-w-md text-center 
      animate-terminal border-glow"
      >
        <h1 className="text-4xl font-[Orbitron] font-bold tracking-wide uppercase animate-fade-in text-red-500">
          You Died
        </h1>
        <h2 className="text-2xl font-[Orbitron] mt-4 animate-fade-in">
          Your score: <span className="text-white">{score}</span>
        </h2>
        <h3 className="text-xl font-[Orbitron] mt-2 animate-fade-in">
          Max score: <span className="text-white">{maxScore}</span>
        </h3>
        {isAuthenticated && scoreSubmitted && (
          <p className="mt-3 text-green-500 text-sm font-[Orbitron]">
            ✓ Score saved to your account!
          </p>
        )}
        {!isAuthenticated && scoreSubmitted && (
          <div className="mt-4 p-4 bg-yellow-900/30 border border-yellow-500 rounded">
            <p className="text-yellow-400 text-sm font-[Orbitron] mb-3">
              Guest score saved! Login to keep your scores forever.
            </p>
            <button
              onClick={handleLogin}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-[Orbitron] text-sm transition-colors flex items-center gap-2 mx-auto"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              Login with GitHub
            </button>
          </div>
        )}
        {submitError && (
          <p className="mt-2 text-red-500 text-sm font-[Orbitron]">{submitError}</p>
        )}
        {isMobileControls ? (
          <button
            onClick={handleBackToMenu}
            className="mt-6 px-8 py-3 bg-green-500 text-white font-[Orbitron] font-bold rounded-lg 
            hover:bg-green-400 active:bg-green-600 transition-colors uppercase tracking-wide
            border-2 border-green-300 shadow-lg"
          >
            Back to Menu
          </button>
        ) : (
          <p className="mt-4 font-[Orbitron] text-lg animate-flicker">
            Press the <span className="text-white">space bar</span> to go back
            to the menu
          </p>
        )}
      </div>
    </div>
  );
};

export default YouDied;
