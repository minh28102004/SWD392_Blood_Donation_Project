import { useDropzone } from "react-dropzone";
import { FiUpload, FiX } from "react-icons/fi";
import { useCallback, useState, useEffect } from "react";
import { baseURL } from "@services/API/api";

const ImageUploadInput = ({
  value, // This will be the image URL or File object
  onChange,
  error,
  label = "Upload Image",
}) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (value) {
      // If the value is already a URL (string), use it directly for the preview
      if (typeof value === "string") {
        const fullUrl = value.startsWith("http") ? value : `${baseURL}${value}`;
        setPreview(fullUrl);
      }
      // If the value is a File object, create an object URL for preview
      else if (value instanceof File) {
        setPreview(URL.createObjectURL(value));
      }
    } else {
      setPreview(null);
    }
  }, [value]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        alert("File must be < 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("Only image files allowed");
        return;
      }

      onChange(file);
    },
    [onChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [] },
    maxFiles: 1,
  });

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange(null);
    setPreview(null);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500"
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 mx-auto rounded"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-0 right-0 p-1 bg-blue-500 text-white hover:bg-blue-700 rounded-full"
            >
              <FiX />
            </button>
          </div>
        ) : (
          <div>
            <FiUpload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-200" />
            <p className="mt-2 dark:text-gray-300">
              Drag & drop or click to upload
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Max file size: 5MB
            </p>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 mt-1 text-sm">{error}</p>}
    </div>
  );
};

export default ImageUploadInput;
