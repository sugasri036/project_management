import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // ✅ FIX: use environment variable instead of localhost
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/user/me`,
          {
            withCredentials: true, // required for session cookie
          }
        );

        console.log("User:", res.data);

        // ✅ user exists → go to workspace/dashboard
        navigate("/workspace");

      } catch (err) {
        console.error("Not logged in:", err);

        // ❌ if session missing → go back to login
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  return <div>Logging you in...</div>;
};

export default AuthSuccess;