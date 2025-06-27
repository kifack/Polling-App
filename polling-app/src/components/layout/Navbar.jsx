import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";
const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  return (
    <div
      className='flex gap-4 border-b border-white bg-slate-50/50 backdrop-blur-[2px]
    p-3 sticky top-0 z-30'
    >
      <button
        className='block lg:hidden text-black cursor-pointer'
        onClick={() => {
          setOpenSideMenu(!openSideMenu);
        }}
      >
        {openSideMenu ? (
          <HiOutlineX className='text-2xl text-primary' />
        ) : (
          <HiOutlineMenu className='text-2xl text-primary' />
        )}
      </button>
      <h2 className='text-lg font-medium text-primary'>Polling App</h2>

      {openSideMenu && (
        <div className='fixed top-[50px] -ml-4 bg-white'>
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
