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
import { createUser, updateUser } from "@redux/features/userSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useOutsideClick from "@hooks/useOutsideClick";

const UserCreationModal = ({
  isOpen,
  onClose,
  selectedUser,
  onSuccess,
  bloodTypes = [],
  bloodComponents = [],
  userRole = [],
  userStatus = [],
}) => {
  const dispatch = useDispatch();
  const [showAdditional, setShowAdditional] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const modalRef = useRef(null);
  useOutsideClick(modalRef, onClose);

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
        // email: selectedUser.email || "",
        roleBit:
          selectedUser.roleBit != null ? selectedUser.roleBit.toString() : "0",
        status: selectedUser.statusBit ? "1" : "0",
        // phone: selectedUser.phone || "",
        // dateOfBirth: selectedUser.dateOfBirth
        //   ? format(new Date(selectedUser.dateOfBirth), "yyyy-MM-dd")
        //   : "",
        // identification: selectedUser.identification || "",
        // bloodType: selectedUser.bloodTypeId?.toString() || "",
        // bloodComponent: selectedUser.bloodComponentId?.toString() || "",
        // height:
        //   selectedUser.heightCm != null ? selectedUser.heightCm.toString() : "",
        // weight:
        //   selectedUser.weightKg != null ? selectedUser.weightKg.toString() : "",
        // address: selectedUser.address || "",
        // medicalHistory: selectedUser.medicalHistory || "",
      });

      setShowAdditional(true);
    } else {
      reset({
        status: "1", // Set lại giá trị mặc định nếu không có selectedUser
      });
      setShowAdditional(false);
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
    // formData.append("Phone", normalizeNull(data.phone));
    // formData.append("DateOfBirth", normalizeNull(data.dateOfBirth));
    // formData.append("Address", normalizeNull(data.address));
    // formData.append("Identification", normalizeNull(data.identification));
    // formData.append("MedicalHistory", normalizeNull(data.medicalHistory));
    if (selectedUser) {
      // PUT cập nhật: gửi "true"/"false"
      formData.append("StatusBit", data.status === "1" ? "true" : "false");
    } else {
      // POST tạo mới: gửi 1 hoặc 0
      formData.append("StatusBit", data.status === "1" ? 1 : 0);
    }
    formData.append("RoleBit", Number(data.roleBit));
    // formData.append("HeightCm", data.height ? Number(data.height) : 0);
    // formData.append("WeightKg", data.weight ? Number(data.weight) : 0);
    // formData.append("BloodTypeId", data.bloodType ? Number(data.bloodType) : 0);
    // formData.append(
    //   "BloodComponentId",
    //   data.bloodComponent ? Number(data.bloodComponent) : 0
    // );

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

  // // Dynamically generate options for bloodType and bloodComponents
  // const bloodTypeOptions = bloodTypes.map((bt) => ({
  //   value: bt.bloodTypeId.toString(),
  //   label: `${bt.name}${bt.rhFactor}`,
  // }));

  // const bloodComponentOptions = bloodComponents.map((bc) => ({
  //   value: bc.bloodComponentId.toString(),
  //   label: bc.name,
  // }));

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
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-70"
          leave="ease-in duration-200"
          leaveFrom="opacity-70"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-70" />
        </Transition.Child>

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
                        disabled={!selectedUser} // Disabled nếu không có selectedUser (tạo mới)
                        // Nếu không phải tạo mới (chỉnh sửa), người dùng có thể thay đổi status
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
                          required: selectedUser
                            ? false
                            : "Password is required",
                          minLength: {
                            value: 4,
                            message: "At least 4 characters",
                          },
                          // pattern: {
                          //   value:
                          //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                          //   message:
                          //     "Must contain uppercase, lowercase, number, special char",
                          // },
                        }}
                        placeholder={
                          selectedUser
                            ? "Leave blank to keep current"
                            : "Enter password"
                        }
                        icon={FaLock}
                      />

                      {!selectedUser && (
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

                    {/* <div className="flex items-center space-x-2 py-4 border-t border-b border-gray-100 ">
                      <input
                        type="checkbox"
                        id="showAdditional"
                        checked={showAdditional}
                        onChange={(e) => setShowAdditional(e.target.checked)}
                        className="w-4 h-4 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <label
                        htmlFor="showAdditional"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 dark:hover:text-yellow-500 flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"
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
                            name="bloodType"
                            register={register}
                            errors={errors}
                            options={bloodTypeOptions}
                            placeholder="Select blood type"
                            icon={FaTint}
                          />

                          <SelectInput
                            label="Blood Component :"
                            name="bloodComponent"
                            register={register}
                            errors={errors}
                            options={bloodComponentOptions}
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
                            validation={{
                              // required: "Phone number is required",
                              pattern: {
                                value: /^[+\d]?(?:[\d\s-]{3,14}\d)$/,
                                message: "Invalid phone number format",
                              },
                              minLength: {
                                value: 9,
                                message: "Phone number too short",
                              },
                              maxLength: {
                                value: 15,
                                message: "Phone number too long",
                              },
                            }}
                          />

                          <DateInput
                            label="Date of Birth :"
                            name="dateOfBirth"
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
                              // required: "Email is required",
                              pattern: {
                                value:
                                  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address",
                              },
                            }}
                            placeholder="Enter email"
                            icon={FaEnvelope}
                          />
                          <TextInput
                            label="Height (cm) :"
                            name="height"
                            register={register}
                            errors={errors}
                            placeholder="Enter height"
                            icon={FaRulerVertical}
                          />

                          <TextInput
                            label="Weight (kg) :"
                            name="weight"
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
                            name="medicalHistory"
                            register={register}
                            errors={errors}
                            rows={3}
                            placeholder="Enter medical history"
                            icon={FaNotesMedical}
                          />
                        </div>
                        <hr className="border-gray-100" />
                      </div>
                    )} */}

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
                        className="px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-sky-400 to-blue-500 rounded-lg hover:brightness-90 transition-all duration-200 shadow-sm"
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
