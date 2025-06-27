import React from "react";
import { getInitials } from "../../utils/helper";

const ChartAvatar = ({ fullName, width, height, style }) => {
  return (
    <div
      className={`${width || "w-12"}  ${
        height || "h-12"
      } ${style} flex items-center justify-center rounded-full text-white font-medium bg-sky-200`}
    >
      {getInitials(fullName || "")}
    </div>
  );
};

export default ChartAvatar;
