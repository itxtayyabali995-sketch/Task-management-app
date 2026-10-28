import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useState, useEffect, useRef } from "react"
import {
  ClipboardList,
  Bookmark,
  Briefcase,
  User,
  GraduationCap,
  Plus,
} from "lucide-react";
import logo from "../assets/logo.png";

const Navbar = ({
  isLoggedIn,
  user,
  activeTab,
  setActiveTab,
  onOpenModal,
  onLogout,
  onOpenLogin,
  onOpenSignup,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef(null);

  const displayName =
    user?.fullname ||
    user?.fullName ||
    user?.name ||
    user?.email?.split("@")[0] ||
    "User";

  const fallbackImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
    displayName
  )}`;

  // Outside click listener (Bahar click hote hi dropdown close ho jayega)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getProfileImage = () => {
    if (!user || imageError) return fallbackImage;

    let rawImg = user?.file || user?.profilePic || user?.avatar || user?.image;

    if (!rawImg) return fallbackImage;

    if (typeof rawImg === "object") {
      rawImg = rawImg.url || rawImg.secure_url || rawImg.path || rawImg.filename;
    }

    if (typeof rawImg !== "string" || !rawImg.trim()) return fallbackImage;

    let cleanPath = rawImg.trim().replace(/\\/g, "/");

    if (/^https?:\/\//i.test(cleanPath)) return cleanPath;

    cleanPath = cleanPath.replace(/^\/+/, "");

    if (cleanPath.startsWith("public/")) {
      cleanPath = cleanPath.slice("public/".length);
    }

    if (!cleanPath.startsWith("uploads/")) {
      cleanPath = `uploads/${cleanPath}`;
    }

    return `http://localhost:8000/${cleanPath}`;
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(false);
    if (onLogout) onLogout();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-3 flex items-center justify-between shadow-sm sticky top-0 z-50">
      {/* Logo & Navigation */}
      <div className="flex items-center gap-3 md:gap-6">
        <div className="flex items-center cursor-pointer">
          <img
            src={logo}
            alt="EVS Logo"
            className="h-9 w-auto object-contain"
          />
        </div>

        {isLoggedIn && (
          <nav className="flex items-center gap-1 md:gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition ${
                activeTab === "all"
                  ? "bg-blue-600 text-white"
                  : "text-blue-600 hover:bg-blue-50"
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              ALL TASKS
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("favorite")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition ${
                activeTab === "favorite"
                  ? "bg-blue-600 text-white"
                  : "text-blue-600 hover:bg-blue-50"
              }`}
            >
              <Bookmark className="w-4 h-4" />
              FAVORITE
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("work")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition ${
                activeTab === "work"
                  ? "bg-blue-600 text-white"
                  : "text-blue-600 hover:bg-blue-50"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              WORK
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("personal")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition ${
                activeTab === "personal"
                  ? "bg-blue-600 text-white"
                  : "text-blue-600 hover:bg-blue-50"
              }`}
            >
              <User className="w-4 h-4" />
              PERSONAL
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("learning")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition ${
                activeTab === "learning"
                  ? "bg-blue-600 text-white"
                  : "text-blue-600 hover:bg-blue-50"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              LEARNING
            </button>
          </nav>
        )}
      </div>

      {/* Right Side */}
      {isLoggedIn ? (
        <div className="flex items-center gap-3 md:gap-4 relative">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShowDropdown((prev) => !prev)}
              className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-300 flex items-center justify-center cursor-pointer focus:outline-none"
              aria-label="Open profile menu"
            >
              <Avatar className="w-full h-full">
                <AvatarImage
                  src={getProfileImage()}
                  onError={() => setImageError(true)}
                  alt={displayName}
                  className="object-cover w-full h-full"
                />
                <AvatarFallback>
                  {displayName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-md border border-gray-200 overflow-hidden z-50">
                <div className="px-4 py-3 text-xs text-gray-800 border-b border-gray-200 text-center font-medium capitalize truncate">
                  {displayName}
                </div>

                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="w-full text-center px-4 py-3 text-xs text-gray-800 hover:bg-gray-50 font-medium transition cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onOpenModal}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 md:px-4 py-2 rounded-md shadow-sm transition cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            ADD TASK
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenLogin}
            className="px-4 py-1.5 border border-gray-300 rounded text-xs font-bold text-blue-600 hover:bg-blue-50 uppercase tracking-wider transition cursor-pointer"
          >
            LOGIN
          </button>

          <button
            type="button"
            onClick={onOpenSignup}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-xs font-bold text-white uppercase tracking-wider shadow-sm transition cursor-pointer"
          >
            SIGNUP
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;