import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // 🔥 VERY IMPORTANT: fetch logged-in user
        const res = await axios.get("http://localhost:5000/api/user/me", {
          withCredentials: true, // required for session cookie
        });

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
  }, []);

  return <div>Logging you in...</div>;
};

export default AuthSuccess;