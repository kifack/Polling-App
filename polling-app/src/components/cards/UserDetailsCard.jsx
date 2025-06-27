import React from "react";
import ChartAvatar from "./ChartAvatar";

const UserDetailsCard = ({ user }) => {
  if (!user) return;
  return (
    <div className='bg-slate-100/50 rounded-lg mt-10 overflow-hidden'>
      <div className='w-full h-28 bg-profile bg-cover flex justify-center  bg-sky-500 relative'>
        <div className='absolute -bottom-7 rounded-full overflow-hidden border-2 border-primary'>
          {user.profileImageUrl ? (
            <img
              src={user && user.profileImageUrl}
              alt='Profile Image'
              className='w-20 h-20 bg-slate-400 rounded-full'
            />
          ) : (
            <ChartAvatar
              fullName={user.fullName}
              width='w-20'
              height='h-20'
              style='text-xl'
            />
          )}
        </div>
      </div>

      <div className='mt-8 px-5'>
        <div className='text-center pt-1'>
          <h5 className='text-lg text-gray-950 font-medium leading-4'>
            {user && user.fullName}
          </h5>
          <span className='text-[13px] font-medium text-primary'>
            @{user && user.username}
          </span>
        </div>

        <div className='flex justify-center items-center gap-2  my-3'>
          <StatsInfo
            label='Polls Created'
            value={user.totalPollsCreated || 0}
          />
          <StatsInfo label='Polls Voted' value={user.totalPollsVotes || 0} />
          <StatsInfo
            label='Polls Bookmarked'
            value={user.totalPollsBookmarked || 0}
          />
        </div>
      </div>
    </div>
  );
};

const StatsInfo = ({ label, value }) => {
  return (
    <div className='text-center'>
      <p className='font-medium text-primary/80'>{value}</p>
      <p className='text-[9px] min-[1200px]:text-[15px] text-slate-700/80 mt-[2px]'>
        {label}
      </p>
    </div>
  );
};

export default UserDetailsCard;
