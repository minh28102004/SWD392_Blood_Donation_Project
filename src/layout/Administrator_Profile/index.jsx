import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grow,
  Box,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import Avatar from "@components/Avatar_User_Image";
import { FaTimes } from "react-icons/fa";
import {
  updateUser,
  fetchUserById,
  setShouldReloadList,
} from "@redux/features/userSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

const AdminProfileModal = ({
  isOpen,
  onClose,
  initialData,
  roleOptions = [],
  statusOptions = [],
}) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const password = watch("password") || "";
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    if (isOpen && initialData) {
      reset({
        name: initialData.name || "",
        email: initialData.email || "",
        roleBit: initialData.roleBit ?? "",
        statusBit: initialData.statusBit === 1 ? 1 : 0,
        password: "",
      });
      setIsEditable(false);
    }
  }, [isOpen, initialData, reset]);

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

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
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
        return "bg-gray-300 w-0";
    }
  };

  const getPasswordStrengthLabel = () => {
    switch (passwordStrength) {
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
        return "0%";
    }
  };

  const internalSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("roleBit", data.roleBit);
    formData.append("statusBit", data.statusBit);
    if (data.password) {
      formData.append("password", data.password);
    }

    try {
      await dispatch(updateUser({ id: initialData.userId, formData })).unwrap();
      await dispatch(fetchUserById(initialData.userId));
      dispatch(setShouldReloadList(true));
      toast.success("User updated successfully!");
      setIsEditable(false);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(error?.message || "Failed to update user");
    }
  };

  const sharedInputProps = {
    className: "bg-white dark:bg-slate-800 text-black dark:text-white",
  };

  const sharedLabelProps = {
    className: "text-gray-700 dark:text-gray-300",
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      TransitionComponent={Grow}
      PaperProps={{
        className: "bg-white text-black dark:bg-slate-900 dark:text-slate-100",
      }}
    >
      <form onSubmit={handleSubmit(internalSubmit)} noValidate>
        <button
          onClick={onClose}
          type="button"
          className="absolute right-4 top-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          py={2}
          className="bg-gray-100 dark:bg-slate-800"
        >
          <Avatar
            name={initialData?.name}
            avatarUrl={initialData?.avatar}
            size={64}
          />
          <Typography variant="h6" className="text-gray-600 dark:text-gray-300">
            {initialData?.userName}
          </Typography>
        </Box>

        <DialogContent className="bg-white dark:bg-slate-900">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              fullWidth
              size="small"
              label="Full Name"
              disabled={!isEditable}
              {...register("name", {
                required: "Full name is required",
                minLength: { value: 2, message: "At least 2 characters" },
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
              InputProps={sharedInputProps}
              InputLabelProps={sharedLabelProps}
            />
            <TextField
              fullWidth
              size="small"
              label="Email"
              disabled={!isEditable}
              {...register("email", {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={sharedInputProps}
              InputLabelProps={sharedLabelProps}
            />
            <Controller
              name="roleBit"
              control={control}
              rules={{ required: "Role is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  select
                  size="small"
                  label="Role"
                  disabled={!isEditable}
                  error={!!errors.roleBit}
                  helperText={errors.roleBit?.message}
                  InputProps={sharedInputProps}
                  InputLabelProps={sharedLabelProps}
                >
                  {roleOptions.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="statusBit"
              control={control}
              rules={{ required: "Status is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  select
                  size="small"
                  label="Status"
                  disabled={!isEditable}
                  error={!!errors.statusBit}
                  helperText={errors.statusBit?.message}
                  InputProps={sharedInputProps}
                  InputLabelProps={sharedLabelProps}
                >
                  {statusOptions.map((status) => (
                    <MenuItem key={status.id} value={status.id}>
                      {status.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <TextField
              fullWidth
              size="small"
              label="Password"
              type="password"
              disabled={!isEditable}
              {...register("password", {
                minLength: {
                  value: 4,
                  message: "Password must be at least 4 characters",
                },
              })}
              error={!!errors.password}
              helperText={
                errors.password?.message || (
                  <span className="text-xs text-gray-500 dark:text-white/70 italic">
                    ( Note: Leave blank to keep current )
                  </span>
                )
              }
              InputProps={sharedInputProps}
              InputLabelProps={sharedLabelProps}
            />
            {password.length > 0 && (
              <div>
                <div className="h-2 w-full rounded-full bg-gray-200 mt-2">
                  <div
                    className={`${getPasswordStrengthColor()} h-2 rounded-full transition-all duration-300`}
                  />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-300 block mt-1">
                  {getPasswordStrengthLabel()}
                </span>
                <p className="text-xs italic mt-1 text-gray-500 dark:text-gray-300">
                  {passwordStrength <= 1 &&
                    "Password is very weak, try adding uppercase letters, numbers, or special characters."}
                  {passwordStrength === 2 &&
                    "Weak password, consider adding more character types."}
                  {passwordStrength === 3 &&
                    "Moderate strength, can be improved with more variety."}
                  {passwordStrength === 4 && "Strong password, good job!"}
                  {passwordStrength === 5 && "Very strong password!"}
                </p>
              </div>
            )}
          </div>
        </DialogContent>

        <DialogActions className="bg-gray-100 dark:bg-slate-800">
          {!isEditable ? (
            <Button
              onClick={() => setIsEditable(true)}
              variant="contained"
              size="small"
            >
              Edit
            </Button>
          ) : (
            <>
              <Button
                onClick={() => setIsEditable(false)}
                variant="outlined"
                size="small"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="small"
              >
                Update
              </Button>
            </>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AdminProfileModal;
