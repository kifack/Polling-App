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

const PAGE_SIZE = 5;
const VotedPolls = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [votedPolls, setVotedPolls] = useState([]);
  const [stats, setStats] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchAllPolls = async (overridePage = page) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.POLLS.VOTED_POLLS}?page=${page}&limit=${PAGE_SIZE}`
      );

      if (response.data?.polls?.length > 0) {
        setVotedPolls((prevPolls) =>
          overridePage == 1
            ? response.data.polls
            : [...prevPolls, ...response.data.polls]
        );
        setStats(response.data?.stat || []);
        setHasMore(response.data.polls.length == PAGE_SIZE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const loadMorePolls = () => {
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    setPage(1);
    fetchAllPolls(1);
    return () => {};
  }, []);

  useEffect(() => {
    if (page != 1) {
      fetchAllPolls();
    }
    return () => {};
  }, [page]);
  return (
    <DashboardLayout activeMenu='Voted Polls'>
      <div className='my-4 mx-auto'>
        <h2 className='text-xl font-medium text-black'>Voted Polls</h2>

        {votedPolls.length === 0 && !loading && (
          <EmptyCard
            imgSrc={CREATE_ICON}
            message='Welcome! .You have not voted yet.Please give your opinion on polls.
            '
            btnText='Explore poll'
            onClick={() => navigate("/dashboard")}
          />
        )}

        <InfiniteScroll
          dataLength={votedPolls.length}
          next={loadMorePolls}
          hasMore={hasMore}
          loader={<h4 className='info-text'>Loading...</h4>}
          endMessage={<p className='info-text'>No more polls to display.</p>}
        >
          {votedPolls.map((poll) => (
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
        </InfiniteScroll>
      </div>
    </DashboardLayout>
  );
};

export default VotedPolls;
