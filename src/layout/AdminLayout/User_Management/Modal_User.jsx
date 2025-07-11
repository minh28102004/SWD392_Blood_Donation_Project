import React, { useState, useEffect, Fragment, useRef } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserTag,
  FaToggleOn,
  FaTimes,
} from "react-icons/fa";
import { TextInput, PasswordInput, SelectInput } from "@components/Form_Input";
import { createUser, updateUser } from "@redux/features/userSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserCreationModal = ({
  isOpen,
  onClose,
  selectedUser,
  onSuccess,
  userRole = [],
  userStatus = [],
}) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      status: "1", // Mặc định là Active
    },
  });

  const password = watch("password");

  useEffect(() => {
    if (selectedUser) {
      reset({
        userName: selectedUser.userName || "",
        name: selectedUser.name || "",
        email: selectedUser.email || "",
        roleBit:
          selectedUser.roleBit != null ? selectedUser.roleBit.toString() : "0",
        status: selectedUser.statusBit ? "1" : "0",
      });
    } else {
      reset({
        status: "1", // Set lại giá trị mặc định nếu không có selectedUser
      });
    }
  }, [selectedUser, reset]);

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

    // helper chuyển chuỗi trống thành null
    const normalizeNull = (value) =>
      value === "" || value === undefined || value === null ? null : value;

    // Tạo FormData để gửi multipart/form-data
    const formData = new FormData();

    formData.append("UserName", normalizeNull(data.userName));
    formData.append("Name", normalizeNull(data.name));
    formData.append("Email", normalizeNull(data.email));
    formData.append("StatusBit", data.status === "1" ? 1 : 0);
    formData.append("RoleBit", Number(data.roleBit));
    // Xử lý password:
    // Nếu là tạo mới (không có selectedUser) -> luôn gửi password (bắt buộc)
    // Nếu là cập nhật (có selectedUser) và user có nhập password thì gửi
    // Ngược lại không gửi password
    if (!selectedUser) {
      // POST tạo mới: password bắt buộc
      formData.append("Password", data.password);
    } else {
      // PUT cập nhật: chỉ gửi nếu có nhập password
      if (data.password && data.password.trim() !== "") {
        formData.append("Password", data.password);
      }
    }

    try {
      if (selectedUser) {
        // [PUT]
        const resultAction = await dispatch(
          updateUser({ id: selectedUser.userId, formData })
        );
        if (updateUser.fulfilled.match(resultAction)) {
          toast.success("User updated successfully!");
          onSuccess();
        } else {
          toast.error("Update failed: " + resultAction.payload);
        }
      } else {
        // [POST]
        const resultAction = await dispatch(createUser(formData));
        if (createUser.fulfilled.match(resultAction)) {
          toast.success("User created successfully!");
          onSuccess();
        } else {
          toast.error("Create failed: " + resultAction.payload);
        }
      }
      onClose();
    } catch (error) {
      toast.error("Unexpected error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
        return "bg-gray-300 w-0";
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
        return "0%";
      case 1:
        return "20% - Very Weak";
      case 2:
        return "40% - Weak";
      case 3:
        return "60% - Moderate";
      case 4:
        return "80% - Strong";
      case 5:
        return "100% - Very Strong";
      default:
        return "";
    }
  };

  const importantFields = [
    "userName",
    "name",
    "email",
    "password",
    "roleBit",
    "status",
  ];

  // Dynamically generate options for role and status from userList
  const roleOptions = userRole.map((role) => ({
    value: role.id,
    label: role.name,
  }));

  const statusOptions = userStatus.map((status) => ({
    value: status.id,
    label: status.name,
  }));

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black bg-opacity-70" />

        <div className="fixed inset-0 ">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel className="relative w-full max-w-2xl max-h-[95vh] transform rounded-2xl bg-white dark:bg-gray-800 text-left align-middle shadow-xl transition-all py-6 pl-6 pr-1">
                <Dialog.Title
                  as="h2"
                  className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4"
                >
                  {selectedUser
                    ? `Edit User - [ ${selectedUser.name} ]`
                    : "Create New User"}
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>{" "}
                <div className="custom-scrollbar max-h-[80vh] overflow-y-auto pl-1 pr-5">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Full Name */}
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
                          minLength: {
                            value: 2,
                            message: "At least 2 characters",
                          },
                        }}
                        placeholder="Enter full name"
                        icon={FaUser}
                      />

                      {/* Email */}
                      <TextInput
                        label={
                          <>
                            {importantFields.includes("email") && (
                              <span className="text-red-600 mr-1">*</span>
                            )}
                            Email :
                          </>
                        }
                        name="email"
                        register={register}
                        errors={errors}
                        validation={{
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        }}
                        placeholder="Enter email"
                        icon={FaEnvelope}
                      />

                      {/* Username */}
                      {!selectedUser && (
                        <TextInput
                          label={
                            <>
                              {importantFields.includes("userName") && (
                                <span className="text-red-600 mr-1">*</span>
                              )}
                              Username :
                            </>
                          }
                          name="userName"
                          register={register}
                          errors={errors}
                          validation={{
                            required: "Username is required",
                            minLength: {
                              value: 3,
                              message: "At least 3 characters",
                            },
                            maxLength: {
                              value: 50,
                              message: "Max 50 characters",
                            },
                          }}
                          placeholder="Enter username"
                          icon={FaUser}
                        />
                      )}

                      {/* Role */}
                      <SelectInput
                        label={
                          <>
                            {importantFields.includes("roleBit") && (
                              <span className="text-red-600 mr-1">*</span>
                            )}
                            Role :
                          </>
                        }
                        name="roleBit"
                        register={register}
                        errors={errors}
                        options={roleOptions}
                        placeholder="Select role"
                        icon={FaUserTag}
                      />
                      {/* Status (only in edit) */}
                      {selectedUser && (
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
                          options={statusOptions}
                          icon={FaToggleOn}
                        />
                      )}
                      {/* Password */}
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
                          required: selectedUser
                            ? false
                            : "Password is required",
                          minLength: {
                            value: 4,
                            message: "At least 4 characters",
                          },
                        }}
                        placeholder={
                          selectedUser
                            ? "Leave blank to keep current"
                            : "Enter password"
                        }
                        icon={FaLock}
                      />
                      {/* Password strength */}
                      {(!selectedUser || (selectedUser && password)) && (
                        <div className="mt-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
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
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-300 italic">
                              {passwordStrength <= 1 &&
                                "Password is very weak, try adding uppercase letters, numbers, or special characters."}
                              {passwordStrength === 2 &&
                                "Weak password, consider adding more character types."}
                              {passwordStrength === 3 &&
                                "Moderate strength, can be improved with more variety."}
                              {passwordStrength === 4 &&
                                "Strong password, good job!"}
                              {passwordStrength === 5 &&
                                "Very strong password!"}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-4 pt-2">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-200 shadow-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-3 py-2 text-sm font-semibold text-white bg-gradient-to-t from-rose-400 via-rose-500 to-red-400 rounded-lg hover:brightness-90 transition-all duration-200 shadow-sm"
                      >
                        {isSubmitting
                          ? selectedUser
                            ? "Updating..."
                            : "Creating..."
                          : selectedUser
                          ? "Update User"
                          : "Create User"}
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default UserCreationModal;
