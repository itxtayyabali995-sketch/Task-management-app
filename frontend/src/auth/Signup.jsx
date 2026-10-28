import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Upload, Save } from "lucide-react";

const Signup = ({ onSignupSuccess, onCancel }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [file, setFile] = useState(null);
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let cleanEmail = email.trim();
      if (!cleanEmail.includes("@")) {
        cleanEmail = `${cleanEmail}@gmail.com`;
      }

      const formData = new FormData();
      formData.append("fullname", fullName);
      formData.append("fullName", fullName);
      formData.append("email", cleanEmail);
      formData.append("password", password);
      formData.append("contact", contact);
      formData.append("phone", contact);

      // Selected File Append
      if (file) {
        formData.append("file", file);
      }

      let res;
      try {
        res = await axios.post("http://localhost:8000/api/v1/user/signup", formData);
      } catch (err1) {
        if (err1.response && err1.response.status === 404) {
          res = await axios.post("http://localhost:8000/api/v1/user/register", formData);
        } else {
          throw err1;
        }
      }

      if (res.data.success || res.status === 201 || res.status === 200) {
        if (onSignupSuccess) {
          onSignupSuccess();
        }
      } else {
        setError(res.data.message || res.data.error || "Registration failed");
      }
    } catch (err) {
      console.error("Signup error details:", err.response?.data || err);
      
      const serverError = 
        err.response?.data?.message || 
        err.response?.data?.error || 
        (typeof err.response?.data === 'string' ? err.response?.data : null) ||
        "Signup failed. Check backend console.";
      
      setError(serverError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/40 flex place-items-center justify-center z-50 p-4 select-none">
      <div className="bg-white rounded-md shadow-xl w-full max-w-lg overflow-hidden border border-gray-100">
        
        {/* Top Header */}
        <div className="bg-blue-600 px-6 py-4 text-white font-semibold text-lg select-none">
          Signup
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded font-medium">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div>
            <input
              type="text"
              placeholder="Full Name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3.5 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 bg-white"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="text"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3.5 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 bg-white pr-24"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none font-medium select-none">
              @gmail.com
            </span>
          </div>

          {/* Password & Contact */}
          <div className="grid grid-cols-2 gap-4">
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

            <div>
              <input
                type="text"
                placeholder="Contact"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full border border-gray-300 rounded px-3.5 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 bg-white"
              />
            </div>
          </div>

          {/* File Upload Button */}
          <div className="pt-2">
            <label className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded shadow-sm cursor-pointer transition uppercase select-none">
              <Upload className="w-4 h-4" />
              <span className="truncate max-w-50">
                {file ? file.name : "UPLOAD FILE"}
              </span>
              <input
                type="file"
                required
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
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
              className="flex items-center gap-1.5 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded shadow-sm transition uppercase cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? "SUBMITTING..." : "SUBMIT"}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Signup;