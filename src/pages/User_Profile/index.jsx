import React, { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaIdCard,
  FaKey,
  FaEdit,
  FaUser,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, fetchUserById } from "@redux/features/userSlice";
import { toast } from "react-toastify";
import Avatar from "@components/Avatar_User_Image";
import { InputField } from "./inputField";
import { useLocation, useNavigate, Link } from "react-router-dom";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedUser = location.state?.user;
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    avatarUrl: "https://i.pravatar.cc/150?img=52",
    ...selectedUser,
  });

  if (!selectedUser) {
    return <div>No user data available</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEditing) return;
    const formData = new FormData();
    if (profile.password && profile.password.trim() !== "") {
      formData.append("Password", profile.password);
    }
    formData.append("Name", profile.name);
    formData.append("Email", profile.email);
    formData.append("Phone", profile.phone || "");
    formData.append("DateOfBirth", profile.dateOfBirth || "");
    formData.append("Address", profile.address || "");
    formData.append("Identification", profile.identification);

    dispatch(updateUser({ id: selectedUser.userId, formData }))
      .unwrap()
      .then(() => {
        toast.success("Profile updated successfully!");
        dispatch(fetchUserById(selectedUser.userId));
      });
    setIsEditing(false);
  };

  const statusColors = {
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    inactive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  const StatusIndicator = () => {
    const statusValue = selectedUser?.statusBit;
    const normalizedStatus =
      statusValue === 1 || statusValue === "1" ? "active" : "inactive";
    return (
      <div className="flex flex-col items-center gap-3">
        <div
          className={`inline-flex items-center px-4 py-2 rounded-full ${
            statusColors[normalizedStatus] ||
            "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
          } shadow-sm`}
        >
          {
            {
              active: <FaCheckCircle className="mr-2 animate-pulse" />,
              inactive: <FaExclamationCircle className="mr-2 animate-pulse" />,
            }[normalizedStatus]
          }
          {normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1)}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-gray-100 to-rose-50 dark:bg-gray-900 pt-9 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
        <div className="text-center mb-6">
          <div className="h-32 w-32 mx-auto rounded-full overflow-hidden bg-red-100 dark:bg-red-900">
            <Avatar
              name={profile?.name}
              avatarUrl={profile?.avatar}
              size={128}
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
            {profile.userName}
          </h2>
          <StatusIndicator />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Identification"
              icon={FaIdCard}
              iconColor="text-gray-700 dark:text-gray-300"
              name="identification"
              value={profile.identification || ""}
              disabled={!isEditing}
              onChange={handleChange}
            />
            <InputField
              label="Password"
              icon={FaKey}
              name="password"
              type="password"
              value={profile.password || ""}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Leave blank to keep current"
              isPasswordToggle
            />

            <InputField
              label="Full Name"
              icon={FaUser}
              iconColor="text-gray-600 dark:text-gray-300"
              name="name"
              value={profile.name || ""}
              disabled={!isEditing}
              onChange={handleChange}
            />
            <InputField
              label="Email"
              icon={FaEnvelope}
              name="email"
              type="email"
              value={profile.email || ""}
              disabled={!isEditing}
              onChange={handleChange}
            />
            <InputField
              label="Phone"
              icon={FaPhone}
              name="phone"
              type="tel"
              value={profile.phone || ""}
              disabled={!isEditing}
              onChange={handleChange}
            />
            <InputField
              label="Date of Birth"
              icon={FaCalendarAlt}
              name="dateOfBirth"
              type="date"
              value={profile.dateOfBirth || ""}
              disabled={!isEditing}
              onChange={handleChange}
            />
          </div>
          <InputField
            label="Address"
            icon={FaMapMarkerAlt}
            name="address"
            value={profile.address || ""}
            disabled={!isEditing}
            onChange={handleChange}
          />

          <div className="flex justify-between items-center ">
            <div className="group">
              <Link
                to="/homePage"
                className="mt-4 inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition-transform duration-300 hover:-translate-x-1"
              >
                &laquo; Back to Home
              </Link>
            </div>

            <button
              type="submit"
              onClick={(e) => {
                if (isEditing) {
                  handleSubmit(e);
                } else {
                  e.preventDefault();
                  setIsEditing(true);
                }
              }}
              className="px-2 py-1 bg-gradient-to-br from-rose-400 to-rose-600 text-white rounded-lg hover:brightness-90 hover:scale-105 transform transition-transform duration-300 flex items-center justify-center gap-2"
            >
              <FaEdit />
              {isEditing ? "Save Changes" : "Edit Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
