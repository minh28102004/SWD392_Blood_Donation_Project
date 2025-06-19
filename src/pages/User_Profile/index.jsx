import React, { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
  FaHistory,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
  FaIdCard,
  FaKey,
  FaTint,
  FaHeartbeat,
  FaWeight,
  FaRulerVertical,
  FaEdit,
  FaUser,
  FaStickyNote,
} from "react-icons/fa";
import { format, differenceInDays } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBloodComponents,
  fetchBloodTypes,
} from "@redux/features/bloodSlice";
import Avatar from "@components/Avatar_User_Image";

const InputField = ({
  label,
  icon: Icon,
  iconColor = "text-gray-600 dark:text-gray-300",
  name,
  type = "text",
  value,
  disabled,
  onChange,
  children,
  className = "",
  labelIcon: LabelIcon,
  labelIconColor = "text-gray-600 dark:text-gray-300",
  ...props
}) => (
  <div className={`space-y-1 ${className}`}>
    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ">
      {LabelIcon && <LabelIcon className={`${labelIconColor} h-4 w-4`} />}
      {label} :
    </label>
    <div className="flex items-center">
      {Icon && <Icon className={`${iconColor} mr-2 flex-shrink-0 h-4 w-4`} />}
      {children || (
        <input
          name={name}
          type={type}
          value={value}
          disabled={disabled}
          onChange={onChange}
          className="w-full p-2 border border-gray-400 rounded-md hover:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-colors disabled:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:hover:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:text-white h-10"
          {...props}
        />
      )}
    </div>
  </div>
);

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    avatarUrl: "https://i.pravatar.cc/150?img=52",
    donorStatus: "available",
    lastDonation: "2024-01-15",
    components: ["Red Blood Cell", "White Blood Cell", "Platelets", "Plasma"],
    nextEligibleDate: "2024-03-15",
    verificationStatus: "verified",
    healthStatus: "Good",
  });
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.user);
  const { bloodComponents, bloodTypes } = useSelector((state) => state.blood);

  const bloodTypeOptions = bloodTypes.map((bt) => ({
    value: bt.bloodTypeId.toString(),
    label: `${bt.name}${bt.rhFactor}`,
  }));

  const bloodComponentOptions = bloodComponents.map((bc) => ({
    value: bc.bloodComponentId.toString(),
    label: bc.name,
  }));

  const statusColors = {
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    inactive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: name === "weight" || name === "height" ? Number(value) : value,
    }));
  };

