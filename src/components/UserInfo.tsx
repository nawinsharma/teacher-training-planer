import { ImageIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
interface UserInfoProps {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}
const UserInfo: React.FC<UserInfoProps> = ({ name, email, image }) => {
  return (
    <div className="max-w-sm w-full bg-white shadow-lg rounded-lg p-6">
      {/* User Image */}
      <div className="flex justify-center mb-4">
        {image ? (
          <Image
            src={image}
            alt="User Image"
            width={96}
            height={96}
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          />
        ) : (
          <div className="w-24 h-24 rounded-full object-cover border-2 border-gray-200">
            <ImageIcon />
          </div>
        )}
      </div>

      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800">
          {name || "Unnamed User"}
        </h2>
        <p className="text-gray-600">{email || "Email: Not provided"}</p>
      </div>
    </div>
  );
};

export default UserInfo;
