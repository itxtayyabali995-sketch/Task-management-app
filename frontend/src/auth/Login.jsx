import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

const Login = ({ onLoginSuccess, onCancel }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let cleanEmail = email.trim();
      if (!cleanEmail.includes("@")) {
        cleanEmail = `${cleanEmail}@gmail.com`;
      }

      const res = await axios.post("http://localhost:8000/api/v1/user/login", {
        email: cleanEmail,
        password,
      });

      if (res.data.success || res.data.token) {
        const token = res.data.token || "authenticated";
        const userObj = res.data.user || res.data.userData || { fullName: cleanEmail.split("@")[0] };

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userObj));

        if (onLoginSuccess) {
          onLoginSuccess(token, userObj);
        }
      } else {
        setError(res.data.message || "Invalid Email or Password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Incorrect email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/30 flex items-center justify-center z-50 p-4 select-none">
      <div className="bg-white rounded-md shadow-xl w-full max-w-md overflow-hidden border border-gray-100">
        
        {/* Top Header */}
        <div className="bg-blue-600 px-6 py-4 text-white font-semibold text-lg select-none">
          Login
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-2.5 rounded font-medium">
              {error}
            </div>
          )}

          {/* Email Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Email or Username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3.5 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 bg-white pr-24"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none font-medium select-none">
              @gmail.com
            </span>
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3.5 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 bg-white pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer select-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end items-center gap-4 pt-4 select-none">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition uppercase cursor-pointer"
            >
              CANCEL
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded shadow-sm transition uppercase cursor-pointer disabled:opacity-50"
            >
              {loading ? "SUBMITTING..." : "SUBMIT"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Login;