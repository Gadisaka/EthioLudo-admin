import React, { useState, useEffect } from "react";
import useAdminStore from "../Store/adminStore";

const EditProfile = () => {
  const {
    adminProfile,
    profileLoading,
    errors,
    fetchAdminProfile,
    updateAdminProfile,
    clearErrors,
  } = useAdminStore();

  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchAdminProfile();
  }, [fetchAdminProfile]);

  useEffect(() => {
    if (adminProfile) {
      setFormData({
        phone: adminProfile.phone || "",
        email: adminProfile.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [adminProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();
    setSuccessMessage("");

    // Validate form
    if (!formData.phone.trim()) {
      setSuccessMessage("Phone number is required");
      return;
    }

    if (!formData.email.trim()) {
      setSuccessMessage("Email is required");
      return;
    }

    if (showPasswordFields) {
      if (!formData.currentPassword) {
        setSuccessMessage("Current password is required to change password");
        return;
      }

      if (!formData.newPassword) {
        setSuccessMessage("New password is required");
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setSuccessMessage("New passwords do not match");
        return;
      }

      if (formData.newPassword.length < 6) {
        setSuccessMessage("New password must be at least 6 characters long");
        return;
      }
    }

    // Prepare data for API
    const updateData = {
      phone: formData.phone.trim(),
      email: formData.email.trim(),
    };

    if (showPasswordFields) {
      updateData.currentPassword = formData.currentPassword;
      updateData.newPassword = formData.newPassword;
    }

    const result = await updateAdminProfile(updateData);

    if (result.success) {
      setSuccessMessage(result.message);
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setShowPasswordFields(false);
    } else {
      setSuccessMessage(result.message);
    }
  };

  const togglePasswordFields = () => {
    setShowPasswordFields(!showPasswordFields);
    if (showPasswordFields) {
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    }
  };

  if (profileLoading.fetch) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Edit Profile
            </h1>

            {/* Success/Error Messages */}
            {successMessage && (
              <div
                className={`mb-4 p-4 rounded-md ${
                  successMessage.includes("successfully")
                    ? "bg-green-50 border-l-4 border-green-400"
                    : "bg-red-50 border-l-4 border-red-400"
                }`}
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className={`h-5 w-5 ${
                        successMessage.includes("successfully")
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p
                      className={`text-sm ${
                        successMessage.includes("successfully")
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {successMessage}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error from Store */}
            {errors.profile && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{errors.profile}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Phone Field */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Username Field (Read-only) */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={adminProfile?.username || ""}
                  disabled
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Username cannot be changed
                </p>
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Password Change Section */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Change Password
                  </h3>
                  <button
                    type="button"
                    onClick={togglePasswordFields}
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    {showPasswordFields ? "Cancel" : "Change Password"}
                  </button>
                </div>

                {showPasswordFields && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        id="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700"
                      >
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={profileLoading.update}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    profileLoading.update
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  }`}
                >
                  {profileLoading.update ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    "Update Profile"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
