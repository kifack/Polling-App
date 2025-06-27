import React, { useRef, useState } from "react";
import { LuUser, LuUpload, LuTrash2 } from "react-icons/lu";
const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };
  const onChooseFile = () => {
    inputRef.current.click();
  };
  return (
    <div className='flex justify-center mb-6'>
      <input
        type='file'
        ref={inputRef}
        onChange={handleImageChange}
        className='hidden'
      />
      {!image ? (
        <div className='w-20 h-20 flex justify-center items-center bg-sky-100 rounded-full relative'>
          <LuUser className='text-4xl text-primary' />
          <button
            type='button'
            className='w-7 h-7 flex items-center justify-center bg-primary text-white 
        rounded-full absolute -bottom-1 -right-1 cursor-pointer'
            onClick={onChooseFile}
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className='relative'>
          <img
            src={previewUrl}
            alt='Profile photo'
            className='w-20 h-20 rounded-full object-cover border-4 border-primary'
          />
          <button
            type='button'
            className='w-7 h-7 flex items-center justify-center bg-red-400 text-white 
        rounded-full absolute -bottom-1 -right-1 cursor-pointer hover:opacity-80'
            onClick={handleRemoveImage}
          >
            <LuTrash2 />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
