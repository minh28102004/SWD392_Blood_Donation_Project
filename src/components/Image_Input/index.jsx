import { useDropzone } from "react-dropzone";
import { FiUpload, FiX } from "react-icons/fi";
import { useCallback, useState } from "react";

const ImageUploadInput = ({
  value,
  onChange,
  error,
  label = "Upload Image",
}) => {
  const [preview, setPreview] = useState(
    value ? URL.createObjectURL(value) : null
  );

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
      setPreview(URL.createObjectURL(file));
    },
    [onChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [] },
    maxFiles: 1,
  });

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" >
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
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
                setPreview(null);
              }}
              className="absolute top-0 right-0 p-1 bg-blue-500 text-white hover:bg-blue-700 rounded-full"
            >
              <FiX />
            </button>
          </div>
        ) : (
          <div>
            <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2">Drag & drop or click to upload</p>
            <p className="text-sm text-gray-500">Max file size: 5MB</p>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 mt-1 text-sm">{error}</p>}
    </div>
  );
};

export default ImageUploadInput;
