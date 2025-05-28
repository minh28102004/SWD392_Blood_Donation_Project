import React, { useState } from "react";
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
} from "react-icons/fa";
import { format, differenceInDays } from "date-fns";

const InputField = ({
  label,
  icon: Icon,
  iconColor = "text-gray-600",
  name,
  type = "text",
  value,
  disabled,
  onChange,
  children,
  className = "",
  ...props
}) => (
  <div className={`space-y-1 ${className}`}>
    <label className="block text-sm font-semibold text-gray-700">
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
          className="w-full p-2 border border-gray-400 rounded-md hover:border-blue-500 focus:outline-none focus:ring-1 focus:border-blue-600 transition-colors disabled:bg-gray-50"
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
    donorId: "DON123456",
    fullName: "John Doe",
    email: "john.doe@example.com",
    password: "********",
    phone: "+1 (555) 123-4567",
    dob: "1990-05-15",
    address: "123 Medical Center Dr, Healthcare City, HC 12345",
    bloodType: "O+",
    donorStatus: "available",
    lastDonation: "2024-01-15",
    components: ["Red Blood Cell", "White Blood Cell", "Platelets", "Plasma"],
    nextEligibleDate: "2024-03-15",
    verificationStatus: "verified",
    healthStatus: "Good",
    weight: 70,
    height: 175,
    medicalProfile: "No allergies, non-smoker",
  });

  const statusColors = {
    available: "bg-green-100 text-green-800",
    temporary: "bg-yellow-100 text-yellow-800",
    ineligible: "bg-red-100 text-red-800",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: name === "weight" || name === "height" ? Number(value) : value,
    }));
  };

  const StatusIndicator = () => (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`inline-flex items-center px-4 py-2 rounded-full ${
          statusColors[profile.donorStatus] || "bg-gray-100 text-gray-800"
        } shadow-sm`}
      >
        {
          {
            available: <FaCheckCircle className="mr-2 animate-pulse" />,
            temporary: <FaExclamationCircle className="mr-2 animate-pulse" />,
            ineligible: <FaTimesCircle className="mr-2 animate-pulse" />,
          }[profile.donorStatus]
        }
        {profile.donorStatus.charAt(0).toUpperCase() +
          profile.donorStatus.slice(1)}
      </div>
    </div>
  );

  // Donation history mở rộng với nhiều lần hiến máu
  const DonationHistory = () => {
    const donationRecords = [
      { date: "2024-01-15", status: "Good" },
      { date: "2023-10-10", status: "Good" },
      { date: "2023-07-05", status: "Temporary Deferral" },
      { date: "2023-03-12", status: "Good" },
    ];

    const totalDonations = donationRecords.length;
    const lastDonationDate = new Date(donationRecords[0].date);
    const daysSinceLastDonation = differenceInDays(
      new Date(),
      lastDonationDate
    );

    const statusIcon = {
      Good: <FaCheckCircle className="text-green-500 mr-1" />,
      "Temporary Deferral": (
        <FaExclamationCircle className="text-yellow-500 mr-1" />
      ),
      Ineligible: <FaTimesCircle className="text-red-500 mr-1" />,
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <FaHistory className="text-red-600" />
            Donation History
          </h3>
          <a
            href="/homepage/blog"
            className=" mt-1 inline-block relative text-blue-600 dark:text-white text-base font-normal transition-all duration-300 hover:text-blue-700 dark:hover:text-blue-300 group"
          >
            <span className="inline-flex items-center transition-transform duration-300 group-hover:translate-x-1">
              View Detail&nbsp;&gt;&gt;
            </span>
            <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-blue-500 dark:bg-blue-400  transition-all duration-300 group-hover:w-full"></span>
          </a>
        </div>

        <p className="mb-4 text-gray-700">
          Total Donations :{" "}
          <span className="font-semibold">{totalDonations}</span>
        </p>
        <p className="mb-4 text-gray-700">
          Last Donation :{" "}
          <span className="font-semibold text-red-600">
            {format(lastDonationDate, "MMMM d, yyyy")}
          </span>{" "}
          ({daysSinceLastDonation} days ago)
        </p>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {donationRecords.map(({ date, status }, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
            >
              <span>{format(new Date(date), "MMM d, yyyy")}</span>
              <span className="flex items-center text-sm font-medium">
                {statusIcon[status] || null}
                {status}
              </span>
            </div>
          ))}
        </div>
        <div className="pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Recent Components Donated :
          </h4>
          <div className="flex flex-wrap gap-2">
            {profile.components.map((c) => (
              <span
                key={c}
                className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm"
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
    <div className="min-h-screen bg-rose-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto transition-all duration-300 ease-in-out grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center">
            <div className="h-32 w-32 bg-red-100 mx-auto mb-4 overflow-hidden rounded-full transform hover:scale-105 transition-transform duration-300">
              <img
                src={profile.avatarUrl}
                alt="User Avatar"
                className="h-32 w-32 object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold">{profile.fullName}</h2>
            <p className="text-sm text-gray-500 mb-2 mt-1 flex items-center justify-center">
              <FaIdCard className="mr-2" /> {profile.donorId}
            </p>
            <StatusIndicator />
          </div>
          <DonationHistory />
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Information */}
          <div className="bg-white p-6 rounded-lg shadow-md relative hover:shadow-lg">
            <h3 className="text-2xl font-bold text-center mb-6">
              Personal Information
            </h3>
            <button
              onClick={() => setIsEditing((e) => !e)}
              className="absolute right-4 top-6 px-4 py-2 bg-gradient-to-br from-rose-400 to-rose-600 text-white rounded-lg hover:brightness-110 hover:scale-105 transform transition-transform duration-300 ease-in-out flex items-center gap-2"
            >
              <FaEdit className="inline-block" />
              {isEditing ? "Save Changes" : "Edit Profile"}
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Donor ID"
                icon={FaIdCard}
                iconColor="text-gray-700"
                name="donorId"
                value={profile.donorId}
                disabled
              />
              <InputField
                label="Password"
                icon={FaKey}
                iconColor="text-gray-600"
                type="password"
                name="password"
                value={profile.password}
                disabled={!isEditing}
                onChange={handleChange}
              />
              <InputField
                label="Full Name"
                icon={FaUser}
                iconColor="text-gray-600"
                name="fullName"
                value={profile.fullName}
                disabled={!isEditing}
                onChange={handleChange}
              />
              <InputField
                label="Email"
                icon={FaEnvelope}
                iconColor="text-gray-600"
                type="email"
                name="email"
                value={profile.email}
                disabled={!isEditing}
                onChange={handleChange}
              />
              <InputField
                label="Phone"
                icon={FaPhone}
                iconColor="text-gray-600"
                type="tel"
                name="phone"
                value={profile.phone}
                disabled={!isEditing}
                onChange={handleChange}
              />
              <InputField
                label="Date of Birth"
                icon={FaCalendarAlt}
                iconColor="text-gray-600"
                type="date"
                name="dob"
                value={profile.dob}
                disabled={!isEditing}
                onChange={handleChange}
              />
            </div>

            <InputField
              label="Address"
              icon={FaMapMarkerAlt}
              iconColor="text-gray-600"
              name="address"
              value={profile.address}
              disabled={!isEditing}
              onChange={handleChange}
              className="mt-6"
              type="text"
            />
          </div>

          {/* Medical Profile */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg">
            <h3 className="text-2xl font-semibold mb-6 text-center">
              Medical Profile
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <InputField
                label="Blood Type"
                icon={FaTint}
                iconColor="text-red-600"
                name="bloodType"
                disabled={!isEditing}
                onChange={handleChange}
              >
                <select
                  name="bloodType"
                  value={profile.bloodType}
                  disabled={!isEditing}
                  className="w-full p-2 border border-gray-400 rounded-md hover:border-blue-500 focus:outline-none focus:ring-1 focus:border-blue-600 transition-colors disabled:bg-gray-50"
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
                label="Weight (kg)"
                icon={FaWeight}
                iconColor="text-blue-700"
                name="weight"
                type="number"
                min={0}
                value={profile.weight}
                disabled={!isEditing}
                onChange={handleChange}
              />

              <InputField
                label="Height (cm)"
                icon={FaRulerVertical}
                iconColor="text-green-700"
                name="height"
                type="number"
                min={0}
                value={profile.height || ""}
                disabled={!isEditing}
                onChange={handleChange}
              />

              <InputField
                label="Health Status"
                icon={FaHeartbeat}
                iconColor="text-red-600"
                name="healthStatus"
                value={profile.healthStatus}
                disabled={!isEditing}
                onChange={handleChange}
              />
            </div>

            <InputField
              label="Medical Profile"
              name="medicalProfile"
              disabled={!isEditing}
              onChange={handleChange}
              className="mt-6"
            >
              <textarea
                name="medicalProfile"
                value={profile.medicalProfile}
                disabled={!isEditing}
                onChange={handleChange}
                rows={4}
                className="w-full p-2 border border-gray-400 rounded-md hover:border-blue-500 focus:outline-none focus:ring-1 focus:border-blue-600 transition-colors resize-none disabled:bg-gray-50"
              />
            </InputField>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
