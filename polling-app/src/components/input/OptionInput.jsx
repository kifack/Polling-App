import React, { useState } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { HiMiniPlus } from "react-icons/hi2";

const OptionInput = ({ optionList, setOptionList }) => {
  const [option, setOption] = useState("");

  // Add option
  const handleAddOption = () => {
    if (option.trim() && optionList.length < 4) {
      setOptionList([...optionList, option.trim()]);
      setOption("");
    }
  };

  // delete option
  const handledeleteOption = (index) => {
    const filteredList = optionList.filter((_, idx) => index !== idx);
    setOptionList(filteredList);
  };
  return (
    <div className=''>
      {optionList.map((item, index) => (
        <div
          key={index}
          className='flex justify-between bg-slate-300/60 px-4 py-2 rounded-md mb-2'
        >
          <p className='text-xs font-medium text-black'>{item}</p>

          <button
            className='cursor-pointer'
            onClick={() => handledeleteOption(index)}
          >
            <HiOutlineTrash className='text-lg text-red-500' />
          </button>
        </div>
      ))}

      {optionList.length < 4 && (
        <div className='flex items-center gap-5 mt-2'>
          <input
            type='text'
            className='w-full text-[13px] text-black outline-none bg-white px-3 py-[7px] rounded-md'
            placeholder='Enter option'
            value={option}
            onChange={({ target }) => setOption(target.value)}
          />
          <button
            className='btn-small text-nowrap py-[6px]'
            onClick={handleAddOption}
          >
            <HiMiniPlus className='text-lg' />
            Add Option
          </button>
        </div>
      )}
    </div>
  );
};

export default OptionInput;
