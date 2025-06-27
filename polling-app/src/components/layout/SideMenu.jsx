import React, { useContext } from "react";
import { SIDE_MENU_DATA } from "../../utils/data";
import { useNavigate } from "react-router";
import { UserContext } from "../../context/UserContext";

const SideMenu = ({ activeMenu }) => {
  const { clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const handleClick = (path) => {
    if (path == "/logout") {
      handleLogout();
      return;
    }
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };
  return (
    <div className='w-[200px] h-[calc(100vh-55px)] bg-slate-50/50 border-r border-slate-100/70 p-5 sticky top-[50px] z-30'>
      {SIDE_MENU_DATA.map((item) => (
        <button
          className={`w-full flex items-center gap-3 text-[15px] ${
            activeMenu == item.label
              ? "text-white bg-primary"
              : "hover:bg-primary/30 hover:text-white"
          } py-2 px-3 rounded-full mb-2 cursor-pointer focus:outline-0`}
          key={`menu_${item.id}`}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className='text-xl' />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SideMenu;
