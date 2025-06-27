import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useNavigate } from "react-router";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import PollCard from "../../components/pollCards/PollCard";
import InfiniteScroll from "react-infinite-scroll-component";
import CREATE_ICON from "../../assets/images/my-poll-icon.png";

import EmptyCard from "../../components/cards/EmptyCard";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

const Bookmarks = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [bookmarkedPolls, setBookmarkedPolls] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllPolls = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.POLLS.GET_BOOKMARKED}`
      );
      console.log(response);
      setBookmarkedPolls(response.data.bookmarkedPolls);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPolls();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu='Bookmarks'>
      <div className='my-4 mx-auto'>
        <h2 className='text-xl font-medium text-black'>Bookmarked Polls</h2>

        {bookmarkedPolls.length === 0 && !loading && (
          <EmptyCard
            imgSrc={CREATE_ICON}
            message='Welcome! .You have not bookmarked a poll yet yet.
            '
            btnText='Explore poll'
            onClick={() => navigate("/dashboard")}
          />
        )}

        {bookmarkedPolls.map((poll) => (
          <PollCard
            key={`dashboard_${poll._id}`}
            pollId={poll._id}
            question={poll.question}
            type={poll.type}
            options={poll.options}
            voters={poll.voters.length || 0}
            responses={poll.responses || []}
            isMyPoll={poll.creator._id == user._id}
            creatorProfileImg={poll.creator.profileImageUrl || null}
            creatorName={poll.creator.fullName}
            creatorUsername={poll.creator.username}
            userHasVoted={poll.userHasVoted || false}
            isPollClosed={poll.closed || false}
            createdAt={poll.createdAt || false}
          />
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Bookmarks;
