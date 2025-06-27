import React, { useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
const PollActions = ({
  pollId,
  isVoteComplete,
  inputCaptured,
  onVoteSubmit,
  isBookmarked,
  toggleBookmark,
  isMyPoll,
  pollClosed,
  onClosePoll,
  onDelete,
}) => {
  const [loading, setLoading] = useState(false);
  const handleVoteClick = async () => {
    setLoading(true);
    try {
      await onVoteSubmit();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleCloseClick = async () => {
    setLoading(true);
    try {
      await onClosePoll();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async () => {
    setLoading(true);
    try {
      await onDelete();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='flex items-center gap-4'>
      {(isVoteComplete || pollClosed) && (
        <div className='text-[11px] font-medium text-slate-600 bg-sky-700/20 p-1 rounded-md'>
          {pollClosed ? "Closed" : "Voted"}
        </div>
      )}

      {isMyPoll && !pollClosed && (
        <button
          className='btn-small text-orange-500 bg-orange-500/20 hover:bg-orange-500 hover:text-white hover:border-orange-100'
          onClick={handleCloseClick}
          disabled={loading}
        >
          Close
        </button>
      )}

      {isMyPoll && (
        <button
          className='btn-small text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white hover:border-orange-100'
          onClick={handleDeleteClick}
          disabled={loading}
        >
          Delete
        </button>
      )}
      <button className='icon-btn' onClick={toggleBookmark}>
        {isBookmarked ? (
          <FaBookmark className='text-primary' />
        ) : (
          <FaRegBookmark />
        )}
      </button>

      {inputCaptured && !isVoteComplete && (
        <button
          className='btn-small ml-auto'
          onClick={handleVoteClick}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      )}
    </div>
  );
};

export default PollActions;
