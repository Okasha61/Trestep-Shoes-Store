import {
  createContext,
  useEffect,
  useState,
} from "react";

import {
  signupUser,
  loginUser,
  getMe,
  updateProfile,
} from "../services/authService";

export const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // CHECK CURRENT LOGIN
  // ==========================================
  useEffect(() => {
    const token = localStorage.getItem("trestepToken");

    if (!token) {
      setLoading(false);
      return;
    }

    const checkUser = async () => {
      try {
        const data = await getMe();

        const currentUser = data?.user || data;

        setUser(currentUser);

        localStorage.setItem(
          "trestepUser",
          JSON.stringify(currentUser)
        );
      } catch (error) {
        console.error(
          "Current user error:",
          error
        );

        localStorage.removeItem("trestepToken");
        localStorage.removeItem("trestepUser");

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // ==========================================
  // SIGNUP
  // ==========================================
  const signup = async (userData) => {
    console.log("AuthContext signup:", userData);

    const data = await signupUser(userData);

    console.log("AuthContext response:", data);

    if (data?.token) {
      localStorage.setItem(
        "trestepToken",
        data.token
      );
    }

    if (data?.user) {
      setUser(data.user);

      localStorage.setItem(
        "trestepUser",
        JSON.stringify(data.user)
      );
    }

    return data;
  };

  // ==========================================
  // LOGIN
  // ==========================================
  const login = async (userData) => {
    const data = await loginUser(userData);

    if (data?.token) {
      localStorage.setItem(
        "trestepToken",
        data.token
      );
    }

    if (data?.user) {
      setUser(data.user);

      localStorage.setItem(
        "trestepUser",
        JSON.stringify(data.user)
      );
    }

    // Get latest user/role from database
    try {
      const meData = await getMe();

      const currentUser =
        meData?.user || meData;

      setUser(currentUser);

      localStorage.setItem(
        "trestepUser",
        JSON.stringify(currentUser)
      );

      return {
        ...data,
        user: currentUser,
      };
    } catch (error) {
      console.error(
        "Failed to refresh user:",
        error
      );

      return data;
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================
  const logout = () => {
    localStorage.removeItem("trestepToken");
    localStorage.removeItem("trestepUser");

    setUser(null);
  };

  // ==========================================
  // UPDATE PROFILE
  // ==========================================
  const updateUserProfile = async (userData) => {
    const data = await updateProfile(userData);

    const updatedUser =
      data?.user || data;

    setUser(updatedUser);

    localStorage.setItem(
      "trestepUser",
      JSON.stringify(updatedUser)
    );

    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,

        signup,
        login,
        logout,

        updateProfile: updateUserProfile,

        isAuthenticated: Boolean(user),

        isAdmin:
          user?.role === "admin",

        refreshUser: async () => {
          try {
            const data = await getMe();

            const currentUser =
              data?.user || data;

            setUser(currentUser);

            localStorage.setItem(
              "trestepUser",
              JSON.stringify(currentUser)
            );

            return currentUser;
          } catch (error) {
            console.error(error);
            return null;
          }
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;