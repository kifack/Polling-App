import React from "react";
import ChartAvatar from "./ChartAvatar";
import moment from "moment";
const UserProfileInfo = ({ img, fullName, username, createdAt }) => {
  return (
    <div className='flex items-center gap-4'>
      {img ? (
        <img src={img} className='w-10 h-10 rounded-full border-none' />
      ) : (
        <ChartAvatar fullName={fullName} style='text-[13px]' />
      )}

      <div className=''>
        <p className='text-sm text-black font-medium leading-4 flex items-center'>
          {fullName}
          <span className=' w-1 h-1 bg-slate-500 rounded-full inline-block mx-2'></span>
          <span className='text-[11px] text-slate-500'>
            {createdAt && moment(createdAt).fromNow()}
          </span>
        </p>
        <span className='text-[11.5px] text-slate-500 leading-4'>
          @{username}
        </span>
      </div>
    </div>
  );
};

export default UserProfileInfo;
