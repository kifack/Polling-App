import React, { useContext } from "react";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";
import UserDetailsCard from "../cards/UserDetailsCard";
import { UserContext } from "../../context/UserContext";
import useUserAuth from "../../hooks/useUserAuth";

const DashboardLayout = ({ children, activeMenu }) => {
  useUserAuth();
  const { user } = useContext(UserContext);
  return (
    <div>
      <Navbar activeMenu={activeMenu} />
      {user && (
        <div className='flex'>
          <div className='max-[1000px]:hidden'>
            <SideMenu activeMenu={activeMenu} />
          </div>
          <div className='grow mx-3'> {children}</div>
          <div className='hidden md:block mr-3'>
            <UserDetailsCard user={user} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
