import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore, useGuestStore } from "@zustand/store";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const migrateToUser = useGuestStore((state) => state.migrateToUser);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        setAuth(token, user);
        
        // Migrate guest scores (clear guest data)
        migrateToUser();
        
        navigate("/", { replace: true });
      } catch (err) {
        console.error("Failed to parse user data:", err);
        setError("Failed to complete authentication. Please try again.");
      }
    } else {
      setError("Missing authentication data. Please try logging in again.");
    }
  }, [searchParams, setAuth, migrateToUser, navigate]);

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            Authentication Error
          </h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-300 text-lg">Completing authentication...</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
