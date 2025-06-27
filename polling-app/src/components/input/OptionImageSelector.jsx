import React from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { HiMiniPlus } from "react-icons/hi2";

const OptionImageSelector = ({ imageList, setImageList }) => {
  // Add an image
  const handleAddImage = (event) => {
    const file = event.target.files[0];

    if (file && imageList.length < 4) {
      const reader = new FileReader();
      reader.onload = function () {
        setImageList([
          ...imageList,
          {
            base64: reader.result,
            file,
          },
        ]);
      };

      reader.readAsDataURL(file);
      event.target.value = null;
    }
  };

  // Delete an image
  const handleDeleteImage = (index) => {
    const filteredList = imageList.filter((_, idx) => index !== idx);
    setImageList(filteredList);
  };
  return (
    <div>
      <div className='grid grid-cols-2 gap-4 mb-4'>
        {imageList.map((image, index) => (
          <div className='bg-gray-600/10 rounded-md relative' key={index}>
            <img
              src={image.base64}
              alt='Image'
              className='w-full object-contain h-36 rounded-md '
            />
            <button
              onClick={() => handleDeleteImage(index)}
              className='text-red-500 bg-white rounded-full p-2 absolute top-2 right-2 cursor-pointer'
            >
              <HiOutlineTrash className='text-lg' />
            </button>
          </div>
        ))}
      </div>

      {imageList.length < 4 && (
        <div className='flex items-center gap-4'>
          <input
            type='file'
            accept='image/jpeg,image/png,image/jpg'
            onChange={handleAddImage}
            className='hidden'
            id='imageInput'
          />
          <label htmlFor='imageInput' className='btn-small text-nowrap'>
            <HiMiniPlus className='text-lg' />
            Select Image
          </label>
        </div>
      )}
    </div>
  );
};

export default OptionImageSelector;
