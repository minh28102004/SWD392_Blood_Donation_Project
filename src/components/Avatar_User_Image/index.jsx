import React from "react";

const avatarColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-emerald-500",
];

const getColorFromName = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % avatarColors.length;
  return avatarColors[index];
};

const getInitials = (name) => {
  if (!name) return "";
  const parts = name.trim().split(" ");
  const first = parts[0]?.[0]?.toUpperCase() || "";
  const last =
    parts.length > 1 ? parts[parts.length - 1]?.[0]?.toUpperCase() : "";
  return first + last;
};

const AvatarUserImage = ({
  name = "User",
  avatarUrl,
  size = 36, // pixel size or Tailwind class externally
  className = "",
}) => {
  const bgColor = getColorFromName(name);

  // If `size` is a number, use inline style
  const isNumberSize = typeof size === "number";
  const pixelSize = isNumberSize ? `${size}px` : undefined;
  const fontSize = isNumberSize ? `${size / 2.2}px` : undefined;

  return (
    <div
      className={`relative rounded-full text-white flex items-center justify-center font-semibold overflow-hidden ${bgColor} ${className}`}
      style={
        isNumberSize
          ? {
              width: pixelSize,
              height: pixelSize,
              fontSize: fontSize,
            }
          : undefined
      }
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="User Avatar"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      ) : (
        <span className="z-10">{getInitials(name)}</span>
      )}
    </div>
  );
};

export default AvatarUserImage;
