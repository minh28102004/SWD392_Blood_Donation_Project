import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserTag,
  FaToggleOn,
  FaPhone,
  FaIdBadge,
  FaCalendarAlt,
  FaAddressCard,
  FaNotesMedical,
  FaTint,
  FaRulerVertical,
  FaWeight,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";
import { format } from "date-fns";
import {
  TextInput,
  PasswordInput,
  SelectInput,
  DateInput,
  TextAreaInput,
} from "@components/Form_Input";

const UserCreationModal = ({ isOpen, onClose }) => {
  const [showAdditional, setShowAdditional] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  useEffect(() => {
    let strength = 0;
    if (password) {
      if (password.length >= 8) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[a-z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[^A-Za-z0-9]/.test(password)) strength++;
    }
    setPasswordStrength(strength);
  }, [password]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      console.log("Form data:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "bg-red-500 w-1/5";
      case 2:
        return "bg-orange-400 w-2/5";
      case 3:
        return "bg-yellow-400 w-3/5";
      case 4:
        return "bg-lime-500 w-4/5";
      case 5:
        return "bg-green-600 w-full";
      default:
        return "bg-gray-200 w-0";
    }
  };

  const getPasswordStrengthLabel = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "Very Weak";
      case 2:
        return "Weak";
      case 3:
        return "Moderate";
      case 4:
        return "Strong";
      case 5:
        return "Very Strong";
      default:
        return "";
    }
  };

  const importantFields = [
    "user_name",
    "name",
    "email",
    "password",
    "role_bit",
    "status",
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-6">
        <div className="relative mb-4 pb-4">
          <h2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-gray-800">
            Create New User
          </h2>
          <button
            onClick={onClose}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Close modal"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        <hr className="border-gray-100 mb-6" />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              label={
                <>
                  {importantFields.includes("user_name") && (
                    <span className="text-red-600 mr-1">*</span>
                  )}
                  Username :
                </>
              }
              name="user_name"
              register={register}
              errors={errors}
              validation={{
                required: "Username is required",
                minLength: { value: 3, message: "At least 3 characters" },
                maxLength: { value: 50, message: "Max 50 characters" },
              }}
              placeholder="Enter username"
              icon={FaUser}
            />
            <SelectInput
              label={
                <>
                  {importantFields.includes("role_bit") && (
                    <span className="text-red-600 mr-1">*</span>
                  )}
                  Role :
                </>
              }
              name="role_bit"
              register={register}
              errors={errors}
              options={[
                { value: "1", label: "Admin" },
                { value: "2", label: "User" },
                { value: "3", label: "Donor" },
              ]}
              placeholder="Select role"
              icon={FaUserTag}
            />
            <TextInput
              label={
                <>
                  {importantFields.includes("name") && (
                    <span className="text-red-600 mr-1">*</span>
                  )}
                  Full Name :
                </>
              }
              name="name"
              register={register}
              errors={errors}
              validation={{
                required: "Name is required",
                minLength: { value: 2, message: "At least 2 characters" },
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: "Only letters and spaces allowed",
                },
              }}
              placeholder="Enter full name"
              icon={FaUser}
            />
            <SelectInput
              label={
                <>
                  {importantFields.includes("status") && (
                    <span className="text-red-600 mr-1">*</span>
                  )}
                 Status :
                </>
              }
              name="status"
              register={register}
              errors={errors}
              options={[
                { value: "1", label: "Active" },
                { value: "2", label: "Inactive" },
              ]}
              placeholder="Select status"
              icon={FaToggleOn}
            />
            <PasswordInput
              label={
                <>
                  {importantFields.includes("password") && (
                    <span className="text-red-600 mr-1">*</span>
                  )}
                  Password :
                </>
              }
              name="password"
              register={register}
              errors={errors}
              validation={{
                required: "Password is required",
                minLength: { value: 8, message: "At least 8 characters" },
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    "Must contain uppercase, lowercase, number, special char",
                },
              }}
              placeholder="Enter password"
              icon={FaLock}
            />
            {/* Password strength bar */}
            <div className="mt-2">
              <span className="text-sm font-medium text-gray-700">
                Strength: {getPasswordStrengthLabel()}
              </span>
              <div className="h-2 rounded-full bg-gray-200 mt-1">
                <div
                  className={`${getPasswordStrengthColor()} h-2 rounded-full transition-all duration-300`}
                />
              </div>
              {passwordStrength === 0 ? (
                <p className="mt-1 text-xs text-red-600 italic">
                  * Please enter a password
                </p>
              ) : (
                <p className="mt-1 text-xs text-gray-500 italic">
                  {passwordStrength <= 1 &&
                    "Password is very weak, try adding uppercase letters, numbers, or special characters."}
                  {passwordStrength === 2 &&
                    "Weak password, consider adding more character types."}
                  {passwordStrength === 3 &&
                    "Moderate strength, can be improved with more variety."}
                  {passwordStrength === 4 && "Strong password, good job!"}
                  {passwordStrength === 5 && "Very strong password!"}
                </p>
              )}
            </div>
          </div>

          {/* ... Additions ... */}

          <div className="flex items-center space-x-2 py-4 border-t border-b border-gray-100 ">
            <input
              type="checkbox"
              id="showAdditional"
              checked={showAdditional}
              onChange={(e) => setShowAdditional(e.target.checked)}
              className="w-4 h-4 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label
              htmlFor="showAdditional"
              className="text-sm font-medium text-gray-700 flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"
            >
              <span>Show Additional Information</span>
              <FaInfoCircle
                className="text-blue-500"
                title="Toggle additional fields"
              />
            </label>
          </div>

          {showAdditional && (
            <div className="space-y-6 transition-all duration-300 ease-in-out transform">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectInput
                  label="Blood Type :"
                  name="blood_type_id"
                  register={register}
                  errors={errors}
                  options={[
                    { value: "1", label: "A+" },
                    { value: "2", label: "A-" },
                    { value: "3", label: "B+" },
                    { value: "4", label: "B-" },
                    { value: "5", label: "AB+" },
                    { value: "6", label: "AB-" },
                    { value: "7", label: "O+" },
                    { value: "8", label: "O-" },
                  ]}
                  placeholder="Select blood type"
                  icon={FaTint}
                />

                <SelectInput
                  label="Blood Component :"
                  name="blood_component_id"
                  register={register}
                  errors={errors}
                  options={[
                    { value: "1", label: "Whole Blood" },
                    { value: "2", label: "Plasma" },
                    { value: "3", label: "Platelets" },
                    { value: "4", label: "Red Blood Cells" },
                  ]}
                  placeholder="Select blood component"
                  icon={FaTint}
                />

                <TextInput
                  label="Phone :"
                  name="phone"
                  register={register}
                  errors={errors}
                  placeholder="Enter phone number"
                  icon={FaPhone}
                />
                <DateInput
                  label="Date of Birth :"
                  name="date_of_birth"
                  register={register}
                  errors={errors}
                  max={format(new Date(), "yyyy-MM-dd")}
                  icon={FaCalendarAlt}
                />
                <TextInput
                  label="Identification :"
                  name="identification"
                  register={register}
                  errors={errors}
                  placeholder="Enter identification"
                  icon={FaIdBadge}
                />
                <TextInput
                  label="Email :"
                  name="email"
                  register={register}
                  errors={errors}
                  validation={{
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  }}
                  placeholder="Enter email"
                  icon={FaEnvelope}
                />
                <TextInput
                  label="Height (cm) :"
                  name="height_cm"
                  register={register}
                  errors={errors}
                  placeholder="Enter height"
                  icon={FaRulerVertical}
                />

                <TextInput
                  label="Weight (kg) :"
                  name="weight_kg"
                  register={register}
                  errors={errors}
                  placeholder="Enter weight"
                  icon={FaWeight}
                />
                <TextAreaInput
                  label="Address :"
                  name="address"
                  register={register}
                  errors={errors}
                  rows={3}
                  placeholder="Enter address"
                  icon={FaAddressCard}
                />
                <TextAreaInput
                  label="Medical History :"
                  name="medical_history"
                  register={register}
                  errors={errors}
                  rows={3}
                  placeholder="Enter medical history"
                  icon={FaNotesMedical}
                />
              </div>
               <hr className="border-gray-100" />
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-sky-400 to-blue-500 rounded-lg hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            >
              {isSubmitting ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserCreationModal;