const StatusIndicator = () => {
  const statusValue = selectedUser?.statusBit;

  // Chuyển từ số hoặc chuỗi số sang tên trạng thái
  const normalizedStatus =
    statusValue === 1 || statusValue === "1"
      ? "active"
      : "inactive"; // mặc định nếu không phải 1 là inactive

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`inline-flex items-center px-4 py-2 rounded-full ${
          statusColors[normalizedStatus] ||
          "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
        } shadow-sm`}
      >
        {{
          active: <FaCheckCircle className="mr-2 animate-pulse" />,
          inactive: <FaExclamationCircle className="mr-2 animate-pulse" />,
        }[normalizedStatus]}
        {normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1)}
      </div>
    </div>
  );
};

  // Donation history mở rộng với nhiều lần hiến máu
  const DonationHistory = () => {
    const donationRecords = [
      { date: "2024-01-15", status: "Good" },
      { date: "2023-10-10", status: "Good" },
      { date: "2023-07-05", status: "Temporary Deferral" },
    ];

    const totalDonations = donationRecords.length;
    const lastDonationDate = new Date(donationRecords[0].date);
    const daysSinceLastDonation = differenceInDays(
      new Date(),
      lastDonationDate
    );

    const statusIcon = {
      Good: (
        <FaCheckCircle className="text-green-500 dark:text-green-300 mr-1" />
      ),
      "Temporary Deferral": (
        <FaExclamationCircle className="text-yellow-500 dark:text-yellow-300 mr-1" />
      ),
      Ineligible: (
        <FaTimesCircle className="text-red-500 dark:text-red-300 mr-1" />
      ),
    };

    if (!profile) {
      return <div>Loading...</div>;
    }

    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2 dark:text-white">
            <FaHistory className="text-red-600 dark:text-red-400" />
            Donation History
          </h3>
          <a
            href="/userHistory"
            className="mt-1 inline-block relative text-blue-600 dark:text-blue-400 text-base font-normal transition-all duration-300 hover:text-blue-700 dark:hover:text-blue-300 group"
          >
            <span className="inline-flex items-center transition-transform duration-300 group-hover:translate-x-1">
              View Detail&nbsp;&gt;&gt;
            </span>
            <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-blue-500 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
          </a>
        </div>

        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Total Donations :{" "}
          <span className="font-semibold">{totalDonations}</span>
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Last Donation :{" "}
          <span className="font-semibold text-red-600 dark:text-red-400">
            {format(lastDonationDate, "MMMM d, yyyy")}
          </span>{" "}
          ({daysSinceLastDonation} days ago)
        </p>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {donationRecords.map(({ date, status }, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
            >
              <span className="dark:text-gray-300">
                {format(new Date(date), "MMM d, yyyy")}
              </span>
              <span className="flex items-center text-sm font-medium dark:text-gray-300">
                {statusIcon[status] || null}
                {status}
              </span>
            </div>
          ))}
        </div>
        <div className="pt-5">
          <h4 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-3">
            Recent Components Donated :
          </h4>
          <div className="flex flex-wrap gap-2">
            {profile.components.map((c) => (
              <span
                key={c}
                className="px-3 py-1 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-sm"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-rose-50 via-gray-100 to-rose-50 
  dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto transition-all duration-300 ease-in-out grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center">
            <div className="h-32 w-32 bg-red-100 dark:bg-red-900 mx-auto mb-4 overflow-hidden rounded-full transform hover:scale-105 transition-transform duration-300">
              <Avatar
                name={selectedUser?.name}
                avatarUrl={selectedUser?.avatar}
                size={128}
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedUser.userName}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 mt-1 flex items-center justify-center">
              <FaIdCard className="mr-2" />
              {selectedUser.identification}
            </p>
            <StatusIndicator />
          </div>
          <DonationHistory />
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Information */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md relative hover:shadow-lg">
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
              Personal Information
            </h3>
            <button
              onClick={() => setIsEditing((e) => !e)}
              className="absolute right-4 top-6 px-2 py-1 bg-gradient-to-br from-rose-400 to-rose-600 text-white rounded-lg hover:brightness-90 hover:scale-105 transform transition-transform duration-300 ease-in-out flex items-center gap-2"
            >
              <FaEdit className="inline-block" />
              {isEditing ? "Save Changes" : "Edit Profile"}
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Donor ID"
                icon={FaIdCard}
                iconColor="text-gray-700 dark:text-gray-300"
                name="donorId"
                value={selectedUser.identification}
                disabled={!isEditing}
                onChange={handleChange}
              />
              <InputField
                label="Password"
                icon={FaKey}
                iconColor="text-gray-600 dark:text-gray-300"
                type="password"
                name="password"
                value={selectedUser.password}
                disabled={!isEditing}
                onChange={handleChange}
              />
              <InputField
                label="Full Name"
                icon={FaUser}
                iconColor="text-gray-600 dark:text-gray-300"
                name="fullName"
                value={selectedUser.name}
                disabled={!isEditing}
                onChange={handleChange}
              />
              <InputField
                label="Email"
                icon={FaEnvelope}
                iconColor="text-gray-600 dark:text-gray-300"
                type="email"
                name="email"
                value={selectedUser.email}
                disabled={!isEditing}
                onChange={handleChange}
              />
              <InputField
                label="Phone"
                icon={FaPhone}
                iconColor="text-gray-600 dark:text-gray-300"
                type="tel"
                name="phone"
                value={selectedUser.phone}
                disabled={!isEditing}
                onChange={handleChange}
              />
              <InputField
                label="Date of Birth"
                icon={FaCalendarAlt}
                iconColor="text-gray-600 dark:text-gray-300"
                type="date"
                name="dob"
                value={selectedUser.dateOfBirth}
                disabled={!isEditing}
                onChange={handleChange}
              />
            </div>

            <InputField
              label="Address"
              icon={FaMapMarkerAlt}
              iconColor="text-gray-600 dark:text-gray-300"
              name="address"
              value={selectedUser.address}
              disabled={!isEditing}
              onChange={handleChange}
              className="mt-6"
              type="text"
            />
          </div>

          {/* Medical Profile */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg">
            <h3 className="text-2xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
              Medical Profile
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <InputField
                label="Blood Type"
                icon={FaTint}
                iconColor="text-red-600 dark:text-red-400"
                name="bloodType"
                disabled={!isEditing}
                onChange={handleChange}
              >
                <select
                  name="bloodType"
                  value={selectedUser.bloodTypeId}
                  disabled={!isEditing}
                  className="w-full h-10 p-2 border border-gray-400 rounded-md hover:border-blue-500 focus:outline-none focus:ring-1 focus:border-blue-600 transition-colors disabled:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:hover:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:text-white"
                  onChange={handleChange}
                >
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    )
                  )}
                </select>
              </InputField>
              <InputField
                label="Height (cm)"
                icon={FaRulerVertical}
                iconColor="text-gray-600 dark:text-gray-300"
                name="height"
                type="number"
                min={0}
                value={selectedUser.heightCm || ""}
                disabled={!isEditing}
                onChange={handleChange}
              />
              <InputField
                label="Weight (kg)"
                icon={FaWeight}
                iconColor="text-gray-600 dark:text-gray-300"
                name="weight"
                type="number"
                min={0}
                value={selectedUser.weightKg}
                disabled={!isEditing}
                onChange={handleChange}
              />
            </div>

            <InputField
              label="Medical History"
              iconColor="text-gray-600 dark:text-gray-300"
              name="medicalProfile"
              disabled={!isEditing}
              onChange={handleChange}
              className="mt-6"
            >
              <textarea
                name="medicalProfile"
                value={selectedUser.medicalHistory}
                disabled={!isEditing}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border border-gray-400 rounded-md hover:border-blue-500 focus:outline-none focus:ring-1 focus:border-blue-600 transition-colors resize-none disabled:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:hover:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:text-white"
              />
            </InputField>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
