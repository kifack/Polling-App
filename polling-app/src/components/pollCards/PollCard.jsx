import React, { useCallback, useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { getPollBookmarked } from "../../utils/helper";
import UserProfileInfo from "../cards/UserProfileInfo";
import PollActions from "./PollActions";
import PollContent from "./PollContent";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import PollingResultContent from "./PollingResultContent";

const PollCard = ({
  pollId,
  question,
  type,
  options,
  voters,
  responses,
  creatorProfileImg,
  creatorName,
  creatorUsername,
  userHasVoted,
  isPollClosed,
  createdAt,
  isMyPoll,
}) => {
  const { user, onUserVoted, toggleBookmarkId, onPollCreateOrDelete } =
    useContext(UserContext);

  const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1);
  const [rating, setRating] = useState(0);
  const [userResponse, setUserResponse] = useState("");
  const [isVoteComplete, setIsVoteComplete] = useState(userHasVoted);

  const [pollResult, setPollResult] = useState({
    options,
    voters,
    responses,
  });

  const isPollBookmarked = getPollBookmarked(
    pollId,
    user.bookmarkedPolls || []
  );

  const [pollBookmarked, setPollBookmarked] = useState(isPollBookmarked);
  const [pollClosed, setPollClosed] = useState(isPollClosed || false);
  const [pollDeleted, setPollDeleted] = useState(false);

  const getPollDetail = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.POLLS.GET_BY_ID(pollId)
      );

      if (response.data) {
        const pollDetails = response.data;
        setPollResult({
          options: pollDetails.options || [],
          voters: pollDetails.voters.length || 0,
          responses: pollDetails.responses || [],
        });
      }
    } catch (error) {
      console.log(error.response?.data?.message || "Error geting Poll Details");
    }
  };

  const handleInput = (value) => {
    if (type === "rating") setRating(value);
    else if (type === "open-ended") setUserResponse(value);
    else setSelectedOptionIndex(value);
  };

  // Handles the submission of votes
  const handleVoteSubmit = async () => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.POLLS.VOTE(pollId),
        getPostData()
      );
      getPollDetail();
      onUserVoted();
      setIsVoteComplete(true);
      toast.success("Vote submitted successfully.");
    } catch (error) {
      console.log(error.response?.data?.message || "Error voting Poll ");
    }
  };

  const getPostData = useCallback(() => {
    if (type == "open-ended") {
      return { responseText: userResponse };
    }

    if (type == "rating") {
      return { optionIndex: rating - 1 };
    }

    return { optionIndex: selectedOptionIndex };
  });

  const toggleBookmark = async () => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.POLLS.BOOKMARK(pollId)
      );
      toggleBookmarkId(pollId);
      setPollBookmarked((prev) => !prev);
      toast.success(response.data.message);
    } catch (error) {
      console.error(error);
      console.error(error.response?.data?.message || "Error bookmarking poll");
    }
  };

  const closePoll = async () => {
    try {
      const response = await axiosInstance.post(API_PATHS.POLLS.CLOSE(pollId));

      if (response.data) {
        setPollClosed(true);
        toast.success(response.data?.message || "Poll closed successfully.");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  const deletePoll = async () => {
    try {
      const response = await axiosInstance.delete(
        API_PATHS.POLLS.DELETE(pollId)
      );

      if (response.data) {
        setPollDeleted(true);
        onPollCreateOrDelete("delete");
        toast.success(response.data?.message || "Poll deleted successfully.");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };
  return (
    !pollDeleted && (
      <div className='bg-slate-100/50 my-4 rounded-lg border border-slate-100 mx-auto p-2'>
        <div className='flex items-start justify-between'>
          <UserProfileInfo
            img={creatorProfileImg}
            fullName={creatorName}
            username={creatorUsername}
            createdAt={createdAt}
          />

          <PollActions
            pollId={pollId}
            isVoteComplete={isVoteComplete}
            inputCaptured={
              !!(userResponse || selectedOptionIndex >= 0 || rating)
            }
            onVoteSubmit={handleVoteSubmit}
            isBookmarked={pollBookmarked}
            toggleBookmark={toggleBookmark}
            isMyPoll={isMyPoll}
            pollClosed={pollClosed}
            onClosePoll={closePoll}
            onDelete={deletePoll}
          />
        </div>

        <div className='ml-12 mt-3'>
          <p className='text-[15px] text-black leading-8'>{question}</p>
          <div className='mt-2'>
            {isVoteComplete || isPollClosed ? (
              <PollingResultContent
                type={type}
                options={pollResult.options || []}
                voters={pollResult.voters}
                responses={pollResult.responses || []}
              />
            ) : (
              <PollContent
                type={type}
                options={options}
                selectedOptionIndex={selectedOptionIndex}
                onOptionSelect={handleInput}
                rating={rating}
                onRatingChange={handleInput}
                userResponse={userResponse}
                onResponseChange={handleInput}
              />
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default PollCard;
