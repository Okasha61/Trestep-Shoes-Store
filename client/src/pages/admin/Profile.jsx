import { useEffect, useState } from "react";

import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiSave,
} from "react-icons/fi";

import toast from "react-hot-toast";

import api from "../../services/api";
import useAuth from "../../hooks/useAuth";

const Profile = () => {
  const { user } = useAuth();

  // ======================================================
  // PROFILE STATE
  // ======================================================

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [profileLoading, setProfileLoading] =
    useState(false);

  // ======================================================
  // PASSWORD STATE
  // ======================================================

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] = useState(false);

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [
    passwordLoading,
    setPasswordLoading,
  ] = useState(false);

  // ======================================================
  // LOAD USER DATA
  // ======================================================

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // ======================================================
  // UPDATE PROFILE
  // ======================================================

  const handleProfileSubmit = async (
    e
  ) => {
    e.preventDefault();

    const trimmedUsername =
      username.trim();

    const trimmedEmail =
      email.trim();

    if (!trimmedUsername) {
      toast.error("Name is required");
      return;
    }

    if (!trimmedEmail) {
      toast.error("Email is required");
      return;
    }

    if (
      trimmedUsername.length < 3 ||
      trimmedUsername.length > 50
    ) {
      toast.error(
        "Name must be between 3 and 50 characters"
      );
      return;
    }

    try {
      setProfileLoading(true);

      const response = await api.put(
        "/auth/profile",
        {
          username:
            trimmedUsername,

          email:
            trimmedEmail,
        }
      );

      const updatedUser =
        response.data.user;

      // Update local storage
      localStorage.setItem(
        "trestepUser",
        JSON.stringify(updatedUser)
      );

      // Update local state
      setUsername(
        updatedUser.username
      );

      setEmail(
        updatedUser.email
      );

      toast.success(
        "Profile updated successfully"
      );

      // Notify other listeners
      window.dispatchEvent(
        new Event("storage")
      );
    } catch (error) {
      console.error(
        "Update profile error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setProfileLoading(false);
    }
  };

  // ======================================================
  // CHANGE PASSWORD
  // ======================================================

  const handlePasswordSubmit = async (
    e
  ) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error(
        "Current password is required"
      );
      return;
    }

    if (!newPassword) {
      toast.error(
        "New password is required"
      );
      return;
    }

    if (newPassword.length < 6) {
      toast.error(
        "New password must be at least 6 characters"
      );
      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      toast.error(
        "New passwords do not match"
      );
      return;
    }

    try {
      setPasswordLoading(true);

      await api.put(
        "/auth/change-password",
        {
          currentPassword,
          newPassword,
        }
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast.success(
        "Password changed successfully"
      );
    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to change password"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // ======================================================
  // INPUT CLASS
  // ======================================================

  const inputClass =
    "w-full bg-black border border-gray-800 rounded-lg px-4 py-3 pl-11 text-white outline-none transition focus:border-[#9cff00] placeholder:text-gray-600";

  return (
    <div className="w-full min-h-full bg-black text-white p-6 md:p-8">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">
          Profile
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your admin account information
          and password.
        </p>
      </div>

      {/* ==================================================
          PROFILE INFORMATION
      ================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-[#0d0d0d] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#9cff00]/10 flex items-center justify-center text-[#9cff00]">
              <FiUser size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Profile Information
              </h2>

              <p className="text-sm text-gray-500">
                Update your personal details
              </p>
            </div>
          </div>

          <form
            onSubmit={
              handleProfileSubmit
            }
            className="space-y-5"
          >
            {/* Name */}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>

              <div className="relative">
                <FiUser
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />

                <input
                  type="text"
                  value={username}
                  onChange={(e) =>
                    setUsername(
                      e.target.value
                    )
                  }
                  placeholder="Enter your name"
                  className={inputClass}
                  maxLength={50}
                />
              </div>
            </div>

            {/* Email */}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>

              <div className="relative">
                <FiMail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  placeholder="Enter your email"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Role */}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Role
              </label>

              <div className="flex items-center justify-between bg-black border border-gray-800 rounded-lg px-4 py-3">
                <span className="text-gray-400">
                  Account Role
                </span>

                <span className="px-3 py-1 rounded-full bg-[#9cff00]/10 text-[#9cff00] text-xs font-semibold uppercase">
                  {user?.role ||
                    "admin"}
                </span>
              </div>
            </div>

            {/* Save */}

            <button
              type="submit"
              disabled={
                profileLoading
              }
              className="w-full flex items-center justify-center gap-2 bg-[#9cff00] text-black font-semibold rounded-lg px-5 py-3 transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSave size={18} />

              {profileLoading
                ? "Saving..."
                : "Save Profile"}
            </button>
          </form>
        </div>

        {/* ==================================================
            CHANGE PASSWORD
        ================================================== */}

        <div className="bg-[#0d0d0d] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#9cff00]/10 flex items-center justify-center text-[#9cff00]">
              <FiLock size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Change Password
              </h2>

              <p className="text-sm text-gray-500">
                Keep your account secure
              </p>
            </div>
          </div>

          <form
            onSubmit={
              handlePasswordSubmit
            }
            className="space-y-5"
          >
            {/* Current Password */}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Current Password
              </label>

              <div className="relative">
                <FiLock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />

                <input
                  type={
                    showCurrentPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    currentPassword
                  }
                  onChange={(e) =>
                    setCurrentPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter current password"
                  className={`${inputClass} pr-11`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowCurrentPassword(
                      (prev) => !prev
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showCurrentPassword ? (
                    <FiEyeOff
                      size={18}
                    />
                  ) : (
                    <FiEye
                      size={18}
                    />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>

              <div className="relative">
                <FiLock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />

                <input
                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter new password"
                  className={`${inputClass} pr-11`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword(
                      (prev) => !prev
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showNewPassword ? (
                    <FiEyeOff
                      size={18}
                    />
                  ) : (
                    <FiEye
                      size={18}
                    />
                  )}
                </button>
              </div>

              <p className="text-xs text-gray-600 mt-2">
                Password must be at least 6
                characters.
              </p>
            </div>

            {/* Confirm Password */}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm New Password
              </label>

              <div className="relative">
                <FiLock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    confirmPassword
                  }
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Confirm new password"
                  className={`${inputClass} pr-11`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff
                      size={18}
                    />
                  ) : (
                    <FiEye
                      size={18}
                    />
                  )}
                </button>
              </div>
            </div>

            {/* Change Password */}

            <button
              type="submit"
              disabled={
                passwordLoading
              }
              className="w-full flex items-center justify-center gap-2 bg-[#9cff00] text-black font-semibold rounded-lg px-5 py-3 transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiLock size={18} />

              {passwordLoading
                ? "Changing..."
                : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;