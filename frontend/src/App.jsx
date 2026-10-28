import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import TaskModal from "./components/TaskModal";
import LogoutModal from "./components/LogoutModal";
import Login from "./auth/Login";
import Signup from "./auth/Signup";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authModal, setAuthModal] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); 

  const handleTaskAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };
  const executeLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setAuthModal(null);
    setIsModalOpen(false);
    setIsLogoutModalOpen(false);
  };

  const handleLoginSuccess = (newToken, userObj) => {
    localStorage.setItem("token", newToken);
    if (userObj) {
      localStorage.setItem("user", JSON.stringify(userObj));
      setUser(userObj);
    }
    setToken(newToken);
    setAuthModal(null);
  };

  const handleSignupSuccess = () => {
    setAuthModal("login");
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 relative">
      <Navbar
        isLoggedIn={!!token}
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenModal={() => setIsModalOpen(true)}
        onLogout={() => setIsLogoutModalOpen(true)} 
        onOpenLogin={() => setAuthModal("login")}
        onOpenSignup={() => setAuthModal("signup")}
      />

      <Home
        activeTab={activeTab}
        refreshTrigger={refreshTrigger}
        onOpenModal={() => {
          if (token) {
            setIsModalOpen(true);
          } else {
            setAuthModal("login");
          }
        }}
      />

      {token && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onTaskAdded={handleTaskAdded}
        />
      )}
      <LogoutModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)} 
        onConfirm={executeLogout}
      />

      {authModal === "login" && !token && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onCancel={() => setAuthModal(null)}
        />
      )}

      {authModal === "signup" && !token && (
        <Signup
          onSignupSuccess={handleSignupSuccess}
          onCancel={() => setAuthModal(null)}
        />
      )}
    </div>
  );
}

export default App;