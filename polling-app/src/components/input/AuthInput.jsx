import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaRegEye, FaEyeSlash } from "react-icons/fa6";

const AuthInput = ({ value, onChange, label, placeholder, type }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <div>
      <label className='text-[13px] text-slate-800 font-medium'>{label}</label>
      <div className='input-box'>
        <input
          type={
            type == "password" ? (showPassword ? "text" : "password") : "text"
          }
          placeholder={placeholder}
          className='w-full bg-transparent outline-none'
          value={value}
          onChange={onChange}
        />

        {type == "password" && (
          <>
            {!showPassword ? (
              <FaRegEye
                size={12}
                className='text-primary cursor-pointer'
                onClick={() => toggleShowPassword()}
              />
            ) : (
              <FaEyeSlash
                size={22}
                className='text-slate-400 cursor-pointer'
                onClick={() => toggleShowPassword()}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AuthInput;
