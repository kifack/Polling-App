import React, { useContext, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { UserContext } from "../../context/UserContext";
import { POLL_TYPES } from "../../utils/data";
import OptionInput from "../../components/input/OptionInput";
import OptionImageSelector from "../../components/input/OptionImageSelector";
import uploadImage from "../../utils/uploadImage";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
const CreatePoll = () => {
  const { onPollCreateOrDelete } = useContext(UserContext);

  const [pollData, setPollData] = useState({
    question: "",
    type: "",
    options: [],
    imagesOptions: [],
    error: "",
  });

  const handleValueChange = (key, value) => {
    setPollData((prev) => ({ ...prev, [key]: value }));
  };
  // Upload images and get images urls
  const updateImageAndGetLink = async (imageOptions) => {
    const optionPromises = imageOptions.map(async (imageOption) => {
      try {
        const imgUploadRes = await uploadImage(imageOption.file);
        return imgUploadRes.imageUrl || "";
      } catch (error) {
        toast.error(`Error uploading image ${imageOption.file.name}`);
        return "";
      }
    });

    const optionArray = await Promise.all(optionPromises);
    return optionArray;
  };
  const getOptions = async () => {
    switch (pollData.type) {
      case "single-choice":
        return pollData.options;
      case "image-based":
        const options = await updateImageAndGetLink(pollData.imagesOptions);
        return options;
      default:
        return [];
    }
  };
  const clearData = () => {
    setPollData({
      question: "",
      type: "",
      options: [],
      imagesOptions: [],
      error: "",
    });
  };
  const handleCreatePoll = async (event) => {
    const { question, type, options, imagesOptions, error } = pollData;

    if (!question || !type) {
      handleValueChange("error", "Question && Type are required");
      return;
    }

    if (type == "single-choice" && options.length < 2) {
      handleValueChange("error", "Enter a least two options");
      return;
    }

    if (type == "image-based" && imagesOptions.length < 2) {
      handleValueChange("error", "Enter a least two options");
      return;
    }

    handleValueChange("error", "");
    const optionsData = await getOptions();

    try {
      const response = await axiosInstance.post(API_PATHS.POLLS.CREATE, {
        question,
        type,
        options: optionsData,
      });

      if (response) {
        toast.success("Poll created successfully.");
        onPollCreateOrDelete();
        clearData();
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
        handleValueChange("error", error.response.data.message);
      } else {
        handleValueChange("error", "Something went wrong.Please try later.");
      }
    }
  };
  return (
    <DashboardLayout activeMenu='Create Poll'>
      <div className=' bg-slate-100/80 my-3 p-4 rounded-lg mx-auto'>
        <h2 className='text-lg font-medium text-black '>Create Poll</h2>

        <div className='mt-3'>
          <label className='text-xs text-slate-600 uppercase'>question :</label>
          <textarea
            cols='30'
            rows='4'
            placeholder="What's in your mind"
            className='w-full text-[13px] text-black font-light outline-none bg-slate-200/80 px-3 py-2 rounded-md mt-2'
            value={pollData.question}
            onChange={(e) => handleValueChange("question", e.target.value)}
          ></textarea>
        </div>

        <div className='mt-3'>
          <label className='text-xs text-slate-600 uppercase'>
            poll type :
          </label>
          <div className='flex gap-4 flex-wrap mt-1'>
            {POLL_TYPES.map((item) => (
              <div
                className={`option-chip ${
                  pollData.type == item.value
                    ? "bg-primary text-white border-primary"
                    : ""
                }`}
                key={item.id}
                onClick={(e) => handleValueChange("type", item.value)}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {pollData.type == "single-choice" && (
          <div className='mt-4'>
            <label className='text-xs font-medium text-slate-600 uppercase'>
              options
            </label>
            <div className='mt-2'>
              <OptionInput
                optionList={pollData.options}
                setOptionList={(value) => handleValueChange("options", value)}
              />
            </div>
          </div>
        )}

        {pollData.type == "image-based" && (
          <div className='mt-4'>
            <label className='text-xs font-medium text-slate-600 uppercase'>
              image options
            </label>
            <div className='mt-2'>
              <OptionImageSelector
                imageList={pollData.imagesOptions}
                setImageList={(value) =>
                  handleValueChange("imagesOptions", value)
                }
              />
            </div>
          </div>
        )}

        {pollData.error && (
          <p className='text-xs font-medium text-red-500 mt-3'>
            {pollData.error}
          </p>
        )}

        <button
          className='btn-primary my-2 py-2 uppercase'
          onClick={handleCreatePoll}
        >
          Create
        </button>
      </div>
    </DashboardLayout>
  );
};

export default CreatePoll;
